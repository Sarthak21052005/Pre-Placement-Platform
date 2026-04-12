from CRUD.company_crud import get_all_companies
from fastapi import APIRouter
#** CRUD class sarthak sambhalega 


router = APIRouter()

@router.get("/companies")
def fetch_companies():
    return get_all_companies()