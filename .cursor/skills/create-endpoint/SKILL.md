---
name: create-endpoint
description: Adds a new NestJS API endpoint using project DTO/service/controller patterns with persistence and observability checks. Use when implementing new backend API capabilities.
---

# Create Endpoint Skill

## When to Use

- User asks for a new backend endpoint.
- Existing endpoint needs a new action path.
- PRD requires API contract expansion.

## Step-by-step instructions

1. Define the contract first:
   - route, method, request DTO, response shape.
2. Update or create DTO with `class-validator` and Swagger decorators.
3. Add controller method:
   - keep it thin,
   - delegate to service.
4. Implement service logic and persistence operations.
5. Add observability in service path:
   - metric emission,
   - structured log event,
   - error capture path.
6. Validate API behavior with local calls (`curl` or tests).
7. Run lint/build and fix any type or style issues.
8. Update docs or frontend callers if contract changed.
