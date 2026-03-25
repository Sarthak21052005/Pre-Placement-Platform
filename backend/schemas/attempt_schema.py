from pydantic import BaseModel
from datetime import datetime

class AttemptCreate(BaseModel):
    user_id: int
    question_id: str
    status: str = "attempted"

class AttemptResponse(BaseModel):
    id: int
    user_id: int
    question_id: str
    status: str
    created_at: datetime

    class Config:
        orm_mode = True