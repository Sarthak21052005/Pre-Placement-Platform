from fastapi import FastAPI
from database.database import Base, engine
from routes import auth_routes,questions_routes
from routes import user_routes,admin_routes,company_routes,execution_routes
from routes import topic_routes,attempt_routes
from routes import leaderboard_route
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
app.include_router(user_routes.router)
app.include_router(admin_routes.router)
app.include_router(company_routes.router)
app.include_router(topic_routes.router)
app.include_router(leaderboard_route.router)
app.include_router(execution_routes.router)
