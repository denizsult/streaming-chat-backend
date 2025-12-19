# Streaming Chat Backend

## Live Deployment
🚀 **Production URL:** https://streaming-chat-backend.onrender.com  
Deployed on [Render.com](https://render.com) with [Upstash Redis](https://upstash.com)

For any deployment issues, please contact the maintainer.

## Overview
This backend implements a resumable, stateful streaming engine using Server-Sent Events (SSE).
It is designed as a case study to demonstrate robust streaming lifecycle management.

## Purpose
The goal of this backend is to safely stream incremental data over HTTP while handling:
- Refreshes
- Reconnects
- Network interruptions

## Core Design Principle
Streaming state must live outside the request lifecycle.
Redis is used as the single source of truth for session progress.

## Architecture
- Controllers: HTTP/SSE contract and lifecycle decisions
- Services: Streaming logic, timers, Redis persistence
- Redis: Session state persistence

## Session Lifecycle
CREATED → STREAMING → COMPLETED

### Completed Sessions
If a client reconnects to a completed session, the backend:
- Sends a single completion event
- Closes the stream immediately

This behavior is idempotent by design.

## Trade-offs
- SSE instead of WebSockets for simplicity
- Redis instead of in-memory storage
- No parallel stream guard to keep focus on streaming correctness

## What This Demonstrates
- Stateful SSE streaming
- Resume-safe reconnects
- Explicit session modeling

## Local Development with Docker

### Prerequisites
- Docker
- Docker Compose

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Start the services**
```bash
docker-compose up -d
```

This will start:
- Redis on port `6379`
- Backend API on port `3001`

3. **Check service health**
```bash
docker-compose ps
```

4. **View logs**
```bash
docker-compose logs -f backend
```

5. **Stop the services**
```bash
docker-compose down
```

### Environment Variables

The `docker-compose.yml` configures:
- `NODE_ENV=production`
- `PORT=3001`
- `REDIS_URL=redis://redis:6379`

For production deployment with Upstash Redis, update `REDIS_URL` to your Upstash connection string.

### Health Check
Once running, visit: `http://localhost:3001/health`
