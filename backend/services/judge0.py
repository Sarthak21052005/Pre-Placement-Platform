"""
services/judge0.py

Thin wrapper around the Judge0 RapidAPI endpoint.
All business logic (wrapper generation, verdict calculation) lives elsewhere.
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

JUDGE0_URL = (
    "https://judge0-ce.p.rapidapi.com/submissions"
    "?base64_encoded=false&wait=true"
)

HEADERS = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": os.getenv("RAPIDAPI_KEY", ""),
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
}

# Judge0 language IDs
# https://ce.judge0.com/#statuses-and-languages-get-languages
LANGUAGE_MAP: dict[str, int] = {
    # C++
    "cpp":   54,   # C++ (GCC 9.2.0)
    "c++":   54,
    # Python
    "python":  71,  # Python 3.8.1
    "python3": 71,
    "py":      71,
    # Java
    "java":  62,   # Java (OpenJDK 13.0.1)
    # JavaScript
    "javascript": 63,  # Node.js 12.14.0
    "js":         63,
}


def run_code(source_code: str, language: str, stdin: str = "") -> dict:
    """
    Submit source_code to Judge0 and return the raw result dict.

    Returns a dict with keys (subset):
        stdout, stderr, compile_output,
        status: { id, description },
        time, memory, token
    On HTTP/network failure returns {"error": <message>}.
    """
    lang_key = language.lower().strip()
    if lang_key not in LANGUAGE_MAP:
        return {"error": f"Unsupported language: {language}"}

    payload = {
        "source_code":  source_code,
        "language_id":  LANGUAGE_MAP[lang_key],
        "stdin":        stdin,
    }

    try:
        resp = requests.post(JUDGE0_URL, json=payload, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.Timeout:
        return {"error": "Judge0 API timed out"}
    except requests.exceptions.HTTPError as e:
        return {"error": f"Judge0 HTTP error: {e.response.status_code}"}
    except Exception as e:
        return {"error": f"Judge0 request failed: {str(e)}"}


def extract_output(result: dict) -> str:
    """
    Return the best available output string from a Judge0 result dict.
    Priority: stdout → compile_output → stderr → ""
    """
    stdout         = (result.get("stdout")         or "").strip()
    compile_output = (result.get("compile_output") or "").strip()
    stderr         = (result.get("stderr")         or "").strip()

    if stdout:
        return result["stdout"]          # keep raw (normalize later)
    if compile_output:
        return compile_output
    if stderr:
        return stderr
    return ""


def get_status(result: dict) -> str:
    return result.get("status", {}).get("description", "Unknown")