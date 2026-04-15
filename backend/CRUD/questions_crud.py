from database.mongDB import questions_collection
from bson import ObjectId
#---------------------------------------


def serialize(question):
    question["_id"] = str(question["_id"])
    return question

def fetch(query={}):
    return [serialize(q) for q in questions_collection.find(query)]



def get_all_questions():
    return fetch()
def get_questions_by_topic(topic: str):
    return fetch({
        "topic": {"$regex": topic, "$options": "i"}
    })
def get_questions_by_company(company: str):
    return fetch({
        "company": {"$regex": f"^{company}$", "$options": "i"}
    })
def get_questions_by_difficulty(difficulty: str):
    return fetch({
        "difficulty": {"$regex": f"^{difficulty}$", "$options": "i"}
    })
def get_questions_by_id(question_id: str):
    try:
        q = questions_collection.find_one({"_id": ObjectId(question_id)})
        return serialize(q) if q else None
    except:
        return None