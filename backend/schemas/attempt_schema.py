from pydantic import BaseModel
from datetime import datetime

class AttemptCreate(BaseModel):
    user_id: int
    question_id: str
    status: str = "attempted"
    difficulty: str

class AttemptResponse(BaseModel):
    id: int
    user_id: int
    question_id: str
    status: str
    difficulty: str
    created_at: datetime

    class Config:
        from_attributes = True