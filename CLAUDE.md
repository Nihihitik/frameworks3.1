# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Space Data Dashboard - full-stack application for collecting and displaying space-related data. Monorepo structure:

- **backend** (FastAPI/Python 3.12) - REST API that fetches data from external space APIs and stores in PostgreSQL
- **frontend** (Next.js 16/React 19) - Web dashboard with TypeScript and Tailwind CSS

## Build and Run Commands

### Backend

```bash
# Start all services (PostgreSQL + API)
cd project/backend
docker-compose up --build -d

# View logs
docker-compose logs -f backend

# Rebuild
docker-compose build --no-cache

# Stop services
docker-compose down

# Access database
docker-compose exec db psql -U user -d app
```

### Frontend

```bash
# Development (local)
cd project/frontend
npm install  # or bun install
npm run dev

# Docker
cd project/frontend
docker-compose up --build

# Linting
npx ultracite check
npx ultracite fix
```

## Architecture

### Backend (FastAPI)

Layered architecture with async support:

```
app/
├── api/          # Route handlers (health, iss, osdr, space)
├── services/     # Business logic (fetch from APIs, process data)
├── repositories/ # Database operations (SQLAlchemy async)
├── models/       # SQLAlchemy ORM models
├── schemas/      # Pydantic request/response schemas
├── tasks/        # APScheduler background jobs
├── utils/        # Helpers (haversine, json_extract)
├── config.py     # Pydantic Settings
├── database.py   # AsyncSession setup
└── main.py       # FastAPI app with lifespan
```

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/last` | Latest ISS position |
| GET | `/fetch` | Trigger ISS fetch |
| GET | `/iss/trend` | ISS movement trend (speed, direction) |
| GET | `/osdr/sync` | Trigger OSDR sync |
| GET | `/osdr/list` | List OSDR items (paginated) |
| GET | `/space/{src}/latest` | Latest cached data (apod, neo, flr, cme, spacex) |
| GET | `/space/refresh` | Refresh space data (query: src) |
| GET | `/space/summary` | Summary of all cached sources |

**Database Tables:**
- `iss_fetch_log` - ISS position history (JSONB payload)
- `osdr_items` - NASA OSDR datasets
- `space_cache` - Universal cache for space API data

**Background Tasks (APScheduler):**
- ISS position: every 2 min
- OSDR datasets: every 10 min
- APOD: every 12h
- NeoWs asteroids: every 2h
- DONKI (FLR/CME): every 1h
- SpaceX launches: every 1h

### Frontend (Next.js)

App Router structure with Server Components:
- `app/` - Pages and layouts
- Uses Ultracite (Biome preset) for linting/formatting
- Tailwind CSS v4 for styling

### Service Communication

```
Frontend:3000 -> Backend:8000 -> External APIs
                      ↓
                PostgreSQL:5432
```

## Environment Variables

Backend `.env` (copy from `.env.example`):

```bash
# Required
DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/app

# Optional - API keys for full functionality
NASA_API_KEY=          # For APOD, NeoWs, DONKI endpoints
JWST_API_KEY=          # James Webb telescope API
ASTRO_APP_ID=          # Astronomy API
ASTRO_APP_SECRET=      # Astronomy API

# Fetch intervals (seconds)
ISS_FETCH_INTERVAL=120
OSDR_FETCH_INTERVAL=600
```

Frontend `.env`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## External APIs

| API | Base URL | Required Key |
|-----|----------|--------------|
| WhereTheISS | api.wheretheiss.at | None |
| NASA OSDR | visualization.osdr.nasa.gov | None |
| NASA APOD | api.nasa.gov | NASA_API_KEY |
| NASA NeoWs | api.nasa.gov | NASA_API_KEY |
| NASA DONKI | api.nasa.gov | NASA_API_KEY |
| SpaceX | api.spacexdata.com | None |
| JWST | api.jwstapi.com | JWST_API_KEY |
| AstronomyAPI | api.astronomyapi.com | ASTRO_APP_ID/SECRET |

## Key Dependencies

**Backend:**
- FastAPI 0.115+
- SQLAlchemy 2.0+ (async)
- asyncpg (PostgreSQL driver)
- httpx (async HTTP client)
- APScheduler (background tasks)
- Pydantic Settings

**Frontend:**
- Next.js 16, React 19
- TypeScript 5
- Tailwind CSS 4
- Biome (via Ultracite)
