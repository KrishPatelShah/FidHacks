# Backend Next Steps

## Implementation Gaps

**1. No route actually touches the database**
All of `app/api/routes/*.py` (plants, lessons, quizzes, budget, community, questionnaire) return hardcoded in-memory lists/objects. The SQLAlchemy models (`Plant`, `Profile`, `Lesson`, `QuizQuestion`, `BudgetEntry`, `CommunityPost`, etc.) are fully defined in `app/models/` but never queried — no route imports `get_db` from `app/db/session.py`.

**2. No Alembic migrations exist**
`alembic.ini` is set up but there's no `alembic/versions/` directory. The startup command `alembic upgrade head` would currently do nothing.

**3. `app/db/seed.py` doesn't exist**
Referenced in the README and Docker startup flow, but the file is missing.

**4. No real auth**
`auth.py`'s `/demo` endpoint returns a static hardcoded UUID token, but nothing validates `Authorization: Bearer demo:<uuid>` on other routes — there's no `app/api/deps.py` dependency to extract/verify the user. Every route is effectively single-user.

**5. Sunflower AI isn't wired to Gemini**
`app/services/sunflower.py` is just keyword matching (checks for "apr", "roth", etc.) — it duplicates the frontend's `src/services/ai.ts` stub instead of calling an LLM. Wire it to a backend provider when AI responses are ready.

**6. `backend/tests/` is empty** despite `pytest` in requirements.

**7. Frontend isn't calling the FastAPI backend at all** — no HTTP client pointed at `localhost:8000/api/*` exists yet in the Expo app.

## Suggested Order of Attack

1. Generate initial Alembic migration from existing models
2. Write `app/db/seed.py`
3. Add `app/api/deps.py` for demo-token auth + `get_current_user`
4. Convert routes one at a time to query real DB (plants → questionnaire → lessons/quizzes → budget → community)
5. Decide Gemini integration point (backend route vs. keep Edge Function) and wire `sunflower.py` to it
6. Add a minimal test for at least one converted route
7. Build the frontend API client and swap `src/data/*.ts`/`src/services/ai.ts` stubs for real calls
