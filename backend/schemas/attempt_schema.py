from pydantic import BaseModel
from datetime import datetime
from typing import List

class AttemptCreate(BaseModel):
    user_id: int
    question_id: str
    question_name: str
    company_names : List[str]
    status: str = "attempted"
    difficulty: str

class AttemptResponse(BaseModel):
    id: int
    user_id: int
    question_id: str
    status: str
    question_name:str
    company_names:list[str]
    difficulty: str
    created_at: datetime
    class Config:
        from_attributes = True