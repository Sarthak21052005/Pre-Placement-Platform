from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database.database import Base
import json

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    question_id = Column(String, nullable=False)
    question_name = Column(String, nullable=False)

    # 🔥 Store as JSON string (safe for now)
    company_names = Column(String, nullable=False)

    # 🔥 NEW FIELD (IMPORTANT)
    verdict = Column(String, nullable=False)  # Accepted / Wrong Answer

    difficulty = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # ✅ Helpers (still useful)
    def get_companies(self):
        try:
            return json.loads(self.company_names)
        except:
            return [self.company_names]

    def set_companies(self, companies_list):
        self.company_names = json.dumps(companies_list)