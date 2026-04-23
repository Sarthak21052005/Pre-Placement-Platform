from sqlalchemy.orm import Session
from models.attempt import Attempt
from database.mongDB import questions_collection
from bson import ObjectId
import json

# ✅ CREATE
def create_attempt(db: Session, attempt_data):
    data = attempt_data.dict()
    data["company_names"] = json.dumps(data["company_names"])
    attempt = Attempt(**data)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt


# ✅ GET ALL
def get_all_attempts(db: Session):
    return db.query(Attempt).all()


# ✅ GET USER ATTEMPTS
def get_user_attempts(db: Session, user_id: int):
    return db.query(Attempt).filter(Attempt.user_id == user_id).all()


# ✅ GET USER STATS (FIXED)
def get_user_stats(db: Session, user_id: int):
    attempts = db.query(Attempt).filter(Attempt.user_id == user_id, Attempt.status == "solved").all()
    unique_attempts = {}
    for a in attempts:
        unique_attempts[a.question_id] = a
    solved_attempts = list(unique_attempts.values())
    total = len(solved_attempts)    

    easy = 0
    medium = 0
    hard = 0

    topic_counts = {}
    company_counts = {}

    for a in solved_attempts:

        # ✅ SAFE difficulty handling
        difficulty = (a.difficulty or "").lower()

        if difficulty == "easy":
            easy += 1
        elif difficulty == "medium":
            medium += 1
        elif difficulty == "hard":
            hard += 1

        # ✅ FETCH FROM MONGODB
        question = None
        try:
            question = questions_collection.find_one(
                {"_id": ObjectId(a.question_id)},
                {"_id": 0, "topic": 1, "company": 1}
            )
        except Exception as e:
            print("Mongo Error:", e)
            print("Invalid question_id:", a.question_id)

        # ✅ HANDLE RESULT
        if question:
            topic = question.get("topic", "Unknown")

            # company is array
            company_list = question.get("company", [])
            company = company_list[0] if company_list else "Unknown"
        else:
            topic = "Unknown"
            company = "Unknown"

        topic_counts[topic] = topic_counts.get(topic, 0) + 1
        company_counts[company] = company_counts.get(company, 0) + 1

    return {
        "total": total,
        "easy": easy,
        "medium": medium,
        "hard": hard,
        "topics": topic_counts,
        "companies": company_counts
    }