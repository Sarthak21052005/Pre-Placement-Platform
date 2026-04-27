"""
services/normalizer.py

Robust output normalization so minor formatting differences (trailing
newlines, spaces around commas, Windows line-endings) don't cause
false failures.
"""

import re


def normalize(output: str | None) -> str:
    """
    Normalize a raw output string for comparison.

    Transformations applied (order matters):
      1. None → ""
      2. Strip leading/trailing whitespace and newlines
      3. Normalize Windows line endings  (\\r\\n → \\n)
      4. Collapse spaces after commas inside brackets: [0, 1] → [0,1]
      5. Collapse multiple consecutive spaces to one
      6. Remove whitespace around square brackets at start/end
    """
    if output is None:
        return ""

    text = output.strip()
    text = text.replace("\r\n", "\n").replace("\r", "")

    # [0, 1, 2] → [0,1,2]
    text = re.sub(r",\s+", ",", text)

    # "[ 1, 2 ]" → "[1,2]"   (spaces immediately inside brackets)
    text = re.sub(r"\[\s+", "[", text)
    text = re.sub(r"\s+\]", "]", text)

    # collapse multiple spaces
    text = re.sub(r"  +", " ", text)

    return text