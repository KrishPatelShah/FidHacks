from fastapi import APIRouter, HTTPException

from app.schemas.lesson import LearningModuleRead, LessonRead

router = APIRouter()

DEMO_MODULES = [
    LearningModuleRead(
        id="module_budgeting",
        category="budgeting",
        flower_name="Daisy",
        title="Budgeting Basics",
        lessons=[
            LessonRead(
                id="budgeting-expected-actual",
                category="budgeting",
                title="Expected vs. Actual Spending",
                difficulty="beginner",
                content_type="reading",
                summary="Learn why comparing planned spending with real spending is the main budgeting feedback loop.",
                reward={"sunlight": 1, "water": 1},
            )
        ],
    )
]


@router.get("", response_model=list[LearningModuleRead])
def list_learning_modules() -> list[LearningModuleRead]:
    return DEMO_MODULES


@router.get("/{lesson_id}", response_model=LessonRead)
def get_lesson(lesson_id: str) -> LessonRead:
    for module in DEMO_MODULES:
        for lesson in module.lessons:
            if lesson.id == lesson_id:
                return lesson
    raise HTTPException(status_code=404, detail="Lesson not found")
