from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from database.database import Base

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    question_id = Column(String, nullable=False) 
    status = Column(String, default="attempted")
    created_at = Column(DateTime, default=datetime.utcnow)