from fastapi import APIRouter
from CRUD.topic_crud import get_all_topics

router = APIRouter()

@router.get("/topics")
def fetch_topics():
    return get_all_topics()