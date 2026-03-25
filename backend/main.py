from fastapi import FastAPI
from database.database import Base, engine
from routes import auth_routes,questions_routes,attempt_routes
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(questions_routes.router)
app.include_router(attempt_routes.router)