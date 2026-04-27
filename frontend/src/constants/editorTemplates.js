// constants/editorTemplates.js
//
// Users write ONLY the function body — the backend wraps it with main().
// Templates match the LeetCode / function-only style.

export const LANGUAGES = [
  { value: "cpp",    label: "C++ (GCC 9)" },
  { value: "python", label: "Python 3" },
  { value: "java",   label: "Java 13" },
];

// ── C++ ──────────────────────────────────────────────────────────────────────
const CPP_DEFAULT = `class Solution {
public:
    // Write your solution here.
    // Example: vector<int> twoSum(vector<int>& nums, int target) { ... }
};`;

// ── Python ───────────────────────────────────────────────────────────────────
const PYTHON_DEFAULT = `class Solution:
    # Write your solution here.
    # Example: def twoSum(self, nums: List[int], target: int) -> List[int]:
    pass`;

// ── Java ─────────────────────────────────────────────────────────────────────
const JAVA_DEFAULT = `// Write your solution inside this class.
// Example:
// public int[] twoSum(int[] nums, int target) {
//     ...
// }`;

export const TEMPLATES = {
  cpp:    CPP_DEFAULT,
  python: PYTHON_DEFAULT,
  java:   JAVA_DEFAULT,
};