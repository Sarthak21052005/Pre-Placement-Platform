"""
tests/test_wrapper_engine.py

Offline tests for the wrapper generator — no Judge0 calls needed.
Run with:  python -m pytest tests/ -v
"""

import sys
sys.path.insert(0, "..")

from services.wrapper_engine import generate_wrapper


# ── helpers ──────────────────────────────────────────────────────────────────

def make_q(fn, ret, params):
    return {
        "function_name": fn,
        "return_type":   ret,
        "input_format":  params,
    }


# ── Two Sum (vector<int>, int) → vector<int> ──────────────────────────────────

def test_cpp_two_sum():
    q = make_q("twoSum", "vector<int>", [
        {"name": "nums",   "type": "vector<int>"},
        {"name": "target", "type": "int"},
    ])
    code = generate_wrapper("", q, "[2,7,11,15]\n9", "cpp")
    assert "twoSum(nums, target)" in code
    assert "parseVecInt" in code
    assert 'stoi(_line_target)' in code
    assert "printVecInt(result)" in code
    print("✅ test_cpp_two_sum")


def test_python_two_sum():
    q = make_q("twoSum", "vector<int>", [
        {"name": "nums",   "type": "vector<int>"},
        {"name": "target", "type": "int"},
    ])
    code = generate_wrapper("", q, "[2,7,11,15]\n9", "python")
    assert "_parse_vec_int" in code
    assert "int(" in code
    assert "sol.twoSum(nums, target)" in code
    assert "_fmt(result)" in code
    print("✅ test_python_two_sum")


def test_java_two_sum():
    q = make_q("twoSum", "int[]", [
        {"name": "nums",   "type": "int[]"},
        {"name": "target", "type": "int"},
    ])
    code = generate_wrapper("", q, "[2,7,11,15]\n9", "java")
    assert "parseIntArr" in code
    assert "sol.twoSum(nums, target)" in code
    assert "printIntArr(result)" in code
    print("✅ test_java_two_sum")


# ── Valid Parentheses (string) → bool ────────────────────────────────────────

def test_cpp_valid_parens():
    q = make_q("isValid", "bool", [
        {"name": "s", "type": "string"},
    ])
    code = generate_wrapper("", q, "()[]{}", "cpp")
    assert 'string _line_s = "()[]{}"' in code
    assert "isValid(s)" in code
    assert '"true"' in code
    print("✅ test_cpp_valid_parens")


# ── Course Schedule (int, vector<vector<int>>) → bool ─────────────────────────

def test_cpp_course_schedule():
    q = make_q("canFinish", "bool", [
        {"name": "numCourses",    "type": "int"},
        {"name": "prerequisites", "type": "vector<vector<int>>"},
    ])
    code = generate_wrapper("", q, "2\n[[1,0]]", "cpp")
    assert "parseVecVecInt" in code
    assert "canFinish(numCourses, prerequisites)" in code
    print("✅ test_cpp_course_schedule")


# ── Binary Tree Level Order (TreeNode*) → vector<vector<int>> ─────────────────

def test_cpp_tree():
    q = make_q("levelOrder", "vector<vector<int>>", [
        {"name": "root", "type": "TreeNode*"},
    ])
    code = generate_wrapper("", q, "[3,9,20,null,null,15,7]", "cpp")
    assert "buildTree" in code
    assert "parseTreeTokens" in code
    assert "printVecVecInt(result)" in code
    print("✅ test_cpp_tree")


# ── Rotate Image (vector<vector<int>>&) → void ────────────────────────────────

def test_cpp_void_return():
    q = make_q("rotate", "void", [
        {"name": "matrix", "type": "vector<vector<int>>"},
    ])
    code = generate_wrapper("", q, "[[1,2,3],[4,5,6],[7,8,9]]", "cpp")
    assert "rotate(matrix)" in code
    assert "printVecVecInt(matrix)" in code
    print("✅ test_cpp_void_return")


# ── Word Break (string, vector<string>) → bool ───────────────────────────────

def test_cpp_word_break():
    q = make_q("wordBreak", "bool", [
        {"name": "s",        "type": "string"},
        {"name": "wordDict", "type": "vector<string>"},
    ])
    code = generate_wrapper("", q, 'leetcode\n["leet","code"]', "cpp")
    assert "parseVecStr" in code
    assert "wordBreak(s, wordDict)" in code
    print("✅ test_cpp_word_break")


# ── N-Queens (int) → vector<vector<string>> ──────────────────────────────────

def test_cpp_n_queens():
    q = make_q("solveNQueens", "vector<vector<string>>", [
        {"name": "n", "type": "int"},
    ])
    code = generate_wrapper("", q, "4", "cpp")
    assert "stoi(_line_n)" in code
    assert "printVecVecStr(result)" in code
    print("✅ test_cpp_n_queens")


# ── Alien Dictionary (vector<string>) → string ───────────────────────────────

def test_cpp_alien_dict():
    q = make_q("alienOrder", "string", [
        {"name": "words", "type": "vector<string>"},
    ])
    code = generate_wrapper("", q, '["wrt","wrf","er","ett","rftt"]', "cpp")
    assert "parseVecStr" in code
    assert "cout << result << endl" in code
    print("✅ test_cpp_alien_dict")


# ── Python tree ───────────────────────────────────────────────────────────────

def test_python_tree():
    q = make_q("diameterOfBinaryTree", "int", [
        {"name": "root", "type": "TreeNode*"},
    ])
    code = generate_wrapper("", q, "[1,2,3,4,5]", "python")
    assert "_parse_tree" in code
    assert "_PYTHON_TREE" not in code   # helper is inlined
    assert "sol.diameterOfBinaryTree(root)" in code
    print("✅ test_python_tree")


# ── Unsupported language ──────────────────────────────────────────────────────

def test_unsupported_language():
    q = make_q("foo", "int", [{"name": "x", "type": "int"}])
    try:
        generate_wrapper("", q, "1", "ruby")
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "Unsupported language" in str(e)
    print("✅ test_unsupported_language")


# ── Design question blocked ───────────────────────────────────────────────────

def test_design_question_blocked():
    q = {"function_name": "__DESIGN__", "return_type": "__DESIGN__", "input_format": []}
    try:
        generate_wrapper("", q, "", "cpp")
        assert False, "Should have raised ValueError"
    except ValueError as e:
        assert "Design" in str(e)
    print("✅ test_design_question_blocked")


# ── run all ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    tests = [
        test_cpp_two_sum,
        test_python_two_sum,
        test_java_two_sum,
        test_cpp_valid_parens,
        test_cpp_course_schedule,
        test_cpp_tree,
        test_cpp_void_return,
        test_cpp_word_break,
        test_cpp_n_queens,
        test_cpp_alien_dict,
        test_python_tree,
        test_unsupported_language,
        test_design_question_blocked,
    ]
    passed = 0
    for t in tests:
        try:
            t()
            passed += 1
        except Exception as e:
            print(f"❌ {t.__name__}: {e}")

    print(f"\n{'='*50}")
    print(f"Results: {passed}/{len(tests)} passed")