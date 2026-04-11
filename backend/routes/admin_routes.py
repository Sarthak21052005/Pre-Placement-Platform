from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.database import get_db

from models.user import User
from models.admin import Admin

from schemas.admin_schema import AdminLogin, AdminBase, AdminResponse
from CRUD.admin_crud import create_admin

from core.security import get_password_hash, verify_password
from core.jwt_handler import create_access_token

from database.mongDB import questions_collection
from bson import ObjectId

from jose import jwt, JWTError
import os

router = APIRouter(prefix="/admin", tags=["Admin"])

security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")

        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/register", response_model=AdminResponse)
def register(admin: AdminBase, db: Session = Depends(get_db)):
    db_admin = db.query(Admin).filter(Admin.email == admin.email).first()

    if db_admin:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(admin.password)

    return create_admin(db, user=admin, hashedpassword=hashed_password)


@router.post("/login")
def login(admin: AdminLogin, db: Session = Depends(get_db)):
    db_admin = db.query(Admin).filter(Admin.email == admin.email).first()

    if not db_admin or not verify_password(admin.password, db_admin.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = create_access_token(
        data={"sub": db_admin.email, "role": "admin"}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": {
            "id": db_admin.id,
            "name": db_admin.name,
            "email": db_admin.email
        }
    }


@router.get("/questions/all")
def get_all_questions(admin=Depends(get_current_admin)):
    questions = list(questions_collection.find())

    return [
        {
            "id": str(q["_id"]),
            "title": q.get("title"),
            "company": q.get("company"),
            "topic": q.get("topic"),
            "difficulty": q.get("difficulty"),
            "description": q.get("description"),
            "tags": q.get("tags")
        }
        for q in questions
    ]


@router.post("/questions/add")
def add_question(question: dict, admin=Depends(get_current_admin)):
    result = questions_collection.insert_one(question)

    return {
        "message": "Question added",
        "id": str(result.inserted_id)
    }


@router.delete("/questions/{question_id}")
def delete_question(question_id: str, admin=Depends(get_current_admin)):
    try:
        obj_id = ObjectId(question_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid question id")

    result = questions_collection.delete_one({"_id": obj_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")

    return {"message": "Question deleted"}


@router.get("/users/all")
def get_all_users(admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()

    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email
        }
        for u in users
    ]


@router.delete("/users/{user_id}")
def delete_user(user_id: int, admin=Depends(get_current_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}