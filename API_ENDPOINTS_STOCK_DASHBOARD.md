## API Paths — No Version Prefix

**Important:** Do not include `/v1`, `/v2`, or any other version prefix in API paths. Use the paths exactly as defined below. This is a frontend-only implementation, so implement these APIs as typed mock functions returning modular static data. Do not create backend endpoints.

### 1. Dashboard
- `GET /api/stockdashboard/overview`
- `GET /api/stockdashboard/market-summary`
- `GET /api/stockdashboard/top-gainers`
- `GET /api/stockdashboard/top-losers`
- `GET /api/stockdashboard/most-active`
- `GET /api/stockdashboard/recently-viewed`

### 2. Stock Search
- `GET /api/stocks/search?q={query}`
- `GET /api/stocks/{exchange}/{symbol}/quick-info`

Use one shared `GlobalStockSearch` component for the existing Terminal and Stock Dashboard. Refactor the current search implementation only as needed, preserving existing Terminal behavior.

### 3. Stock Overview
- `GET /api/stocks/{exchange}/{symbol}`
- `GET /api/stocks/{exchange}/{symbol}/price`
- `GET /api/stocks/{exchange}/{symbol}/chart`
- `GET /api/stocks/{exchange}/{symbol}/key-metrics`

### 4. Fundamentals
- `GET /api/stocks/{exchange}/{symbol}/fundamentals`
- `GET /api/stocks/{exchange}/{symbol}/financials`
- `GET /api/stocks/{exchange}/{symbol}/ratios`
- `GET /api/stocks/{exchange}/{symbol}/shareholding`
- `GET /api/stocks/{exchange}/{symbol}/peers`


### 5. Earnings & Results
- `GET /api/stocks/{exchange}/{symbol}/earnings`
- `GET /api/stocks/{exchange}/{symbol}/quarterly-results`
- `GET /api/stocks/{exchange}/{symbol}/annual-results`
- `GET /api/stocks/{exchange}/{symbol}/dividends`
- `GET /api/stocks/{exchange}/{symbol}/corporate-actions`

### 6. Stock Screener
- `GET /api/screener/filters`
- `POST /api/screener/preview`
- `POST /api/screener/run`
- `GET /api/screener/presets`
- `GET /api/screener/presets/{presetId}`

### 7. Compare Stocks
- `POST /api/stocks/compare`
- `GET /api/stocks/compare/metrics`

### 8. Watchlists & Portfolio
- `GET /api/watchlists`
- `POST /api/watchlists`
- `GET /api/watchlists/{watchlistId}`
- `PATCH /api/watchlists/{watchlistId}`
- `DELETE /api/watchlists/{watchlistId}`
- `POST /api/watchlists/{watchlistId}/stocks`
- `DELETE /api/watchlists/{watchlistId}/stocks/{exchange}/{symbol}`
- `GET /api/portfolio/summary`
- `GET /api/portfolio/holdings`
- `GET /api/portfolio/performance`

### Frontend API Implementation Rules

1. Keep API functions inside feature-specific API modules; do not put every endpoint in one file.
2. Define request and response types separately in each feature's `types` folder.
3. For now, each API function should return data from that feature's dedicated mock-data files.
4. Use `async` functions and realistic response shapes so mock implementations can later be replaced with real HTTP calls without rewriting the views or components.
5. Keep URL paths in a central endpoint/constants module, without version prefixes.
6. Use the existing shared HTTP client and environment-based base URL if the project already has them. Do not create a duplicate client.
7. Do not call a real backend or invent backend response fields. Mark sample market figures as mock data.
8. Keep route paths and API paths separate. For example, `/admin/stockdashboard/all` is a frontend route, not an API endpoint.
9. These paths are the proposed frontend API contract; confirm compatibility with the existing backend before enabling real requests.
10. Do not add a version prefix automatically in any API helper or URL builder.