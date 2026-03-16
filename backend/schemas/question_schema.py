from pydantic import BaseModel 
from typing import List

class Questions(BaseModel):
    title : str
    company : str
    topic : str
    difficulty : str
    description : str
    tags : List[str]