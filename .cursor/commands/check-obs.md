# /check-obs

Validate observability wiring for current backend implementation.

## Command behavior

1. Confirm `/metrics` is exposed and key metrics are present.
2. Verify Prometheus target health for backend scrape.
3. Check Grafana health and datasource provisioning status.
4. Validate Loki ingestion with query `{app="signal-lab"}`.
5. Confirm structured logs include scenario fields.
6. Confirm Sentry integration path for system errors.
