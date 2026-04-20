# Signal Lab - PRD 001 Platform Foundation

## Prerequisites
- Docker + Docker Compose plugin
- Node.js 22+ (for running apps outside Docker)

## Project Structure
- `apps/frontend` - Next.js App Router + Tailwind + shadcn-style UI components
- `apps/backend` - NestJS API
- `prisma` - Prisma schema and migrations
- `docker-compose.yml` - local runtime stack

## Environment Setup
1. Copy `.env.example` to `.env`
2. Adjust values if needed

```bash
cp .env.example .env
```

## Run Everything

```bash
docker compose up -d
```

Services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- Swagger: `http://localhost:3001/api/docs`
- PostgreSQL: `localhost:5432`

## Quick Verification

```bash
curl localhost:3001/api/health
```

Expected response:

```json
{"status":"ok","timestamp":"2026-01-01T00:00:00.000Z"}
```

## Stop Everything

```bash
docker compose down
```
