from fastapi import FastAPI
from config.database import engine, Base
from routes import auth_routes
Base.metadata.create_all(bind=engine)
app = FastAPI()

app.include_router(auth_routes.router)
