# Financial Garden Backend

This backend replaces direct Supabase access with a FastAPI service backed by PostgreSQL.

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

Current routes return demo data while the database layer, migrations, and seed data are wired in.
