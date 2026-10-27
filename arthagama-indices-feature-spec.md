# Arthagama Indices --- Frontend Feature Specification

## 1. Objective

Build a new **Arthagama Indices** feature with two experiences:

1.  **Admin Index Management** --- administrators can create, view,
    edit, and delete/deactivate Arthagama indices.
2.  **User Indices Dashboard** --- users can browse active indices
    grouped by sector and inspect index performance.

This is a **frontend-only implementation**. Use typed mock API functions
and static mock data. Do not create backend endpoints, database
migrations, or real network requests.

Before coding, inspect the existing app layouts, route conventions,
navigation, shared components, API client, types, instrument mocks, and
styling. Reuse existing patterns.

## 2. Routes and Pages

Frontend root:

`C:\Users\Dhruv\OneDrive\Desktop\mustaali\arthagama_frontend`

### User routes

Create under `app/dashboard/indices/`:

-   `/dashboard/indices` --- list active indices grouped by sector.
-   `/dashboard/indices/[indexId]` --- index details and performance.

### Admin routes

Create under `app/admin/indices/`:

-   `/admin/indices` --- list and manage all indices.
-   `/admin/indices/new` --- create an index.
-   `/admin/indices/[indexId]/edit` --- edit an index.

Follow existing route conventions if they differ. Reuse the existing
dashboard/admin shells. Add **Arthagama Indices** to user navigation and
**Index Management** to admin navigation. Keep CRUD actions off the
user-facing pages.

## 3. Data Model

The frontend types and mocks should reflect the intended relational
model, without creating the database now.

### 3.1 Arthagama index entity

Suggested table: `arthagama_indices`

  --------------------------------------------------------------------------
  Field                   Type                    Description
  ----------------------- ----------------------- --------------------------
  `index_id`              `BIGINT`                Database-generated primary
                                                  key; do not ask admins to
                                                  enter it.

  `index_name`            `TEXT`                  Required index name.

  `sector`                `TEXT`                  Required industry/sector,
                                                  e.g. IT Services, Banking,
                                                  FMCG.

  `index_symbol`          `TEXT` nullable         Optional unique
                                                  display/ticker symbol.

  `description`           `TEXT` nullable         Short
                                                  description/methodology.

  `base_date`             `DATE`                  Date from which
                                                  performance is measured.

  `base_value`            `NUMERIC`               Starting value, e.g. 1000.

  `is_active`             `BOOLEAN`               Whether it is visible to
                                                  users.

  `created_at`            `TIMESTAMPTZ`           Creation timestamp.

  `updated_at`            `TIMESTAMPTZ`           Last update timestamp.
  --------------------------------------------------------------------------

Rules: - Generate `index_id` in the database in a future backend. For
mocks, use stable generated numeric IDs consistent with project
conventions. - Require index name and sector. - Hide inactive/draft
indices from the normal user dashboard. - Confirm before delete. -
Consider deactivation/archive if preserving history is important. In
mock CRUD, keep related records consistent after delete.

### 3.2 Index-instrument relation

Suggested table: `arthagama_index_instruments`

  -------------------------------------------------------------------------------
  Field                   Type                    Description
  ----------------------- ----------------------- -------------------------------
  `index_id`              `BIGINT`                FK to
                                                  `arthagama_indices.index_id`.

  `instrument_id`         `BIGINT`                FK to the existing instrument
                                                  table.

  `weight`                `NUMERIC` nullable      Optional constituent weight, if
                                                  the methodology supports
                                                  weighting.

  `added_at`              `TIMESTAMPTZ`           When the instrument was added.

  `created_at`            `TIMESTAMPTZ`           Relation creation timestamp.
  -------------------------------------------------------------------------------

Recommended constraints: - Composite primary key: (`index_id`,
`instrument_id`) so the same instrument cannot be added twice to one
index. - `index_id` references `arthagama_indices.index_id`. -
`instrument_id` references the existing instrument table. - Initially
allow only `instrument_type = 'EQUITY'`, unless the product explicitly
supports other types. - If weights are enabled, require non-negative
weights and validate their sum according to the chosen methodology. Do
not silently assign arbitrary weights.

Relationship:

`arthagama_indices 1 ─── * arthagama_index_instruments * ─── 1 instrument`

One index can contain many instruments, and one instrument can belong to
multiple indices. Do not create a duplicate instrument table.

### 3.3 Existing instrument type

Reuse the existing instrument type. Its fields are:

``` ts
type Instrument = {
  instrument_id: number
  exchange: string
  symbol: string
  instrument_type: 'EQUITY' | 'INDEX' | 'FUTURE' | 'OPTION'
  expiry_date: string | null
  strike_price: number | null
  option_type: 'CE' | 'PE' | null
  future_type: string | null
  lot_size: number | null
  created_at: string
}
```

Example instrument:

``` json
{
  "instrument_id": 501,
  "exchange": "NSE",
  "symbol": "RELIANCE",
  "instrument_type": "EQUITY",
  "expiry_date": null,
  "strike_price": null,
  "option_type": null,
  "future_type": null,
  "lot_size": 1,
  "created_at": "2026-10-14T09:01:00+05:30"
}
```

Import the project's existing `Instrument` type rather than redefining
it if one already exists. All relation mocks must reference IDs that
actually exist in the instrument mock catalogue.

### 3.4 Performance types

Keep index metadata, constituents, and performance separate. For this
frontend version, performance figures and history are illustrative mock
data.

``` ts
type IndexPerformanceSummary = {
  index_id: number
  current_value: number
  absolute_change: number
  percent_change: number
  as_of: string
  return_1d_pct?: number | null
  return_1w_pct?: number | null
  return_1m_pct?: number | null
  return_3m_pct?: number | null
  return_6m_pct?: number | null
  return_1y_pct?: number | null
  return_ytd_pct?: number | null
  base_value: number
  base_date: string
}

type IndexHistoryPoint = {
  date: string
  value: number
}
```

Clearly identify mock figures as illustrative. Do not imply that values
are live or verified.

## 4. Admin Index Management

### 4.1 Admin list --- `/admin/indices`

Display: - Index name and symbol (if enabled). - Sector. - Number of
constituents. - Current mock index value. - Daily absolute and
percentage change. - Status (Active/Inactive/Draft). - Last updated
timestamp. - Actions: View/Edit and Delete/Deactivate.

Include search, sector/status filters, sorting/pagination consistent
with existing table components, loading/error states, and an empty state
with a **Create Index** action.

### 4.2 Create --- `/admin/indices/new`

Form fields: - Index Name --- required. - Sector --- required, using a
predefined sector list consistent with the product. - Symbol ---
optional if supported; validate uniqueness. - Description ---
optional. - Base Date. - Base Value --- positive number, default
e.g. 1000. - Status/publish toggle. - Constituents --- search and select
existing instruments by `instrument_id`. - Weight per constituent ---
only if weighted indices are supported.

Validation: - Do not ask for index ID. - Require name and sector. -
Prevent duplicate names/symbols according to product rules. - Prevent
duplicate constituents in the same index. - Initially restrict
constituents to eligible equity instruments. - Require at least one
constituent before publishing unless drafts without constituents are
explicitly supported. - Validate weights if weighting is enabled. - Show
field-level errors.

### 4.3 Edit --- `/admin/indices/[indexId]/edit`

Allow admins to edit metadata, status, constituents, and weights (if
supported). Show existing constituents. Allow add/remove and update
weights. Save or cancel. The index ID must not change.

### 4.4 Delete/deactivate

-   Confirm before deletion.
-   Explain that deletion removes the index from the user listing and
    affects its constituent relations.
-   Keep relation records consistent when deleting in mock state.
-   Prefer deactivate/archive when retaining history is important.
-   Use the existing toast/notification pattern. Do not claim a real
    database was modified.

## 5. User Indices Dashboard

### 5.1 Index catalogue --- `/dashboard/indices`

Group active indices by sector. Example groups: - IT Services -
Banking - Financial Services - FMCG - Automobiles - Energy -
Healthcare - Industrials - Telecommunications

Only render groups with indices.

Each index card should show: - Index name and optional symbol. -
Sector. - Current index value. - Daily absolute and percentage change. -
A selected period return (e.g. 1M or 1Y). - Number of constituents. -
As-of timestamp. - Optional sparkline only when history mock data
exists. - Link to index details.

Include search by name/symbol, sector filter, optional sorting by daily
performance/1M/1Y return, and clear loading, empty, and unavailable-data
states.

### 5.2 Index details --- `/dashboard/indices/[indexId]`

Display: - Index name, symbol, sector, description. - Current index
value and daily change. - Performance chart. - Period selectors: 1D, 1W,
1M, 3M, 6M, 1Y, YTD, Max where mock history exists. - Methodology
summary if available. - Constituents table: symbol, exchange, weight (if
used), and contribution only if mock data exists. - As-of timestamp and
a clear mock-data disclaimer during development.

Use static mock chart points. Do not claim to calculate real performance
from real prices.

## 6. Index Methodology

The frontend must display mock performance only. A future backend must
define: - Equal-weighted, price-weighted, or market-cap-weighted
methodology. - Base value and base date. - Rebalancing frequency and
constituent rules. - Treatment of splits, dividends, bonuses, mergers,
and symbol changes. - Price return vs total return. - Trading calendar
and missing-price handling.

For this phase, display the values returned by mock APIs. Do not
calculate index performance inside React components. Keep future
calculation logic in a domain/service layer.

## 7. Suggested Folder Structure

Follow the repository's actual conventions if different.

``` text
app/
├── dashboard/
│   └── indices/
│       ├── page.tsx
│       └── [indexId]/
│           └── page.tsx
└── admin/
    └── indices/
        ├── page.tsx
        ├── new/
        │   └── page.tsx
        └── [indexId]/
            └── edit/
                └── page.tsx

src/
├── components/
│   └── indices/
│       ├── IndexCard.tsx
│       ├── IndexPerformanceSummary.tsx
│       ├── IndexPerformanceChart.tsx
│       ├── IndexConstituentsTable.tsx
│       ├── IndexFilters.tsx
│       ├── IndexForm.tsx
│       ├── ConstituentSelector.tsx
│       ├── IndexStatusBadge.tsx
│       └── DeleteIndexDialog.tsx
├── views/
│   ├── dashboard/indices/
│   │   ├── IndicesListView.tsx
│   │   └── IndexDetailsView.tsx
│   └── admin/indices/
│       ├── AdminIndicesView.tsx
│       ├── CreateIndexView.tsx
│       └── EditIndexView.tsx
├── hooks/
│   └── indices/
│       ├── useIndices.ts
│       ├── useIndexDetails.ts
│       ├── useIndexPerformance.ts
│       └── useAdminIndices.ts
├── lib/api/indices/
│   ├── indices.api.ts
│   └── indices.endpoints.ts
├── types/indices/
│   ├── index.types.ts
│   ├── index-performance.types.ts
│   └── index-api.types.ts
├── utils/indices/
│   ├── format-index-value.ts
│   └── validate-index.ts
└── mocks/indices/
    ├── indices.mock.ts
    ├── index-constituents.mock.ts
    ├── index-performance.mock.ts
    └── instruments.mock.ts
```

Notes: - Reuse an existing instrument catalogue instead of duplicating
it. - Reuse the existing shared HTTP client if one exists; do not create
another. - Use existing chart, table, form, modal, and toast
components. - Keep components presentational where possible; use
views/hooks for orchestration. - Follow existing import aliases and
naming conventions.

## 8. Frontend API Contract --- No Version Prefix

These are proposed frontend paths only. Do not create backend endpoints.
Add constants and typed mock functions backed by the dedicated mock
files.

### User-facing APIs

  ---------------------------------------------------------------------------------------
  Method                  Path                                    Purpose
  ----------------------- --------------------------------------- -----------------------
  `GET`                   `/api/indices`                          List active/published
                                                                  indices; optional
                                                                  sector/search/sort
                                                                  filters.

  `GET`                   `/api/indices/sectors`                  Return sectors that
                                                                  have indices.

  `GET`                   `/api/indices/{indexId}`                Return index metadata
                                                                  and constituents.

  `GET`                   `/api/indices/{indexId}/performance`    Return current summary
                                                                  and period returns.

  `GET`                   `/api/indices/{indexId}/history`        Return history points
                                                                  for a selected period.

  `GET`                   `/api/indices/{indexId}/constituents`   Return instruments in
                                                                  the index.

  `GET`                   `/api/instruments/search?q={query}`     Search instrument mocks
                                                                  for the constituent
                                                                  selector only if no
                                                                  reusable
                                                                  instrument-search
                                                                  function exists.
  ---------------------------------------------------------------------------------------

### Admin mock APIs

  --------------------------------------------------------------------------------
  Method                  Path                             Purpose
  ----------------------- -------------------------------- -----------------------
  `GET`                   `/api/admin/indices`             List all indices,
                                                           including
                                                           inactive/draft indices.

  `POST`                  `/api/admin/indices`             Create an index in mock
                                                           state.

  `GET`                   `/api/admin/indices/{indexId}`   Retrieve an index for
                                                           editing.

  `PATCH`                 `/api/admin/indices/{indexId}`   Update metadata and/or
                                                           constituents.

  `DELETE`                `/api/admin/indices/{indexId}`   Delete an index and its
                                                           relation records, or
                                                           follow an agreed
                                                           deactivate approach.
  --------------------------------------------------------------------------------

### API rules

1.  Keep functions in `src/lib/api/indices/indices.api.ts`.
2.  Keep paths in `src/lib/api/indices/indices.endpoints.ts` or the
    existing central endpoint constants module.
3.  Define request/response types in `src/types/indices/`.
4.  Use async functions returning realistic response shapes.
5.  Keep static records in `src/mocks/indices/`.
6.  Mock create/update/delete operations must keep index and relation
    data consistent for the current session.
7.  Follow the existing mock service/query-cache pattern if present.
8.  Do not call the real backend.
9.  Do not add `/v1`, `/v2`, or any other version prefix.
10. Keep frontend routes separate from API paths.
11. In-memory changes do not survive a full refresh unless the project
    already provides persistence; do not promise persistence unless
    implemented.

## 9. Suggested Types and Response Shapes

Use the project's existing naming convention. The following uses
camelCase for frontend types.

``` ts
export type IndexStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT'

export type ArthagamaIndex = {
  indexId: number
  indexName: string
  indexSymbol?: string | null
  sector: string
  description?: string | null
  baseDate: string
  baseValue: number
  status: IndexStatus
  createdAt: string
  updatedAt: string
  constituentCount: number
}

export type IndexConstituent = {
  indexId: number
  instrumentId: number
  weight?: number | null
  addedAt: string
  instrument: Instrument
}

export type CreateIndexRequest = {
  indexName: string
  indexSymbol?: string | null
  sector: string
  description?: string | null
  baseDate: string
  baseValue: number
  status: IndexStatus
  constituents: Array<{
    instrumentId: number
    weight?: number | null
  }>
}

export type UpdateIndexRequest = Partial<CreateIndexRequest>

export type IndexPerformanceSummary = {
  indexId: number
  currentValue: number
  absoluteChange: number
  percentChange: number
  asOf: string
  return1dPct?: number | null
  return1wPct?: number | null
  return1mPct?: number | null
  return3mPct?: number | null
  return6mPct?: number | null
  return1yPct?: number | null
  returnYtdPct?: number | null
  baseValue: number
  baseDate: string
}

export type IndexHistoryPoint = {
  date: string
  value: number
}
```

Import `Instrument` from the existing instrument type module if it
already exists. Do not create a duplicate instrument model.

## 10. Mock Data Requirements

Provide sample indices across multiple sectors, such as: - Arthagama IT
Services Index - Arthagama Banking Leaders Index - Arthagama FMCG
Index - Arthagama Auto & Mobility Index - Arthagama Energy Index -
Arthagama Healthcare Index

Use existing instrument mock data and valid `instrument_id` values. For
each index provide metadata, constituent relations, mock performance
summary, dated history points, sector, and as-of timestamp.

Keep mock figures illustrative. Make displayed current value and change
internally consistent. Do not fabricate missing metrics or use IDs that
do not exist.

## 11. Loading, Error, Empty, and Accessibility States

Include: - Existing loading skeletons or loading components. - Empty
state when no indices match filters. - Not-found state for invalid index
IDs. - Field-level form validation. - Delete confirmation. -
Success/error feedback via existing notifications. - Safe handling of
missing price history or unavailable values. - Semantic headings and
labels, keyboard-accessible dialogs, and accessible names for icon-only
actions. - Responsive charts/tables; do not rely on colour alone to
convey performance direction or status.

## 12. Acceptance Criteria

### Admin

-   Can list all indices, including inactive/draft ones.
-   Can create an index with an auto-generated mock ID.
-   Can select existing instruments by valid ID.
-   Can edit index metadata and constituents.
-   Can delete/deactivate after confirmation.
-   Relation records remain consistent after updates/deletion.
-   Validation prevents duplicate/invalid constituents.

### User dashboard

-   Lists only active/published indices.
-   Groups indices by sector.
-   Supports search/filter and index detail navigation.
-   Displays mock performance and period returns.
-   Details page includes a performance chart and constituent table.
-   Missing history/data is handled safely.

### Architecture

-   Routes live under existing `app/dashboard` and `app/admin`.
-   Views, components, hooks, API functions, types, utilities, and mocks
    are separated.
-   Existing instrument types and mock data are reused.
-   No backend calls, backend endpoints, or migrations are introduced.
-   No API path has a version prefix.
-   Existing dashboard/admin functionality remains unaffected.

## 13. Implementation Order

1.  Inspect existing route/layout/API/type/mock/instrument conventions.
2.  Add index and relation types.
3.  Add mock index metadata, relations, performance summaries, and
    history.
4.  Implement typed mock APIs and endpoint constants.
5.  Build admin list, create, edit, and delete/deactivate flows.
6.  Build the user catalogue grouped by sector.
7.  Build index detail with performance and constituents.
8.  Add navigation using existing patterns.
9.  Add validation, loading/empty/error states, and responsive styling.
10. Run lint, type-check, and build commands; fix regressions.

**Final requirement:** Implement within the existing Arthagama frontend
architecture. Do not create backend endpoints, migrations, or a second
instrument data model. All initial operations must use typed mock
functions and dedicated mock-data files.
