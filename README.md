# Cloud-Native Task Management API
Backend-focused portfolio sample for ANZSCO 261312 (Developer Programmer).

## Why this project helps your visa/job-hunt profile
- Shows API design and backend architecture decisions.
- Demonstrates database + caching integration (PostgreSQL and Redis).
- Proves production mindset with Dockerized local environments and CI.

## Tech stack
- Node.js (Express)
- PostgreSQL
- Redis
- Docker Compose
- GitHub Actions

## MVP scope
- Health and readiness endpoint.
- Task CRUD basics (create/list/update status).
- In-memory persistence now, with environment wiring ready for PostgreSQL and Redis.
- Cache-first reads for task listings.

## Repository structure
- `api/` - Express service.
- `docker-compose.yml` - Local API + PostgreSQL + Redis stack.
- `.github/workflows/ci.yml` - Starter CI pipeline.

## Quick start
1. `cd api && npm install`
2. `cp .env.example .env`
3. `cd .. && docker compose up --build`
4. Open `http://localhost:4000/health`

## Next upgrades (recommended before interviews)
- Add JWT authentication and role-based authorization.
- Replace in-memory task store with PostgreSQL tables + migrations.
- Add tests (unit + integration) and API docs (OpenAPI).
