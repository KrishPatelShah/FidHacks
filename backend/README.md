# Flourish Backend

This backend is a FastAPI service backed by PostgreSQL.

## Local Services

```text
Expo app -> FastAPI API -> PostgreSQL
```

Docker Compose starts:

- `api`: FastAPI on `http://localhost:8000`
- `db`: PostgreSQL on `localhost:5432`

## Run

```bash
docker compose up --build
```

On startup, the API container runs:

```bash
alembic upgrade head
python -m app.db.seed
```

That creates the schema and loads deterministic demo data before Uvicorn starts.

Health checks:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/health
```

Interactive API docs:

```text
http://localhost:8000/docs
```

## First-Pass API Surface

```text
POST /api/auth/demo
POST /api/questionnaire
GET  /api/plants
POST /api/plants/{plant_id}/grow
GET  /api/lessons
GET  /api/lessons/{lesson_id}
GET  /api/quizzes/{lesson_id}
POST /api/quizzes/{lesson_id}/attempts
GET  /api/budget
POST /api/budget
GET  /api/community/gardens
GET  /api/community/posts
POST /api/sunflower/ask
```

Demo authentication:

```bash
curl -X POST http://localhost:8000/api/auth/demo
```

Protected routes expect the returned token as:

```text
Authorization: Bearer demo:<uuid>
```

## Database Commands

From inside the API container:

```bash
docker compose exec api alembic upgrade head
docker compose exec api python -m app.db.seed
docker compose exec api pytest
```

From the host, override `DATABASE_URL` so it points at `localhost` instead of the Compose service name `db`.
