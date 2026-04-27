"""
services/wrapper_engine.py

Generic wrapper code generator for all supported languages.
Dynamically builds main() around user's function code based on
question metadata (input_format, return_type, function_name).

Supported types:
  C++:    int, long long, bool, string, vector<int>, vector<long long>,
          vector<string>, vector<vector<int>>, TreeNode*, void
  Python: int, bool, str, List[int], List[List[int]], List[str], Optional[TreeNode], None
  Java:   int, boolean, String, int[], int[][], String[], void

Special cases:
  - TreeNode* / Optional[TreeNode]: auto-builds a binary tree from level-order array input
  - void return_type: auto-prints the mutated first matrix/vector argument
  - __DESIGN__: skips wrapper generation (design problems handled separately)
"""

import json
import re
from typing import Any


# ─────────────────────────────────────────────────────────────────────────────
# PUBLIC ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

def generate_wrapper(user_code: str, question: dict, stdin: str, language: str) -> str:
    """
    Build a complete, compilable source file for the given language.

    Args:
        user_code: The function body written by the user (no main).
        question:  Full MongoDB question document.
        stdin:     The raw testcase input string (multi-line).
        language:  One of "cpp", "python", "java".

    Returns:
        Full source code string ready to send to Judge0.

    Raises:
        ValueError: For unsupported languages or design questions.
    """
    fn_name   = question.get("function_name", "")
    ret_type  = question.get("return_type", "")
    in_fmt    = question.get("input_format", [])

    if fn_name == "__DESIGN__":
        raise ValueError(
            "Design questions are not supported by the wrapper engine. "
            "Use the design-question executor instead."
        )

    lang = language.lower().strip()
    if lang in ("cpp", "c++"):
        return _cpp_wrapper(user_code, fn_name, ret_type, in_fmt, stdin)
    elif lang in ("python", "py", "python3"):
        return _python_wrapper(user_code, fn_name, ret_type, in_fmt, stdin)
    elif lang == "java":
        return _java_wrapper(user_code, fn_name, ret_type, in_fmt, stdin)
    else:
        raise ValueError(f"Unsupported language: {language}")


# ─────────────────────────────────────────────────────────────────────────────
# C++ WRAPPER
# ─────────────────────────────────────────────────────────────────────────────

_CPP_TREE_HELPERS = r"""
struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v=0) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(const vector<string>& tokens) {
    if (tokens.empty() || tokens[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(tokens[0]));
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < (int)tokens.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < (int)tokens.size() && tokens[i] != "null") {
            node->left = new TreeNode(stoi(tokens[i]));
            q.push(node->left);
        }
        i++;
        if (i < (int)tokens.size() && tokens[i] != "null") {
            node->right = new TreeNode(stoi(tokens[i]));
            q.push(node->right);
        }
        i++;
    }
    return root;
}

vector<string> parseTreeTokens(const string& s) {
    // parse "[1,null,2,3]" → {"1","null","2","3"}
    string inner = s;
    if (!inner.empty() && inner.front() == '[') inner = inner.substr(1);
    if (!inner.empty() && inner.back() == ']') inner.pop_back();
    vector<string> tokens;
    stringstream ss(inner);
    string tok;
    while (getline(ss, tok, ',')) {
        // trim whitespace
        tok.erase(0, tok.find_first_not_of(" \t"));
        tok.erase(tok.find_last_not_of(" \t") + 1);
        tokens.push_back(tok);
    }
    return tokens;
}
"""

_CPP_PARSE_HELPERS = r"""
// ── parse helpers ──────────────────────────────────────────────────────────

vector<int> parseVecInt(const string& s) {
    vector<int> v;
    string inner = s;
    if (!inner.empty() && inner.front() == '[') inner = inner.substr(1);
    if (!inner.empty() && inner.back()  == ']') inner.pop_back();
    if (inner.empty()) return v;
    stringstream ss(inner);
    string tok;
    while (getline(ss, tok, ',')) {
        tok.erase(0, tok.find_first_not_of(" \t"));
        tok.erase(tok.find_last_not_of(" \t") + 1);
        v.push_back(stoi(tok));
    }
    return v;
}

vector<long long> parseVecLL(const string& s) {
    vector<long long> v;
    string inner = s;
    if (!inner.empty() && inner.front() == '[') inner = inner.substr(1);
    if (!inner.empty() && inner.back()  == ']') inner.pop_back();
    if (inner.empty()) return v;
    stringstream ss(inner);
    string tok;
    while (getline(ss, tok, ',')) {
        tok.erase(0, tok.find_first_not_of(" \t"));
        tok.erase(tok.find_last_not_of(" \t") + 1);
        v.push_back(stoll(tok));
    }
    return v;
}

vector<string> parseVecStr(const string& s) {
    // handles ["abc","def"]  or  [wrt,wrf,er]
    vector<string> v;
    string inner = s;
    if (!inner.empty() && inner.front() == '[') inner = inner.substr(1);
    if (!inner.empty() && inner.back()  == ']') inner.pop_back();
    if (inner.empty()) return v;
    // split respecting quotes
    bool inq = false;
    string tok;
    for (char c : inner) {
        if (c == '"') { inq = !inq; continue; }
        if (c == ',' && !inq) { v.push_back(tok); tok.clear(); continue; }
        tok += c;
    }
    if (!tok.empty()) v.push_back(tok);
    return v;
}

vector<vector<int>> parseVecVecInt(const string& s) {
    vector<vector<int>> res;
    // find each inner [...]
    int depth = 0;
    string cur;
    for (int i = 0; i < (int)s.size(); i++) {
        char c = s[i];
        if (c == '[') {
            depth++;
            if (depth == 2) { cur.clear(); continue; }
        } else if (c == ']') {
            depth--;
            if (depth == 1) { res.push_back(parseVecInt("[" + cur + "]")); continue; }
        }
        if (depth == 2) cur += c;
    }
    return res;
}

vector<vector<string>> parseVecVecStr(const string& s) {
    vector<vector<string>> res;
    int depth = 0;
    string cur;
    bool inq = false;
    for (int i = 0; i < (int)s.size(); i++) {
        char c = s[i];
        if (c == '"') { inq = !inq; if (depth >= 2) cur += c; continue; }
        if (!inq) {
            if (c == '[') {
                depth++;
                if (depth == 2) { cur.clear(); continue; }
            } else if (c == ']') {
                depth--;
                if (depth == 1) {
                    res.push_back(parseVecStr("[" + cur + "]"));
                    continue;
                }
            }
        }
        if (depth == 2) cur += c;
    }
    return res;
}

// ── print helpers ───────────────────────────────────────────────────────────

void printVecInt(const vector<int>& v) {
    cout << "[";
    for (int i = 0; i < (int)v.size(); i++) {
        if (i) cout << ",";
        cout << v[i];
    }
    cout << "]" << endl;
}

void printVecLL(const vector<long long>& v) {
    cout << "[";
    for (int i = 0; i < (int)v.size(); i++) {
        if (i) cout << ",";
        cout << v[i];
    }
    cout << "]" << endl;
}

void printVecVecInt(const vector<vector<int>>& v) {
    cout << "[";
    for (int i = 0; i < (int)v.size(); i++) {
        if (i) cout << ",";
        cout << "[";
        for (int j = 0; j < (int)v[i].size(); j++) {
            if (j) cout << ",";
            cout << v[i][j];
        }
        cout << "]";
    }
    cout << "]" << endl;
}

void printVecStr(const vector<string>& v) {
    cout << "[";
    for (int i = 0; i < (int)v.size(); i++) {
        if (i) cout << ",";
        cout << "\"" << v[i] << "\"";
    }
    cout << "]" << endl;
}

void printVecVecStr(const vector<vector<string>>& v) {
    cout << "[";
    for (int i = 0; i < (int)v.size(); i++) {
        if (i) cout << ",";
        cout << "[";
        for (int j = 0; j < (int)v[i].size(); j++) {
            if (j) cout << ",";
            cout << "\"" << v[i][j] << "\"";
        }
        cout << "]";
    }
    cout << "]" << endl;
}
"""


def _cpp_parse_line(param: dict, line: str) -> str:
    """Generate C++ code to parse one input line into a typed variable."""
    t    = param["type"]
    name = param["name"]

    if t == "int":
        return f"int {name} = stoi({_cpp_line_var(name)});"
    if t == "long long":
        return f"long long {name} = stoll({_cpp_line_var(name)});"
    if t == "bool":
        return f"bool {name} = ({_cpp_line_var(name)} == \"true\");"
    if t == "string":
        return f"string {name} = {_cpp_line_var(name)};"
    if t in ("vector<int>", "vector<int>&"):
        return f"vector<int> {name} = parseVecInt({_cpp_line_var(name)});"
    if t in ("vector<long long>",):
        return f"vector<long long> {name} = parseVecLL({_cpp_line_var(name)});"
    if t in ("vector<string>",):
        return f"vector<string> {name} = parseVecStr({_cpp_line_var(name)});"
    if t in ("vector<vector<int>>", "vector<vector<int>>&"):
        return f"vector<vector<int>> {name} = parseVecVecInt({_cpp_line_var(name)});"
    if t in ("vector<vector<string>>",):
        return f"vector<vector<string>> {name} = parseVecVecStr({_cpp_line_var(name)});"
    if t == "TreeNode*":
        return (
            f"vector<string> _tokens_{name} = parseTreeTokens({_cpp_line_var(name)});\n"
            f"    TreeNode* {name} = buildTree(_tokens_{name});"
        )
    raise ValueError(f"Unsupported C++ type: {t}")


def _cpp_line_var(name: str) -> str:
    return f"_line_{name}"


def _cpp_print_result(ret_type: str, first_param: dict | None) -> str:
    """Generate C++ code to print the return value."""
    rt = ret_type
    if rt == "void":
        # print the (mutated) first argument
        if first_param is None:
            return 'cout << "(void)" << endl;'
        t = first_param["type"].replace("&", "").strip()
        n = first_param["name"]
        if t == "vector<vector<int>>":
            return f"printVecVecInt({n});"
        if t == "vector<int>":
            return f"printVecInt({n});"
        if t == "vector<string>":
            return f"printVecStr({n});"
        return f'cout << {n} << endl;'

    if rt in ("int", "long long"):
        return "cout << result << endl;"
    if rt == "bool":
        return 'cout << (result ? "true" : "false") << endl;'
    if rt == "string":
        return "cout << result << endl;"
    if rt in ("vector<int>", "vector<long long>"):
        fn = "printVecInt" if rt == "vector<int>" else "printVecLL"
        return f"{fn}(result);"
    if rt == "vector<string>":
        return "printVecStr(result);"
    if rt == "vector<vector<int>>":
        return "printVecVecInt(result);"
    if rt == "vector<vector<string>>":
        return "printVecVecStr(result);"
    if rt == "double":
        return 'cout << fixed << setprecision(5) << result << endl;'
    return "cout << result << endl;"

def _cpp_wrapper(user_code: str, fn_name: str, ret_type: str,
                in_fmt: list, stdin: str) -> str:

    lines = stdin.split("\n")
    needs_tree = any(p["type"] == "TreeNode*" for p in in_fmt)

    # --- build input parsing block ---
    parse_lines = []
    for i, param in enumerate(in_fmt):
        raw_line = lines[i].strip() if i < len(lines) else ""
        var = _cpp_line_var(param["name"])
        parse_lines.append(f'string {var} = "{_escape_cpp(raw_line)}";')
        parse_lines.append("    " + _cpp_parse_line(param, raw_line))

    # --- build function call ---
    args = ", ".join(p["name"] for p in in_fmt)

    if ret_type == "void":
        call_line = f"Solution sol;\n    sol.{fn_name}({args});"
        print_line = _cpp_print_result(ret_type, in_fmt[0] if in_fmt else None)
    else:
        call_line = f"Solution sol;\n    auto result = sol.{fn_name}({args});"
        print_line = _cpp_print_result(ret_type, None)

    parse_block = "\n    ".join(parse_lines)
    tree_section = _CPP_TREE_HELPERS if needs_tree else ""

    code = f"""#include <bits/stdc++.h>
using namespace std;
{tree_section}
{_CPP_PARSE_HELPERS}

// ── User Code ────────────────────────────────────────────────────────────────
{user_code}
// ── End User Code ────────────────────────────────────────────────────────────

int main() {{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    {parse_block}
    {call_line}
    {print_line}

    return 0;
}}
"""
    return code


def _escape_cpp(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


# ─────────────────────────────────────────────────────────────────────────────
# PYTHON WRAPPER
# ─────────────────────────────────────────────────────────────────────────────

_PYTHON_TREE_HELPERS = '''
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def _build_tree(tokens):
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    q = deque([root])
    i = 1
    while q and i < len(tokens):
        node = q.popleft()
        if i < len(tokens) and tokens[i] != "null":
            node.left = TreeNode(int(tokens[i]))
            q.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            node.right = TreeNode(int(tokens[i]))
            q.append(node.right)
        i += 1
    return root

def _parse_tree(s):
    s = s.strip()
    if s.startswith("["):
        s = s[1:]
    if s.endswith("]"):
        s = s[:-1]
    tokens = [t.strip() for t in s.split(",")]
    return _build_tree(tokens)
'''

_PYTHON_PARSE_HELPERS = '''
import json, ast

def _parse_vec_int(s):
    return list(map(int, json.loads(s)))

def _parse_vec_str(s):
    return json.loads(s)

def _parse_vec_vec_int(s):
    return json.loads(s)

def _parse_vec_vec_str(s):
    return json.loads(s)

def _fmt(val):
    if isinstance(val, bool):
        return "true" if val else "false"
    if isinstance(val, list):
        inner = [_fmt(v) for v in val]
        return "[" + ",".join(inner) + "]"
    if isinstance(val, str):
        return val
    if isinstance(val, float):
        return f"{val:.5f}"
    return str(val)
'''


def _python_parse_line(param: dict, line_expr: str) -> str:
    t    = param["type"]
    name = param["name"]

    if t in ("int",):
        return f"{name} = int({line_expr})"
    if t in ("bool",):
        return f"{name} = {line_expr}.strip() == 'true'"
    if t in ("string", "str"):
        return f"{name} = {line_expr}.strip()"
    if t in ("vector<int>", "List[int]"):
        return f"{name} = _parse_vec_int({line_expr})"
    if t in ("vector<string>", "List[str]"):
        return f"{name} = _parse_vec_str({line_expr})"
    if t in ("vector<vector<int>>", "List[List[int]]"):
        return f"{name} = _parse_vec_vec_int({line_expr})"
    if t in ("vector<vector<string>>", "List[List[str]]"):
        return f"{name} = _parse_vec_vec_str({line_expr})"
    if t in ("TreeNode*", "Optional[TreeNode]"):
        return f"{name} = _parse_tree({line_expr})"
    raise ValueError(f"Unsupported Python type: {t}")


def _python_print_result(ret_type: str, first_param: dict | None) -> str:
    if ret_type in ("void", "None"):
        if first_param is None:
            return "print('(void)')"
        return f"print(_fmt({first_param['name']}))"
    if ret_type == "double":
        return "print(f'{result:.5f}')"
    return "print(_fmt(result))"


def _python_wrapper(user_code: str, fn_name: str, ret_type: str,
                     in_fmt: list, stdin: str) -> str:
    lines = stdin.split("\n")
    needs_tree = any(p["type"] == "TreeNode*" for p in in_fmt)

    parse_block = []
    for i, param in enumerate(in_fmt):
        raw = lines[i].strip() if i < len(lines) else ""
        line_expr = f'"{_escape_py(raw)}"'
        parse_block.append(_python_parse_line(param, line_expr))

    args = ", ".join(p["name"] for p in in_fmt)
    if ret_type in ("void", "None"):
        call = f"sol.{fn_name}({args})"
        print_stmt = _python_print_result(ret_type, in_fmt[0] if in_fmt else None)
    else:
        call = f"result = sol.{fn_name}({args})"
        print_stmt = _python_print_result(ret_type, None)

    tree_section = _PYTHON_TREE_HELPERS if needs_tree else ""
    parse_str = "\n".join(parse_block)

    code = f"""from typing import List, Optional
{tree_section}
{_PYTHON_PARSE_HELPERS}

# ── User Code ────────────────────────────────────────────────────────────────
{user_code}
# ── End User Code ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    sol = Solution()
    {parse_str.replace(chr(10), chr(10) + "    ")}
    {call}
    {print_stmt}
"""
    return code


def _escape_py(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


# ─────────────────────────────────────────────────────────────────────────────
# JAVA WRAPPER
# ─────────────────────────────────────────────────────────────────────────────

_JAVA_TREE_HELPERS = """
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    static TreeNode buildTree(String[] tokens) {
        if (tokens.length == 0 || tokens[0].equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));
        java.util.Queue<TreeNode> q = new java.util.LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < tokens.length) {
            TreeNode node = q.poll();
            if (i < tokens.length && !tokens[i].equals("null")) {
                node.left = new TreeNode(Integer.parseInt(tokens[i]));
                q.add(node.left);
            }
            i++;
            if (i < tokens.length && !tokens[i].equals("null")) {
                node.right = new TreeNode(Integer.parseInt(tokens[i]));
                q.add(node.right);
            }
            i++;
        }
        return root;
    }

    static TreeNode parseTree(String s) {
        s = s.trim();
        if (s.startsWith("[")) s = s.substring(1);
        if (s.endsWith("]"))   s = s.substring(0, s.length() - 1);
        if (s.isEmpty()) return null;
        String[] tokens = s.split(",");
        for (int i = 0; i < tokens.length; i++) tokens[i] = tokens[i].trim();
        return buildTree(tokens);
    }
"""

_JAVA_PARSE_HELPERS = """
    static int[] parseIntArr(String s) {
        s = s.trim();
        if (s.startsWith("[")) s = s.substring(1);
        if (s.endsWith("]"))   s = s.substring(0, s.length() - 1);
        if (s.isEmpty()) return new int[0];
        String[] parts = s.split(",");
        int[] arr = new int[parts.length];
        for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i].trim());
        return arr;
    }

    static int[][] parseIntArr2D(String s) {
        s = s.trim();
        java.util.List<int[]> rows = new java.util.ArrayList<>();
        int depth = 0;
        StringBuilder cur = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '[') { depth++; if (depth == 2) { cur.setLength(0); continue; } }
            else if (c == ']') { depth--; if (depth == 1) { rows.add(parseIntArr("[" + cur + "]")); continue; } }
            if (depth == 2) cur.append(c);
        }
        return rows.toArray(new int[0][]);
    }

    static String printIntArr(int[] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) { if (i > 0) sb.append(","); sb.append(arr[i]); }
        return sb.append("]").toString();
    }

    static String printIntArr2D(int[][] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(printIntArr(arr[i]));
        }
        return sb.append("]").toString();
    }

    static String[] parseStrArr(String s) {
        s = s.trim();
        if (s.startsWith("[")) s = s.substring(1);
        if (s.endsWith("]"))   s = s.substring(0, s.length() - 1);
        if (s.isEmpty()) return new String[0];
        java.util.List<String> list = new java.util.ArrayList<>();
        boolean inq = false;
        StringBuilder tok = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == '"') { inq = !inq; continue; }
            if (c == ',' && !inq) { list.add(tok.toString()); tok.setLength(0); continue; }
            tok.append(c);
        }
        if (tok.length() > 0) list.add(tok.toString());
        return list.toArray(new String[0]);
    }
"""


def _java_parse_line(param: dict, line_expr: str) -> str:
    t    = param["type"]
    name = param["name"]

    if t == "int":
        return f"int {name} = Integer.parseInt({line_expr}.trim());"
    if t == "long":
        return f"long {name} = Long.parseLong({line_expr}.trim());"
    if t == "boolean":
        return f"boolean {name} = {line_expr}.trim().equals(\"true\");"
    if t in ("String", "string"):
        return f"String {name} = {line_expr}.trim();"
    if t in ("int[]", "vector<int>"):
        return f"int[] {name} = parseIntArr({line_expr});"
    if t in ("int[][]", "vector<vector<int>>"):
        return f"int[][] {name} = parseIntArr2D({line_expr});"
    if t in ("String[]", "vector<string>"):
        return f"String[] {name} = parseStrArr({line_expr});"
    if t == "TreeNode":
        return f"TreeNode {name} = parseTree({line_expr});"
    raise ValueError(f"Unsupported Java type: {t}")


def _java_print_result(ret_type: str, first_param: dict | None) -> str:
    if ret_type in ("void",):
        if first_param is None:
            return 'System.out.println("(void)");'
        n = first_param["name"]
        t = first_param["type"]
        if t in ("int[][]",):
            return f"System.out.println(printIntArr2D({n}));"
        if t in ("int[]",):
            return f"System.out.println(printIntArr({n}));"
        return f"System.out.println({n});"
    if ret_type in ("int", "long", "String", "string"):
        return "System.out.println(result);"
    if ret_type == "boolean":
        return 'System.out.println(result ? "true" : "false");'
    if ret_type in ("int[]",):
        return "System.out.println(printIntArr(result));"
    if ret_type in ("int[][]",):
        return "System.out.println(printIntArr2D(result));"
    if ret_type == "double":
        return 'System.out.printf("%.5f%n", result);'
    return "System.out.println(result);"


def _java_wrapper(user_code: str, fn_name: str, ret_type: str,
                   in_fmt: list, stdin: str) -> str:
    lines = stdin.split("\n")
    needs_tree = any(p["type"] == "TreeNode" for p in in_fmt)

    parse_block = []
    for i, param in enumerate(in_fmt):
        raw = lines[i].strip() if i < len(lines) else ""
        parse_block.append("        " + _java_parse_line(param, f'"{_escape_java(raw)}"'))

    args = ", ".join(p["name"] for p in in_fmt)
    if ret_type == "void":
        call = f"        sol.{fn_name}({args});"
        print_stmt = "        " + _java_print_result(ret_type, in_fmt[0] if in_fmt else None)
    else:
        call = f"        {ret_type} result = sol.{fn_name}({args});"
        print_stmt = "        " + _java_print_result(ret_type, None)

    parse_str = "\n".join(parse_block)
    tree_section = _JAVA_TREE_HELPERS if needs_tree else ""

    code = f"""import java.util.*;

public class Main {{
{tree_section}
{_JAVA_PARSE_HELPERS}

    // ── User Code ─────────────────────────────────────────────────────────────
    static class Solution {{
        {user_code.strip().replace(chr(10), chr(10) + "        ")}
    }}
    // ── End User Code ─────────────────────────────────────────────────────────

    public static void main(String[] args) {{
        Solution sol = new Solution();
{parse_str}
{call}
{print_stmt}
    }}
}}
"""
    return code


def _escape_java(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')