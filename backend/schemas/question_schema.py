from pydantic import BaseModel
from typing import List, Optional


class Example(BaseModel):
    input: str
    output: str
    explanation: Optional[str] = None


class TestCase(BaseModel):
    input: str
    expected_output: str


class Question(BaseModel):
    title: str
    company: List[str]
    topic: str
    difficulty: str
    description: str

    full_description: Optional[List[str]] = []
    examples: Optional[List[Example]] = []
    constraints: Optional[List[str]] = []
    testcases: Optional[List[TestCase]] = []

    tags: List[str]