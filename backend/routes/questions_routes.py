from fastapi import APIRouter
from CRUD import questions_crud
from bson import ObjectId
from database.mongDB import questions_collection
router = APIRouter()

@router.get("/questions")
def read_all_questions():
    questions = questions_crud.get_all_questions()
    return questions if questions else {"message": "No questions found."}

@router.get("/questions/topic/{topic}")
def read_questions_by_topic(topic: str):
    questions = questions_crud.get_questions_by_topic(topic)
    return questions if questions else {"message": "No questions found for the specified topic."} 

@router.get("/questions/company/{company}")
def read_questions_by_company(company: str):
    questions = questions_crud.get_questions_by_company(company)
    return questions if questions else {"message": "No questions found for the specified company."}

@router.get("/questions/{id}")
def get_question(id: str):
    try:
        question = questions_collection.find_one({"_id": ObjectId(id)})

        if not question:
            return {"error": "Question not found"}

        # convert ObjectId → string
        question["_id"] = str(question["_id"])

        # 🔥 FILTER ONLY VISIBLE TESTCASES
        question["testcases"] = [
            tc for tc in question.get("testcases", [])
            if not tc.get("hidden", False)
        ]

        return question

    except Exception as e:
        print("ERROR:", e)
        return {"error": "Server error", "details": str(e)}

@router.get("/questions/difficulty/{difficulty}")
def read_questions_by_difficulty(difficulty: str):
    questions = questions_crud.get_questions_by_difficulty(difficulty)
    return questions if questions else {"message": "No questions found for the specified difficulty."}

@router.get("/questions/filter")
def filter_questions(company: str = None, topic: str = None, difficulty: str = None):
    return questions_crud.get_filtered_questions(company, topic, difficulty)