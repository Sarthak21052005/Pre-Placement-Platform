from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from models.attempt import Attempt
from models.user import User
from bson import ObjectId
from database.mongDB import questions_collection

def get_leaderboard(db: Session):
    result = (
        db.query(
            User.id,
            User.name,
            func.count(distinct(Attempt.question_id)).label("solved"),
            func.count(Attempt.id).label("total_attempts")
        )
        .join(Attempt, Attempt.user_id == User.id)
        .group_by(User.id)
        .all()
    )

    leaderboard = []

    for r in result:
        solved = db.query(func.count(distinct(Attempt.question_id)))\
            .filter(
                Attempt.user_id == r[0],
                Attempt.verdict == "Accepted"
            ).scalar()

        accuracy = (solved / r[3] * 100) if r[3] else 0

        leaderboard.append({
            "name": r[1],
            "solved": solved,
            "attempts": r[3],
            "accuracy": round(accuracy, 2)
        })

    # 🔥 SORT BY:
    # 1. solved DESC
    # 2. accuracy DESC
    leaderboard.sort(key=lambda x: (-x["solved"], -x["accuracy"]))

    # 🔥 ADD RANK
    for i, u in enumerate(leaderboard):
        u["rank"] = i + 1

    return leaderboard[:50]

def get_company_leaderboard(db: Session, company_name: str):
    attempts = db.query(Attempt).filter(Attempt.verdict == "Accepted").all()

    user_map = {}

    for a in attempts:
        # fetch from mongo
        try:
            question = questions_collection.find_one(
                {"_id": ObjectId(a.question_id)},
                {"company": 1}
            )
        except:
            continue

        if not question:
            continue

        companies = question.get("company", [])

        if company_name not in companies:
            continue

        user_map.setdefault(a.user_id, set()).add(a.question_id)

    result = []

    for user_id, questions in user_map.items():
        user = db.query(User).filter(User.id == user_id).first()

        result.append({
            "name": user.name,
            "solved": len(questions)
        })

    return sorted(result, key=lambda x: -x["solved"])