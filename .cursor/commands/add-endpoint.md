# /add-endpoint

Create a new backend endpoint following project standards.

## Inputs

- Method + path
- Request payload shape
- Response shape
- Persistence requirement (yes/no)

## Command behavior

1. Create or update DTO with validation + Swagger.
2. Add controller method that delegates to service.
3. Implement service logic and persistence.
4. Add observability instrumentation (metric, structured log, error path).
5. Run lint/build and return changed files + verification steps.
