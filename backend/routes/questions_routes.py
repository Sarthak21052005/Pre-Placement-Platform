from fastapi import APIRouter
from CRUD import questions_crud

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

@router.get("/questions/{question_id}")
def read_question_by_id(question_id: str):
    question = questions_crud.get_questions_by_id(question_id)
    return question if question else {"message": "Question not found."}

@router.get("/questions/difficulty/{difficulty}")
def read_questions_by_difficulty(difficulty: str):
    questions = questions_crud.get_questions_by_difficulty(difficulty)
    return questions if questions else {"message": "No questions found for the specified difficulty."}