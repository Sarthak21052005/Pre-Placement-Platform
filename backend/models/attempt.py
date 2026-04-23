from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from database.database import Base
import json

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    question_id = Column(String, nullable=False) 
    question_name = Column(String , nullable = False)
    company_names = Column(String , nullable = False)
    status = Column(String, default="attempted")
    difficulty = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def get_companies(self):
        return json.loads(self.company_names)

    def set_companies(self, companies_list):
        self.company_names = json.dumps(companies_list)