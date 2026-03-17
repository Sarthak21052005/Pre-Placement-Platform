from pydantic import BaseModel , EmailStr ,Field

class UserBase(BaseModel):
    email : EmailStr
    name : str = Field( min_length=3)
    password : str = Field(min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id : int = Field(gt=0)
    email : EmailStr
    name : str = Field(min_length=3)      