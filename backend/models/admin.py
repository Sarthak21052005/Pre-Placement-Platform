from  sqlalchemy import Column, Integer, String  
from database.database import Base

class Admin(Base):
    __tablename__  = "Admin"

    id = Column(Integer , primary_key = True ,  index  = True)
    email =Column(String(255) , unique = True , nullable = False)
    name = Column(String(255) ,  nullable = False)
    password = Column(String(255) , nullable = False)
    
