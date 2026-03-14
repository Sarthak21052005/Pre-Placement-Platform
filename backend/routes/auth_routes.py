from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
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

@router.get("/check-email/{email}")
def check_email(email: str, db: Session = Depends(get_db)):
    user = user_crud.get_user_by_email(db,email=email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return {email:"is not registered"}

@router.get("/users/name/{name}")
def get_user_by_name(name: str, db: Session = Depends(get_db)):
    user = user_crud.get_user_by_name(db, name=name)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user