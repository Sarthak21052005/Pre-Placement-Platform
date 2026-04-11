from sqlalchemy.orm import Session
from models.admin import Admin 

def create_admin(db : Session , user : Admin , hashedpassword : str):
    db_user = Admin(name = user.name , email = user.email , password = hashedpassword)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


