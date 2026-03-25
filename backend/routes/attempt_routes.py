from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.attempt_schema import AttemptCreate
from CRUD.attempts_crud import create_attempt, get_user_attempts, get_user_stats,get_all_attempts

router = APIRouter()

# CREATE ATTEMPT
@router.post("/attempts")
def add_attempt(attempt: AttemptCreate, db: Session = Depends(get_db)):
    return create_attempt(db, attempt)

@router.get("/attempts")
def get_all_attempts_route(db : Session = Depends(get_db)):
    return get_all_attempts(db)
# GET USER ATTEMPTS
@router.get("/attempts/{user_id}")
def get_attempts(user_id: int, db: Session = Depends(get_db)):
    return get_user_attempts(db, user_id)


# GET USER STATS 🔥
@router.get("/attempts/stats/{user_id}")
def get_stats(user_id: int, db: Session = Depends(get_db)):
    return get_user_stats(db, user_id)