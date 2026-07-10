from fastapi import APIRouter

from app.api.routes import auth, budget, community, health, lessons, plants, questionnaire, quizzes, sunflower

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(questionnaire.router, prefix="/questionnaire", tags=["questionnaire"])
api_router.include_router(plants.router, prefix="/plants", tags=["plants"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["lessons"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
api_router.include_router(budget.router, prefix="/budget", tags=["budget"])
api_router.include_router(community.router, prefix="/community", tags=["community"])
api_router.include_router(sunflower.router, prefix="/sunflower", tags=["sunflower"])
