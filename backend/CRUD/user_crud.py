from models.user import User
from sqlalchemy.orm import Session

def create_user(db: Session, user:User, hashed_password: str):
    db_user = User( name=user.name, email=user.email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_name(db: Session, name: str):
    return db.query(User).filter(User.name == name).first()
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

