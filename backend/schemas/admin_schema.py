from pydantic import EmailStr  , BaseModel , Field

# Given to me by Sarthak :- 
#** PYdantic : verification ke liye 

class AdminBase(BaseModel):
    email : EmailStr
    name : str = Field( min_length=3 , max_length=14)
    password : str = Field(min_length=6 , max_length=10)

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id : int = Field(gt=0)
    email : EmailStr
    name : str = Field(min_length=3)