from fastapi import FastAPI
from database.database import Base, engine
from routes import auth_routes,questions_routes
Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(auth_routes.router)
app.include_router(questions_routes.router)