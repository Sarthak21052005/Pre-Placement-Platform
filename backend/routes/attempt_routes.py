from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.attempt_schema import AttemptCreate
from CRUD.attempts_crud import create_attempt, get_user_attempts, get_user_stats, get_all_attempts

router = APIRouter()

# CREATE ATTEMPT
@router.post("/attempts")
def add_attempt(attempt: AttemptCreate, db: Session = Depends(get_db)):
    return create_attempt(db, attempt)

@router.get("/attempts")
def get_all_attempts_route(db: Session = Depends(get_db)):
    return get_all_attempts(db)

# GET USER ATTEMPTS
@router.get("/attempts/user/{user_id}")
def get_user_attempts_route(user_id: int, db: Session = Depends(get_db)):
    attempts = get_user_attempts(db, user_id)

    result = []

    for a in attempts:
        companies = a.company_names if a.company_names else ["Unknown"]

        result.append({
            "id": str(a.id),
            "question_id": a.question_id,
            "title": a.question_name,
            "companies": companies,
            "difficulty": a.difficulty,
            "date": a.created_at
        })

    return result

# STATS
@router.get("/attempts/stats/{user_id}")
def get_stats(user_id: int, db: Session = Depends(get_db)):
    return get_user_stats(db, user_id)

# HEATMAP
@router.get("/attempts/heatmap/{user_id}")
def get_heatmap_data(user_id: int, db: Session = Depends(get_db)):
    attempts = get_user_attempts(db, user_id)
    heatmap_data = {}

    for a in attempts:
        date_str = a.created_at.date().isoformat()
        heatmap_data[date_str] = heatmap_data.get(date_str, 0) + 1

    return heatmap_data