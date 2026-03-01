from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from CRUD import user_crud
from schemas.user_schema import UserBase , UserResponse

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register_user(user: UserBase, db: Session = Depends(get_db)):
    existing_user = user_crud.get_user_by_email(db, email=user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = user_crud.create_user(db, user=user)
    return new_user