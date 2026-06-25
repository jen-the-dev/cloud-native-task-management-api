# Cloud-Native Task Management API
Backend portfolio project aligned to ANZSCO 261312 (Developer Programmer).

## Recruiter quick view
- Focus: backend API design, service reliability, and data-layer integration.
- Business scenario: task management service with status transitions and cache-accelerated reads.
- Stack signal: Node.js/Express, Redis caching, PostgreSQL-ready service wiring, Docker, CI.
- Current maturity: production-style scaffold with clear extension points for auth, persistence, and testing.

## ANZSCO 261312 competency mapping
- **Designing and documenting software solutions**
  - Defined REST endpoints and status-transition workflow for task lifecycle.
  - Structured environment-based service configuration for local and containerized execution.
- **Writing and maintaining application code**
  - Implemented task create/list/update-status routes with validation and error responses.
  - Added cache-first read strategy with invalidation on write operations.
- **Integrating with data and platform services**
  - Wired Redis client lifecycle and health checks.
  - Prepared database connectivity contract via `DATABASE_URL` for PostgreSQL migration.
- **Testing, debugging, and quality support**
  - Added service health endpoint and starter CI check workflow.
  - Introduced predictable project structure for maintainability and onboarding.

## Evidence map (where reviewers should look)
- API implementation: `api/src/index.js`
- Runtime configuration: `api/.env.example`
- Containerized environment: `docker-compose.yml`
- CI pipeline starter: `.github/workflows/ci.yml`

## Tech stack
- Node.js (Express)
- PostgreSQL (integration-ready)
- Redis
- Docker Compose
- GitHub Actions

## Implemented scope (current)
- `/health` endpoint with cache dependency status.
- Task CRUD subset:
  - `GET /tasks`
  - `POST /tasks`
  - `PATCH /tasks/:id/status`
- Input validation and HTTP error handling.
- Redis read caching and cache invalidation on mutations.

## Quick start
1. `cd api && npm install`
2. `cp .env.example .env`
3. `cd .. && docker compose up --build`
4. Open `http://localhost:4000/health`

## 5-minute demo flow for interviews
1. Start stack with Docker Compose.
2. Show health/readiness response.
3. Create tasks and update status via API calls.
4. Explain cache hit/miss behavior and invalidation strategy.
5. Walk through the path to PostgreSQL-backed persistence.

## Next milestones to strengthen application evidence
- Implement JWT authentication and role-based authorization.
- Replace in-memory task store with PostgreSQL tables and migrations.
- Add unit/integration tests and OpenAPI documentation.
