from uuid import UUID

from sqlalchemy.orm import Session

from app.api.deps import DEMO_USER_ID
from app.db.session import SessionLocal
from app.models.community import CommunityPost
from app.models.lesson import LearningModule, Lesson
from app.models.plant import Plant
from app.models.quiz import QuizQuestion
from app.models.user import Profile


MODULES = [
    {
        "id": UUID("20000000-0000-0000-0000-000000000001"),
        "slug": "module_budgeting",
        "category": "budgeting",
        "flower_name": "Daisy",
        "title": "Budgeting Basics",
        "sort_order": 1,
        "lessons": [
            {
                "id": UUID("30000000-0000-0000-0000-000000000001"),
                "slug": "budgeting-expected-actual",
                "category": "budgeting",
                "title": "Expected vs. Actual Spending",
                "sort_order": 1,
                "difficulty": "beginner",
                "content_type": "reading",
                "source_url": None,
                "summary": "Learn why comparing planned spending with real spending is the main budgeting feedback loop.",
                "reward": {"sunlight": 1, "water": 1},
                "questions": [
                    {
                        "id": UUID("40000000-0000-0000-0000-000000000001"),
                        "slug": "budgeting-expected-actual-q1",
                        "prompt": "Why compare expected spending with actual spending?",
                        "options": ["To shame yourself for mistakes", "To find useful habit patterns", "To calculate a credit score"],
                        "correct_index": 1,
                        "explanation": "The gap is a learning signal. It helps explain what changed.",
                    },
                    {
                        "id": UUID("40000000-0000-0000-0000-000000000002"),
                        "slug": "budgeting-expected-actual-q2",
                        "prompt": "Which action should earn fertilizer in this app?",
                        "options": ["Logging a budget", "Buying a stock", "Skipping a lesson"],
                        "correct_index": 0,
                        "explanation": "Budget logging is a practice habit, so it earns fertilizer.",
                    },
                ],
            },
            {
                "id": UUID("30000000-0000-0000-0000-000000000002"),
                "slug": "budgeting-categories",
                "category": "budgeting",
                "title": "Common Spending Categories",
                "sort_order": 2,
                "difficulty": "beginner",
                "content_type": "reading",
                "source_url": None,
                "summary": "Group spending into savings, living expenses, education, lifestyle, debt, and taxes.",
                "reward": {"sunlight": 1},
                "questions": [],
            },
        ],
    },
    {
        "id": UUID("20000000-0000-0000-0000-000000000002"),
        "slug": "module_savings",
        "category": "savings",
        "flower_name": "Marigold",
        "title": "Savings + Emergency Fund",
        "sort_order": 2,
        "lessons": [
            {
                "id": UUID("30000000-0000-0000-0000-000000000003"),
                "slug": "savings-emergency-fund",
                "category": "savings",
                "title": "Why Emergency Funds Matter",
                "sort_order": 1,
                "difficulty": "beginner",
                "content_type": "reading",
                "source_url": None,
                "summary": "Understand how emergency savings can reduce stress when unexpected expenses happen.",
                "reward": {"sunlight": 1, "water": 1},
                "questions": [
                    {
                        "id": UUID("40000000-0000-0000-0000-000000000003"),
                        "slug": "savings-emergency-fund-q1",
                        "prompt": "What is an emergency fund for?",
                        "options": ["Expected and unexpected essential expenses", "Only investing", "Increasing credit limits"],
                        "correct_index": 0,
                        "explanation": "Emergency savings help absorb essential expenses without relying on debt.",
                    }
                ],
            }
        ],
    },
    {
        "id": UUID("20000000-0000-0000-0000-000000000003"),
        "slug": "module_credit",
        "category": "credit_debt",
        "flower_name": "Rose",
        "title": "Credit + Debt",
        "sort_order": 3,
        "lessons": [
            {
                "id": UUID("30000000-0000-0000-0000-000000000004"),
                "slug": "credit-apr",
                "category": "credit_debt",
                "title": "What Is APR?",
                "sort_order": 1,
                "difficulty": "beginner",
                "content_type": "reading",
                "source_url": None,
                "summary": "APR is the yearly cost of borrowing money. Learn how it affects credit card balances.",
                "reward": {"sunlight": 1, "water": 1},
                "questions": [
                    {
                        "id": UUID("40000000-0000-0000-0000-000000000004"),
                        "slug": "credit-apr-q1",
                        "prompt": "What does APR describe?",
                        "options": ["The yearly cost of borrowing", "A bank account balance", "A credit score"],
                        "correct_index": 0,
                        "explanation": "APR communicates the annualized cost of borrowing money.",
                    }
                ],
            }
        ],
    },
    {
        "id": UUID("20000000-0000-0000-0000-000000000004"),
        "slug": "module_retirement",
        "category": "retirement",
        "flower_name": "Orchid",
        "title": "Retirement Basics",
        "sort_order": 4,
        "lessons": [
            {
                "id": UUID("30000000-0000-0000-0000-000000000005"),
                "slug": "retirement-match",
                "category": "retirement",
                "title": "Retirement Account Basics",
                "sort_order": 1,
                "difficulty": "beginner",
                "content_type": "reading",
                "source_url": None,
                "summary": "Learn why retirement accounts are designed for long-term saving and investing.",
                "reward": {"sunlight": 1, "water": 1},
                "questions": [
                    {
                        "id": UUID("40000000-0000-0000-0000-000000000005"),
                        "slug": "retirement-account-basics-q1",
                        "prompt": "What is the usual purpose of a retirement account?",
                        "options": ["Long-term retirement saving", "Daily spending", "Avoiding every tax"],
                        "correct_index": 0,
                        "explanation": "These accounts support long-term retirement saving goals.",
                    }
                ],
            }
        ],
    },
    {
        "id": UUID("20000000-0000-0000-0000-000000000005"),
        "slug": "module_investing",
        "category": "funds",
        "flower_name": "Purple Tulip",
        "title": "Investing Foundations",
        "sort_order": 5,
        "lessons": [
            {
                "id": UUID("30000000-0000-0000-0000-000000000006"),
                "slug": "investing-risk-return",
                "category": "funds",
                "title": "Why Diversification Matters",
                "sort_order": 1,
                "difficulty": "beginner",
                "content_type": "reading",
                "source_url": None,
                "summary": "Diversification spreads investment exposure instead of relying on one holding.",
                "reward": {"sunlight": 1, "fertilizer": 1},
                "questions": [
                    {
                        "id": UUID("40000000-0000-0000-0000-000000000006"),
                        "slug": "investing-risk-return-q1",
                        "prompt": "What does diversification aim to do?",
                        "options": ["Spread investment exposure", "Guarantee returns", "Remove all risk"],
                        "correct_index": 0,
                        "explanation": "It can reduce concentration risk, but cannot remove all investment risk.",
                    }
                ],
            }
        ],
    },
]

PLANTS = [
    {
        "id": UUID("10000000-0000-0000-0000-000000000001"),
        "type": "budgeting",
        "flower_name": "Daisy",
        "stage": 2,
        "growth": 68,
        "quantity": 3,
        "water": 3,
        "sunlight": 2,
        "fertilizer": 1,
        "unlocked": True,
    },
    {
        "id": UUID("10000000-0000-0000-0000-000000000002"),
        "type": "savings",
        "flower_name": "Marigold",
        "stage": 1,
        "growth": 34,
        "quantity": 1,
        "water": 1,
        "sunlight": 2,
        "fertilizer": 0,
        "unlocked": True,
    },
    {
        "id": UUID("10000000-0000-0000-0000-000000000003"),
        "type": "credit_debt",
        "flower_name": "Rose",
        "stage": 1,
        "growth": 20,
        "quantity": 1,
        "water": 1,
        "sunlight": 1,
        "fertilizer": 0,
        "unlocked": True,
    },
    {
        "id": UUID("10000000-0000-0000-0000-000000000004"),
        "type": "retirement",
        "flower_name": "Orchid",
        "stage": 1,
        "growth": 0,
        "quantity": 1,
        "water": 0,
        "sunlight": 0,
        "fertilizer": 0,
        "unlocked": False,
    },
    {
        "id": UUID("10000000-0000-0000-0000-000000000005"),
        "type": "funds",
        "flower_name": "Purple Tulip",
        "stage": 1,
        "growth": 0,
        "quantity": 1,
        "water": 0,
        "sunlight": 0,
        "fertilizer": 0,
        "unlocked": False,
    },
]


def _upsert(db: Session, model: type, key: UUID, values: dict) -> None:
    instance = db.get(model, key)
    if instance is None:
        db.add(model(id=key, **values))
        return
    for field, value in values.items():
        setattr(instance, field, value)


def seed(db: Session) -> None:
    _upsert(
        db,
        Profile,
        DEMO_USER_ID,
        {
            "display_name": "Demo Gardener",
            "streak_count": 0,
            "last_activity_date": None,
            "current_path": "beginner",
            "garden_visibility": "friends",
        },
    )

    for plant in PLANTS:
        values = {key: value for key, value in plant.items() if key != "id"}
        values["user_id"] = DEMO_USER_ID
        _upsert(db, Plant, plant["id"], values)

    for module in MODULES:
        module_values = {key: value for key, value in module.items() if key not in {"id", "lessons"}}
        _upsert(db, LearningModule, module["id"], module_values)
        for lesson in module["lessons"]:
            lesson_values = {key: value for key, value in lesson.items() if key not in {"id", "questions"}}
            lesson_values["module_id"] = module["id"]
            _upsert(db, Lesson, lesson["id"], lesson_values)
            for question in lesson["questions"]:
                question_values = {key: value for key, value in question.items() if key != "id"}
                question_values["lesson_id"] = lesson["id"]
                _upsert(db, QuizQuestion, question["id"], question_values)

    _upsert(
        db,
        CommunityPost,
        UUID("50000000-0000-0000-0000-000000000001"),
        {
            "user_id": DEMO_USER_ID,
            "template_type": "lesson_completed",
            "content": "I learned what a Roth IRA is.",
        },
    )

    db.commit()


def main() -> None:
    with SessionLocal() as db:
        seed(db)


if __name__ == "__main__":
    main()
