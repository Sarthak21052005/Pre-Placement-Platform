from sqlalchemy.orm import Session
from models.attempt import Attempt

# CREATE
def create_attempt(db: Session, attempt_data):
    attempt = Attempt(**attempt_data.dict())
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt

def get_all_attempts(db:Session):
    return db.query(Attempt).all()

def get_user_attempts(db: Session, user_id: int):
    return db.query(Attempt).filter(Attempt.user_id == user_id).all()


def get_user_stats(db: Session, user_id: int):
    attempts = db.query(Attempt).filter(Attempt.user_id == user_id).all()

    total = len(attempts)

    # difficulty counts (we’ll fake for now or extend later)
    easy = 0
    medium = 0
    hard = 0

    topic_counts = {}
    company_counts = {}

    for a in attempts:
        if a.status == "solved":
            # 👉 later fetch difficulty/topic from MongoDB
            # for now mock values
            difficulty = "medium"

            if difficulty == "easy":
                easy += 1
            elif difficulty == "medium":
                medium += 1
            else:
                hard += 1

            # fake topic/company (replace later with real join)
            topic = "Arrays"
            company = "Amazon"

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