# Streaming Chat Backend

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