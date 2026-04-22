---
name: observability
description: Implements and validates backend observability with Prometheus metrics, structured logs, and Sentry hooks. Use when adding or modifying backend flows that must be measurable and debuggable.
---

# Observability Skill

## When to Use

- Adding new backend endpoints or business flows.
- Updating scenario execution logic.
- Introducing failure paths that need monitoring and alerting.
- Debugging missing metrics/logs/errors in local stack.

## Step-by-step instructions

1. Identify the flow boundary and expected states (success, validation failure, system failure).
2. Add/verify a counter metric for event volume and a duration metric for timing.
3. Ensure labels are low-cardinality and meaningful (for example `type`, `status`).
4. Emit structured JSON logs with identifiers (`scenarioType`, `scenarioId`, `duration`, `error`).
5. Wire Sentry:
   - capture exceptions for system errors,
   - optionally add breadcrumbs for validation failures.
6. Confirm `/metrics` exposure and scrape target health in Prometheus.
7. Verify Grafana panels and Loki query visibility for the updated flow.
8. Record any new env/config requirements in docs.
