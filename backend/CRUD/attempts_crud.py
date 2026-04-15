from sqlalchemy.orm import Session
from models.attempt import Attempt
from database.mongDB import questions_collection
from bson import ObjectId
import json

def create_attempt(db: Session, attempt_data):
    data = attempt_data.dict()

    # Ensure company_names is always list
    if isinstance(data.get("company_names"), str):
        try:
            data["company_names"] = json.loads(data["company_names"])
        except:
            data["company_names"] = [data["company_names"]]

    attempt = Attempt(**data)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt


def get_all_attempts(db: Session):
    return db.query(Attempt).all()



def get_user_attempts(db: Session, user_id: int):
    return db.query(Attempt).filter(Attempt.user_id == user_id).all()


def get_user_stats(db: Session, user_id: int):
    attempts = db.query(Attempt).filter(Attempt.user_id == user_id).all()

    question_map = {}

    for a in attempts:
        qid = a.question_id

        if qid not in question_map:
            question_map[qid] = a
        else:
            existing = question_map[qid]

            
            if existing.verdict != "Accepted" and a.verdict == "Accepted":
                question_map[qid] = a

    solved_attempts = [
        a for a in question_map.values() if a.verdict == "Accepted"
    ]
    total = len(solved_attempts)

    easy = medium = hard = 0
    topic_counts = {}
    company_counts = {}

    for a in solved_attempts:

        difficulty = (a.difficulty or "").lower()

        if difficulty == "easy":
            easy += 1
        elif difficulty == "medium":
            medium += 1
        elif difficulty == "hard":
            hard += 1
        try:
            question = questions_collection.find_one(
                {"_id": ObjectId(a.question_id)},
                {"_id": 0, "topic": 1, "company": 1}
            )
        except:
            question = None

        if question:
            topic = question.get("topic", "Unknown")
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