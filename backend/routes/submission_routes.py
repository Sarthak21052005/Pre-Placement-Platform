"""
routes/submission_routes.py

/run   → runs visible testcases, returns per-case results
/submit → runs ALL testcases (including hidden), returns only verdict
          and redacted results (hidden testcase I/O is never exposed)
"""

from fastapi import APIRouter
from pydantic import BaseModel
from bson import ObjectId

from database.mongDB import db
from services.judge0 import run_code, extract_output, get_status
from services.wrapper_engine import generate_wrapper
from services.normalizer import normalize

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# Request schema
# ─────────────────────────────────────────────────────────────────────────────

class SubmissionRequest(BaseModel):
    question_id: str
    code: str          # user's function body (no main)
    language: str      # "cpp" | "python" | "java"


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _run_single(user_code: str, question: dict, tc: dict, language: str) -> dict:
    """
    Generate wrapper code for one testcase and execute it via Judge0.
    Returns a dict with output, expected, passed, and error details.
    """
    # Build wrapper
    try:
        full_code = generate_wrapper(user_code, question, tc["input"], language)
    except ValueError as e:
        return {
            "input":          tc["input"],
            "expected":       normalize(tc["expected_output"]),
            "output":         "",
            "passed":         False,
            "stderr":         str(e),
            "compile_output": "",
            "status":         "Wrapper Error",
            "hidden":         tc.get("hidden", False),
        }

    # Execute via Judge0
    result = run_code(full_code, language, stdin="")   # stdin is baked into wrapper

    raw_output = extract_output(result)
    user_output  = normalize(raw_output)
    expected_out = normalize(tc["expected_output"])
    passed       = user_output == expected_out

    return {
        "input":          tc["input"],
        "expected":       expected_out,
        "output":         user_output,
        "passed":         passed,
        "stderr":         normalize(result.get("stderr") or ""),
        "compile_output": normalize(result.get("compile_output") or ""),
        "status":         get_status(result),
        "hidden":         tc.get("hidden", False),
    }


def _fetch_question(question_id: str) -> dict | None:
    try:
        return db.questions.find_one({"_id": ObjectId(question_id)})
    except Exception:
        return None


# ─────────────────────────────────────────────────────────────────────────────
# /run — visible testcases only
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/run")
def run_code_route(req: SubmissionRequest):
    """
    Execute the user's code against visible (non-hidden) testcases only.
    Returns per-case result including I/O diffs and error output.
    """
    question = _fetch_question(req.question_id)
    if not question:
        return {"error": "Question not found"}

    if question.get("function_name") == "__DESIGN__":
        return {"error": "Design questions are not supported in run mode yet."}

    testcases = question.get("testcases", [])
    results   = []

    for tc in testcases:
        if tc.get("hidden", False):
            continue   # skip hidden during Run

        result = _run_single(req.code, question, tc, req.language)
        # Don't expose the hidden flag in run results (all are visible here)
        result.pop("hidden", None)
        results.append(result)

    return {"results": results}


# ─────────────────────────────────────────────────────────────────────────────
# /submit — all testcases
# ─────────────────────────────────────────────────────────────────────────────

@router.post("/submit")
def submit_code(req: SubmissionRequest):
    """
    Execute the user's code against ALL testcases (visible + hidden).

    Rules:
      - Hidden testcase inputs/outputs are NEVER exposed.
      - Returns verdict + per-case passed/failed flags.
      - For hidden cases: only {hidden: true, passed: <bool>} is returned.
    """
    question = _fetch_question(req.question_id)
    if not question:
        return {"error": "Question not found"}

    if question.get("function_name") == "__DESIGN__":
        return {"error": "Design questions are not supported in submit mode yet."}

    testcases = question.get("testcases", [])
    all_passed = True
    results    = []

    for tc in testcases:
        result = _run_single(req.code, question, tc, req.language)
        is_hidden = tc.get("hidden", False)

        if not result["passed"]:
            all_passed = False

        if is_hidden:
            # Redact everything except pass/fail
            results.append({
                "hidden": True,
                "passed": result["passed"],
            })
        else:
            result.pop("hidden", None)
            results.append(result)

    verdict = "Accepted" if all_passed else "Wrong Answer"

    return {
        "verdict": verdict,
        "results": results,
    }