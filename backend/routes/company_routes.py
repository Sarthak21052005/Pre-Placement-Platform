from fastapi import APIRouter
from CRUD.company_crud import get_all_companies

router = APIRouter()

@router.get("/companies")
def fetch_companies():
    return get_all_companies()