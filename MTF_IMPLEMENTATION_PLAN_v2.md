```
ARTHAGAMA - MTF ANALYTICS MODULE
Implementation plan v2 (backend + frontend + data pipeline)
Date: 28 Oct 2026
```

```
Stack: FastAPI, SQLAlchemy 2.0 ORM, Alembic, PostgreSQL (Supabase) | Next.js
(App Router) + TypeScript
```

- `REVISION NOTES (v2, verified against the mtf.trading data page of 28 Oct 2026) Added   : period + per-date reports, market-cap history, AMC allocation, CP derived series, Supabase section, source URL + unit per dataset, verification checklist (section 13).` 

```
  Fixed   : decision 6 (units are NOT all crore), licence (CC BY-SA 4.0 =
            ShareAlike), cp_holder / broker_book / pledge keys, advisory lock
            on Supabase pooler, phase labels for bhavcopy/PR/MCX.
  Unchanged: architecture, sub-feature layout, access control, API style.
```

```
======================================================================
```

# `0. DECISIONS (LOCKED)` 

```
======================================================================
```

`1. Option B: model every dataset with SQLAlchemy ORM, migrate with Alembic.` 

`2. MTF data lives in PostgreSQL (Supabase for now) from day one. MongoDB Atlas stays for the existing features (strategies, users, etc.). No Mongo->Postgres migration is needed for MTF. ORM models are plain relational tables, so they stay portable to any SQL host later (no Supabase-only features in models). 3. New feature: app/features/mtf/, split into independent sub-features. Every sub-feature owns: router.py, service.py, schemas.py, models.py, repository.py.` 

`4. A daily cron job refreshes snapshots (once per day, idempotent).` 

`5. Access: admin-only now, switchable to all users in ONE line (same pattern as terminal_access). See licence note in decision 7 before flipping it.` 

`6. Single money unit in OUR DB: Rs CRORE (NUMERIC). The source is mixed:` 

- `bulk exports (/exports/*.csv.gz)        : already all crore` 

- `legacy JSON/CSV series (totals, flow,` 

- `breadth, composition, brokers)          : Rs LAKH` 

- `demat / free float, broker CP, CP holders: Rs crore` 

- `global margin debt (/api/v1/global)     : Rs LAKH CRORE` 

- `Therefore every DatasetSpec declares source_unit (cr | lakh | lakh_cr) and the ingestor converts once, at the boundary, via shared/units.py. Prefer the bulk export over the legacy JSON whenever both exist.` 

`7. We build our own UI and our own calculations. We reuse the published data, not their code or design. Attribute: "MTF data via mtf.trading, from NSE/BSE disclosures".` 

```
   LICENCE: the compiled dataset is CC BY-SA 4.0 (ShareAlike). Attribution is
   required AND derivatives we redistribute (CSV exports, public API, shared
   datasets) must be shared under the same licence. Internal/admin display is
   low risk; get this reviewed BEFORE opening the module to all users or
   offering downloads. Underlying figures remain NSE/BSE/SEBI copyright.
```

`8. Database host: Supabase Postgres.` 

- `All MTF tables live in a dedicated schema `mtf` (not `public`), so they are not exposed through the Supabase data API / anon key. Also enable RLS with no policies on them as a second guard.` 

- `Table names keep the mtf_ prefix inside that schema for portability.` 

- `Connection rules are in section 14.` 

```
======================================================================
```

# `1. WHAT WE CAN BUILD (PRODUCT MAP)` 

```
======================================================================
```

```
Sidebar: Admin > Market Terminal > MTF Analytics
```

`1. MTF Overview        total book, NSE/BSE split, growth, fresh vs liquidated, net flow, breadth, book composition (F&O/non-F&O/ETF) 2. MTF Stock Screener  ~3,489 stocks: book, mcap, free-float mcap, leverage %,` 

- `30d change, class, filters + sort + CSV export 3. Stock MTF Detail    per-stock latest MTF stats, leverage vs free float,` 

   - `surveillance flags, promoter pledge trend` 

- `(per-stock book HISTORY only from our own stored daily snapshots - see section 6) 4. Broker Analytics    ranking by disclosed MTF book, share, history, records CAVEAT (must be shown in UI + methodology): NSE stopped per-member disclosure in 2021, so "share" means share of the book that still reports, not of the whole market. 5. Broker Funding      CP outstanding, maturity wall, borrowing cost vs repo, mutual-fund holders by ISIN (monthly + mid-month), per-AMC allocation Wording rule: "disclosed funding relationships", never "fund X financed stock Y". 6. MTF Events          flushes, book milestones/ATH, surveillance entries, pledge+MTF build-up, broker records 7. Market Activity     daily traded value (cash+F&O) vs MTF book; later: bhavcopy, NSE PR archive, MCX bhavcopy 8. Reports (NEW)       period reports (week / month / quarter / year): average book, sequential + YoY growth, ADTO, flow/breadth roll-ups, top-funded stocks, biggest movers; and a per-day page (headline book, top-funded, concentration, movers, flow, breadth) 9. Free Float (NEW UI) MTF book vs free float (monthly demat series + daily market-cap history) 10. Data & Methodology  units, as-of dates, sources, coverage, fund-house coverage matrix, attribution, licence` 

```
======================================================================
```

```
2. DATA SOURCES -> TABLES
```

```
======================================================================
Primary ingestion = bulk exports (gzipped CSV, one file per dataset, all crore,
SHA-256 + row counts in /exports/index.json). Use the manifest to skip
unchanged files. For the INITIAL backfill the all-datasets zip at /exports/
(~593 KB) can be used in one request.
Datasets with no bulk export are ingested from their own JSON/CSV path (column
"Source" below). Exact dataset ids / filenames come from the manifest - read
it first (section 13).
```

```
A) Bulk exports (unit = crore already)
Dataset                     Table                    Natural key
--------------------------  -----------------------
----------------------------
Daily MTF totals            mtf_daily_total          (trade_date, exchange)
  4,177 rows, 2017-06-22 -> 2026-10-26
Leverage flow (daily)       mtf_daily_flow           (trade_date)
  2,217 rows, 2017-06-22 -> 2026-10-26
Margin flush events         mtf_flush_event          (event_date)
  25 rows, 2024-05-21 -> 2026-05-06 (severity + context label columns)
Daily traded value          mtf_traded_value         (trade_date)
  2,307 rows, 2017-06-22 -> 2026-10-27 (cash + F&O notional; check whether
  columns are per exchange/segment from the manifest before fixing the schema)
Per-broker MTF book         mtf_broker_book          (broker_id, as_of, basis,
  17,394 rows, 2017-02-01 -> 2026-09-30                         source_type)
  basis = net is tagged. Points come from exchange disclosures, results, annual
  reports and credit ratings, so source_type MUST be in the key; also store
  source_ref (the primary source for each figure).
Stock universe (snapshot)   mtf_stock_snapshot       (snapshot_date, isin,
exchange)
  3,489 rows. Use a per-row as-of date if the file has one (the stated range
  2017-07-05 -> 2026-10-26 suggests stale rows exist); otherwise file as-of.
Surveillance flags (snap)   mtf_surveillance_flag    (snapshot_date, isin)
  1,683 rows, as-of 2026-10-27. ASM/GSM/ESM/IBC/ban flags + severity + curated
  risk triggers (flags as boolean columns or a JSONB array; decide from
manifest).
Promoter pledge history     mtf_promoter_pledge      (isin, period)
  5,326 rows, 2025-01 -> 2026-10. Described as quarterly but the range reads
```

```
  like months: store as `period` (text or date), not a hard-coded quarter.
```

|`B) Not in the bulk exports`<br>`Dataset`<br>`--------------------------`|`(ingest from their own JSO`<br>`Source`<br>`------------------------`|`N/CSV path)`<br>`Table / note`<br>|
|---|---|---|
|`---------------------------`<br>`Daily breadth`<br>`(tradedate)`|`-`<br>`/mtf_daily_breadth.json`|`mtf_daily_breadth`|
|`_`<br> <br>`Book composition`<br> <br> <br>|`(CSV also offered)`<br>`/mtf_aum_by_class.json`<br> <br>|`unit: lakh`<br>`mtf_book_composition`<br>`(trade_date, asset_class)`<br>`F&O / non-F&O / ETF,`|
|`point-in-time`<br>|||
|<br>`Free float & demat`<br>`monthly, 2015 ->`<br>`+`|<br>`/demat_holdings.json`<br>`(CDSL + NSDL BO aggr.)`|`F&O membership. unit: lakh`<br>`mtf_demat_holding`<br>`(month, investor_category)`|
|<br>`total`<br> <br>`free`<br> <br>`Market cap history (NEW)`<br> <br>|<br> <br> <br>`/market_cap_history.json`<br> <br>|`derived series columns:`<br>`equity, promoter proxy,`<br>`float (cr), free float %.`<br>`mtf_market_cap_history`<br>`(trade_date): total mcap +`<br>`free-float mcap, daily`|
|`Broker CP (F-TRAC)`<br> <br>`summed`|`/broker_cp.json`<br>|`mtf_broker_cp (cp_isin)`<br>`reopenings are already`|
|||`in source. Columns:`|
|`broker_id,`<br> <br> <br>|<br> <br>|`issue_date, maturity_date,`<br>`tenor_days, amount_cr,`<br>`couponpct islive`|
|<br>`Broker CP derived (NEW)`<br> <br>|<br>`/broker_cp.json`<br>|`_, _.`<br>`mtf_broker_cp_series`<br>`(series_name, as_of,`|
|`brokerid`|||
|`_`<br> <br>`over-`<br> <br>`repo`<br> <br>`Store`<br> <br>|<br> <br> <br> <br>|`nullable): outstanding-`<br>`time, borrowing-cost-vs-`<br>`trend, maturity wall.`<br>`the source series; exact`<br>`outstanding history cannot`|
|<br>`be`<br> <br>|<br>|<br>`rebuilt from summed`|
|`reopenings.`<br>`CP funding chain monthly`<br> <br>`ii`|`/cp_holders.json`<br>|`mtf_cp_holder`<br>`(cadence='M', as_of,`|
|`cp_sn,`<br>||`amc scheme)`|
|<br>`CP funding chain mid-month`<br>`(as-of 15th)`<br>|<br>`path not on the data`<br>`page - find via /api/v1`<br>`or manifest`|`,`<br>`same table, cadence='F'`<br>`(key as above)`|
|<br>`AMC allocation (NEW)`<br> <br>|<br>`in the same holders JSON`<br>`(per-AMC allocation +`|`mtf_amc_allocation`<br>`(cadence, as_of, amc):`|
|`allocation`<br> <br> <br>`dibl`|`house AUM + CP-fund AUM)`<br>|`amount, house_aum_cr,`<br>`cp_fund_aum_cr. NOT`|
|`ervae`<br>||`from mtfcpholder`|
|<br>`Fund-house coverage`<br> <br>`status`|<br>`coverage JSON (path not`<br>`on page; see section 13)`|`__.`<br>`mtf_fund_house_coverage`<br>`(amc, cadence, as_of):`|



|<br>|<br>|`enum, scheme_count,`<br>`holding_count, aum_cr,`|
|---|---|---|
|`reason,`<br> <br>|<br>|`source_url, archive_url.`<br>`status: ingested |`|
|`ingested_`|||
|||`manual | nil_debt |`|
|`equity_only`<br> <br>|<br>|`| no_portfolio | pending |`<br>`not_covered`|
|`Events`|`/api/v1/events`|`mtf_event (event_id /`|
|`hash)`|||
||`(?type&since)`|`types: book_milestone,`|
|`book_ath,`|||
|<br>|<br>|`flush, surveillance,`<br>`pledge_book, broker_ath`|
|`Global margin debt`<br>|`/api/v1/global`<br>|`mtf_global_margin_debt`<br>`(country, as_of). unit:`|
|<br>`lakh`<br>|<br>|<br>`CRORE -> convert x100,000`|
|`to cr.`<br>||`Phase 5; confirm whether`|
|`history`<br>||`exists or latest only.`|
|`Per-day snapshots (NEW)`<br> <br>|`/date/<ISO>.json`<br>`(optional backfill)`<br>|`mtf_daily_top_stock`<br>`(trade_date, rank, isin),`<br>`mtf_daily_mover, and a`|
|||`concentration column set`|
|`on`|||
|||`mtf_daily_summary. Top`|
|`stocks`|||
|||`only - see section 6.`|



- `C) Computed by us (no ingest, no table unless cached) Period reports (week / month / quarter / year): average book, sequential and YoY growth, ADTO (cash + F&O from mtf_traded_value), flow / breadth roll-ups, all computed from the tables above in reports/service.py + calculators.py. Also: book/turnover ratio, leverage vs free float, broker share of disclosed book, concentration (top-N share) from our own stock snapshots.` 

- `D) Phase 5 (large; per-day files, separate backfill + storage review) Bhavcopy   /bhavcopy/<YYYYMMDD>.csv.gz, index /bhavcopy/index.json 34 UDiFF columns + exchange (NSE, BSE, MSE; MSE from ~2025) NSE PR     /pr/<YYYYMMDD>.json.gz, index /pr/index.json - 14 member files with different columns -> store as JSONB per (trade_date, member), or only` 

- `the members we actually use MCX        /mcx/<YYYYMMDD>.csv.gz, index /mcx/index.json - 14 fields; browsercaptured upstream, so it refreshes irregularly (expect lag) Do NOT load these into Supabase Postgres by default (millions of rows). Use object storage (Supabase Storage / Parquet) or an on-demand proxy, or ingest only chosen symbols. Decide after reading each index.json for real coverage.` 

```
Not ingested (outputs of the source site, not data): /feed.xml, /events.xml
(events come from /api/v1/events), badges, /api/v1/summary and /api/v1/brokers
(derived from data we already hold).
```

|`Support tables:`<br>`mtf_broker`|`id, name, slug`|
|---|---|
|`mtf_ingest_run`<br> <br>`mtf_dataset_state`|`id, dataset, started_at, finished_at, status,`<br>`rows_upserted, source_sha256, error`<br>`dataset, last_sha256, last_etag, last_as_of`|
||`(as-of is tracked PER dataset: traded value and`|
||`surveillance can be 1 day ahead of the MTF book)`|



```
Column conventions (all tables):
```

- `money columns: NUMERIC(20,4), suffix _cr` 

- `dates: DATE (trade_date / snapshot_date / as_of)` 

- `created_at, updated_at (TIMESTAMPTZ) from a shared mixin` 

- `indexes on every natural key + (trade_date DESC) for time series` 

- `schema = mtf (see decision 8)` 

```
Key table sketches
  mtf_daily_total:   trade_date, exchange(NSE|BSE), outstanding_cr, fresh_cr,
                     liquidated_cr, securities_count
  mtf_stock_snapshot: snapshot_date, symbol, isin, exchange, book_cr, mcap_cr,
                     free_float_mcap_cr, leverage_pct, change_30d_pct,
                     asset_class(FNO|NON_FNO|ETF)
                     -> we KEEP every daily snapshot. This is how we get
                     per-stock history that the source does not guarantee.
                     Storage control: see section 14 (size).
  mtf_broker_cp:     cp_isin, broker_id, issue_date, maturity_date, tenor_days,
                     amount_cr, coupon_pct, is_live
  mtf_cp_holder:     cadence, as_of, broker_id, cp_isin, amc, scheme, amount_cr
                     UNIQUE (cadence, as_of, cp_isin, amc, scheme)
  mtf_amc_allocation: cadence, as_of, amc, allocation_cr, house_aum_cr,
                     cp_fund_aum_cr
```

```
======================================================================
```

```
3. BACKEND STRUCTURE
```

```
======================================================================
app/
  core/
    config.py                 + MTF_* settings (base URL, cron hour, timeouts,
                              DB schema name, source user-agent)
  db/
    postgres.py               (existing) async engine + session + Base
                              (see section 14 for Supabase connection rules)
    migrations/               Alembic (env.py imports
app.features.mtf.models_registry)
  features/
    mtf/
      __init__.py
      access.py               mtf_access = require_admin   (the ONE line to
change)
      router.py               aggregates all sub-routers under /mtf
      models_registry.py      imports every sub-feature models.py (for Alembic)
      shared/                 ---- NO business logic, only reusable plumbing
----
        base_model.py         TimestampMixin, naming convention, schema="mtf"
        base_repository.py    Generic BaseRepository[T]: get, list, paginate,
                              bulk_upsert (ON CONFLICT DO UPDATE), latest_date
        base_service.py       thin helpers (as_of resolution, pagination meta)
        schemas.py            Page[T], AsOf, DateRange, Money
        units.py              cr<->lakh<->lakh_cr helpers (boundary only)
        dependencies.py       get_session, date_range_params, pagination_params
        exceptions.py         DataNotAvailable -> 404 mapping
      ingestion/              ---- ETL: source -> parse -> upsert ----
        client.py             MtfSourceClient (httpx, ETag/If-None-Match,
retries,
                              gz handling, polite UA, 1 req at a time)
        manifest.py           reads /exports/index.json, decides what changed
        base.py               class DatasetIngestor(ABC): fetch(), parse(),
load()
        registry.py           DATASETS = [DatasetSpec(...)]  one entry per
dataset
```

```
        specs/                one tiny file per dataset. Each DatasetSpec
declares:
                              source_url, format, source_unit, column map,
parser,
                              natural key, target repository, snapshot (bool).
                              No copy-paste: all share the same Ingestor +
                              BaseRepository.bulk_upsert
        runner.py             run_all(), run_one(name); writes mtf_ingest_run
        scheduler.py          APScheduler job, daily (see section 5)
        cli.py                python -m app.features.mtf.ingestion.cli --dataset
X
        router.py             admin: GET runs, POST /ingest/{dataset} (manual)
      overview/               totals, flow, breadth, composition, traded value
        models.py  repository.py  service.py  schemas.py  router.py
      stocks/                 screener + stock detail + snapshot history
        models.py  repository.py  service.py  schemas.py  router.py
        filters.py            declarative filter->SQL mapping (no if-chains)
      brokers/                broker book ranking + history
        models.py  repository.py  service.py  schemas.py  router.py
      funding/                broker CP, maturity wall, cost vs repo, holders,
                              AMC allocation
        models.py  repository.py  service.py  schemas.py  router.py
        calculators.py        maturity wall, spread vs repo (pure functions;
                              repo/cost series come from mtf_broker_cp_series)
      events/                 flushes, milestones, surveillance, pledge events
        models.py  repository.py  service.py  schemas.py  router.py
      risk/                   surveillance flags + promoter pledge
        models.py  repository.py  service.py  schemas.py  router.py
      freefloat/              demat holdings + market-cap history +
                              MTF-vs-free-float series
        models.py  repository.py  service.py  schemas.py  router.py
      reports/ (NEW)          period reports + per-day page
        repository.py  service.py  schemas.py  router.py
        calculators.py        average book, sequential/YoY growth, ADTO,
                              roll-ups, concentration (pure functions)
        models.py             only if per-day snapshots (top stocks/movers) are
                              backfilled from /date/*.json
      market_activity/        (Phase 5) bhavcopy, PR, MCX
      methodology/            coverage matrix, units, sources, attribution
        models.py  repository.py  service.py  schemas.py  router.py
```

# `Rules (SOLID without bloat)` 

- `S  Router: HTTP only. Service: rules/aggregation. Repository: SQL only. Calculators: pure functions, no DB.` 

- `O  New dataset = new spec file + registry line. No edits to runner/client. L  Every repository extends BaseRepository and honours its contract.` 

- `I  Services depend on small repository methods they use, not on the world. D  Routers get services via Depends(); services receive repositories via constructor; tests inject fakes.` 

- `DRY: one Ingestor, one bulk_upsert, one Page[T], one date-range dependency, one units module. Sub-features never import each other's models; if two need the same thing it goes in shared/ or is composed in a service via the other's public service interface.` 

```
  File size target: router <80 lines, repository <120, service <150.
  Independence: each sub-feature can be deleted without breaking others
  (only mtf/router.py include line + models_registry import).
```

# `Access control (mtf/access.py)` 

```
  from app.features.auth.dependencies import require_admin
  mtf_access = require_admin     # later: require_authenticated
  Every mtf sub-router uses Depends(mtf_access) via the aggregate router, so
  the change is one line, same as terminal_access.
```

```
======================================================================
4. API SURFACE (all under /api/mtf, JSON, paginated where lists)
======================================================================
overview
```

|`GET`|`/overview/summary`|`latest book NSE/BSE/combined + day change`|
|---|---|---|
|`GET`<br>`GET`|`/overview/totals?from&to&exchang`<br>`/overview/flow?from&to`|`e`|
|`GET`<br>|`/overview/breadth?from&to`<br>||
|`GET`|`/overview/composition?from&to`||
|`GET`|`/overview/traded-value?from&to`|`(+ book/turnover ratio computed)`|
|`stocks`|||
|`GET`<br> <br>|`/stocks`<br> <br>|`screener: q, exchange, class, min/max`<br>`book, leverage, mcap, change_30d, sort,`<br>|
|||`page, size`|
|`GET`|`/stocks/export.csv`|`same filters (licence: see decision 7)`|
|`GET`|`/stocks/{isin}`|`latest snapshot + flags + pledge`|
|`GET`|`/stocks/{isin}/history?from&to`|`from our stored daily snapshots`|
|`broker`|`s`||
|`GET`<br> <br> <br>|`/brokers`<br> <br> <br>|`ranking + share of disclosed book`<br>`(response carries the 2021 disclosure`<br>`caveat text)`|
|`GET`|`/brokers/{slug}/history`||
|<br>`fundin`|<br>`g`||
|`GET`<br>|`/funding/cp/outstanding`<br>|`per-broker outstanding`<br>|
|`GET`|`/funding/cp/outstanding-series`|`outstanding over time (source series)`|
|<br>`GET`<br>|<br>`/funding/cp/maturity-wall`<br>||
|`GET`<br>|`/funding/cp/cost-vs-repo`<br>||
|`GET`<br>`GET`|`/funding/holders?cadence=M|F&bro`<br>`/funding/amc-allocation?cadence`|`ker`|
|`events`|||
|`GET`<br>|`/events?type&since&page`<br>|`types: book_milestone, book_ath, flush,`<br>|
|||`surveillance, pledgebook, brokerath`|
|<br>`risk`||`_ _`|
|`GET`<br>`GET`|`/risk/surveillance?flag&severity`<br>`/risk/pledge/{isin}`||
|<br>`freefl`|<br>`oat`||
|`GET`<br>`GET`|`/freefloat/series`<br>`/freefloat/market-cap?from&to`|`total, promoter proxy, free float, %`<br>`daily total + free-float market cap`|
|<br>`report`|<br>`s (NEW)`||
|<br>`GET`<br>|<br>`/reports/{period}/{key}`<br>|`period = week|month|quarter|year;`<br>`key = ISO date / YYYY-MM / YYYY-Qn / YYYY`|
|<br>`GET`<br> <br>|<br>`/reports/date/{iso_date}`<br> <br>|<br>`per-day page: headline book, top-funded`<br>`(if stored), concentration, movers, flow,`<br>`breadth`|
|`method`|`ology`||
|`GET`|`/methodology/coverage`|`fund-house matrix (monthly + fortnightly)`|
|<br>`GET`|<br>`/methodology/datasets`|<br>`last_as_of + last ingest status per`|
|<br>`datase`|<br>`t`||
|`ingest`|`ion (admin)`||
|<br>`GET`|<br>`/ingestion/runs`||
|<br>`POST`|<br>`/ingestion/run/{dataset}`||
|`Every`|`response carries as_of and sourc`|`e fields so the UI can always show`|
|`"Data`|`as of ... | Source: NSE/BSE via`|`mtf.trading". as_of is per dataset, not`|
|<br>`global`|<br>`(traded value / surveillance ma`|<br>`y be 1 day ahead of the MTF book).`|



```
======================================================================
```

# `5. DAILY CRON (SNAPSHOT UPDATE)` 

```
======================================================================
```

```
Scheduler: APScheduler AsyncIOScheduler (news feature already has a scheduler
pattern - reuse the same start/stop hook in main.py lifespan).
Schedule: once daily, 20:30 IST (exchange files and source refresh happen after
close). Configurable: MTF_CRON_HOUR / MTF_CRON_MINUTE.
```

```
Job flow:
```

`0. acquire pg_try_advisory_xact_lock(<mtf key>) INSIDE the job transaction (transaction-scoped; works through the Supabase transaction pooler). If not acquired -> exit quietly (another worker is running).` 

`1. fetch /exports/index.json (manifest)` 

`2. for each dataset: if sha256 == mtf_dataset_state.last_sha256 -> skip` 

- `(datasets without a manifest entry: use ETag / content hash instead)` 

`3. else download (ETag conditional), apply source_unit conversion, parse, validate row counts / required columns against the manifest` 

`4. bulk upsert in one transaction per dataset (ON CONFLICT DO UPDATE)` 

- `-> idempotent` 

`5. snapshot datasets (stock universe, surveillance, CP holders, AMC allocation, fund-house coverage): insert with as_of = the file's as-of date (never overwrite old days => builds history)` 

`6. write mtf_ingest_run (status, rows, sha, error) and update mtf_dataset_state.last_as_of` 

```
  7. events feed: pull /api/v1/events?since=<last seen> and upsert
  Failure of one dataset does not stop the others; failures are logged and
  visible at GET /ingestion/runs. Retry 3x with backoff.
Also: manual trigger via CLI and POST /ingestion/run/{dataset}.
Initial backfill: one-time run from the all-datasets zip, then the daily job.
Politeness: one run per day, sequential requests, identify with a UA string
and contact; do not hammer their endpoints (the docs say "no rate limit";
we still stay at one daily run). Long-term, plan to source primary NSE/BSE
files ourselves so we do not depend on a third party.
```

```
======================================================================
6. PER-STOCK / PER-DAY HISTORY NOTE
```

```
======================================================================
Docs only promise a LATEST stock snapshot plus dated /date/<ISO>.json pages
(top-funded stocks, concentration, biggest movers - top stocks only). So:
  - Phase 1: store the daily stock snapshot every day from now on.
```

- `Phase 2 (optional): backfill per-day top stocks / movers / concentration by walking /date/*.json - verify coverage first before promising it in the UI. - Holder files (CP funding chain) are "as of the disclosure date": confirm whether a file has one as-of or several. Either way, we keep as_of in the key so our history grows from the first pull.` 

- `UI label "History since <first_snapshot_date>" so we never overclaim.` 

```
======================================================================
```

```
7. ALEMBIC
======================================================================
```

- `alembic init in app/db/migrations; env.py uses the async engine from app/db/postgres.py and target_metadata = Base.metadata after importing app.features.mtf.models_registry.` 

- `Run Alembic over the DIRECT (or session-mode) Supabase connection, never the transaction pooler.` 

- `Create schema mtf in migration 0000 (CREATE SCHEMA IF NOT EXISTS mtf); include_schemas=True + version_table_schema in env.py; enable RLS on each new table in its migration.` 

- `Naming convention set on Base.metadata (ix, uq, fk, pk) so autogenerate is stable.` 

- `One migration per sub-feature (e.g. 0001_mtf_overview, 0002_mtf_stocks...), all tables prefixed mtf_.` 

- `CI check: alembic upgrade head on empty DB + alembic check (no drift).` 

- `Never edit applied migrations; add new ones.` 

```
======================================================================
8. FRONTEND STRUCTURE (follow existing conventions)
======================================================================
app/admin/mtf/
  layout.tsx                  sub-nav (Overview, Stocks, Brokers, Funding,
                              Events, Reports, Data)
  page.tsx                    -> MtfOverviewView
  stocks/page.tsx             -> MtfScreenerView
```

```
  stocks/[isin]/page.tsx      -> MtfStockDetailView
  brokers/page.tsx            -> MtfBrokersView
  funding/page.tsx            -> MtfFundingView
  events/page.tsx             -> MtfEventsView
  reports/page.tsx            -> MtfReportsView  (period + date selector)
  freefloat/page.tsx          -> MtfFreeFloatView (or a section on Overview)
  methodology/page.tsx        -> MtfMethodologyView
```

```
src/views/admin/mtf/          one View per page (composition only)
src/components/mtf/
  overview/   MtfKpiStrip, BookTrendChart, FlowChart, BreadthChart,
              CompositionChart
  stocks/     MtfFilterBuilder, MtfStocksTable, StockMtfCard
  brokers/    BrokerRankTable, BrokerHistoryChart
  funding/    CpOutstandingChart, MaturityWallChart, CostVsRepoChart,
              CpHoldersTable, AmcAllocationChart
  events/     EventFeed, EventTypeFilter
  reports/    PeriodReportCard, DayReportCard, MoversTable
  freefloat/  BookVsFreeFloatChart
  shared/     AsOfBadge, SourceAttribution, UnitToggle (cr / lakh cr),
              DateRangePicker, MtfNav
src/hooks/mtf/                useMtfSummary, useMtfTotals, useMtfFlow,
                              useMtfStocks, useMtfStock, useMtfBrokers,
                              useCpOutstanding, useMtfEvents, useMtfReport ...
                              (one fetch each)
src/lib/api/mtf/              endpoints.ts + one *.api.ts per sub-feature
                              (uses existing src/api/axios.ts)
src/types/mtf/                one types file per sub-feature + index.ts
src/utils/mtf/                formatters.ts (Rs cr / lakh cr, %, dates),
                              chart-helpers.ts
src/mocks/mtf/                optional mock data to build UI before API is ready
Reuse: existing chart components (market-terminal / stockdashboard), existing
table + skeleton patterns, AdminGuard, DashboardCard/ui kit. Add MTF-specific
components only when nothing existing fits.
```

# `UX rules` 

- `Always show AsOfBadge + SourceAttribution on every page (as-of per dataset).` 

- `Funding page carries the disclaimer about disclosed relationships.` 

- `Brokers page carries the "share of what still reports (NSE stopped per-member disclosure in 2021)" note.` 

- `Never hard-code fund-house counts (the source page itself shows 34 vs 51 monthly and 42 vs 41 fortnightly); derive them from the coverage data.` 

- `Skeleton loaders (existing Skeletons pattern); lazy-load below-fold charts (existing LazyViewport).` 

- `Screener: server-side filter/sort/pagination (3.5k rows is fine, but keep API-driven so it scales).` 

- `Footer: "not investment advice", attribution, licence line.` 

```
======================================================================
```

# `9. DELIVERY PHASES` 

```
======================================================================
Phase 0 (1-2 d)  Alembic setup (mtf schema, RLS), mtf/shared, ingestion core
                 (client, manifest, base ingestor, runner, scheduler,
                 ingest_run tables), read manifest and confirm columns
Phase 1 (3-4 d)  overview + stocks (daily totals, flow, breadth, composition,
                 stock snapshot) -> backend + frontend Overview & Screener
Phase 2 (2-3 d)  brokers + events + risk (surveillance, pledge) + Stock Detail
Phase 3 (3-4 d)  funding (CP, derived series, maturity wall, cost vs repo,
                 holders, AMC allocation) + freefloat (demat + market-cap
                 history)
Phase 4 (3 d)    reports (period + per-day), methodology/coverage page, traded
                 value, polish, CSV exports (after licence review)
Phase 5 (later)  bhavcopy / PR archive / MCX (object storage or selective
                 ingest), global margin debt, /date/*.json backfill, own
```

```
                 NSE-BSE sources, open to all users (flip mtf_access)
```

```
======================================================================
10. TESTING
```

- `======================================================================` 

- `Unit: calculators (maturity wall, spread vs repo, period reports), filters.py, units.py (cr / lakh / lakh_cr), parsers per dataset using small fixture` 

```
CSVs.
```

- `Repository tests against a throwaway Postgres (pytest + testcontainers or a CI service) - verifies upserts are idempotent and natural keys do not collide (esp. broker_book, cp_holder).` 

- `Service tests with fake repositories.` 

- `Router tests: auth (non-admin -> 403), pagination, as_of present.` 

- `Ingestion test: run twice on same fixture -> row counts unchanged.` 

- `Unit-conversion test per spec: a known lakh value lands as the right crore. - Frontend: formatters unit tests, one render test per View with mocks.` 

# `====================================================================== 11. RISKS / OPEN POINTS` 

# `======================================================================` 

- `Third-party dependency: the source site may change/format break. Mitigation: manifest + sha checks, parser validation, alerts on failed runs, plan own NSE/BSE ingestion later.` 

- `Licence: CC BY-SA 4.0 ShareAlike on redistributed derivatives (decision 7). Review before opening to all users or offering exports/API.` 

- `Wording/legal: attribute the data, do not copy their UI/code, funding` 

- `chain stated as disclosures only; "not investment advice" footer.` 

- `Per-stock history limited to what we store (section 6).` 

- `Storage on Supabase (section 14): daily stock snapshots grow ~0.9M rows per year; monitor DB size after the first weeks.` 

- `Bhavcopy/PR/MCX are large; separate backfill job and storage decision before enabling.` 

- `Dates in the source extend to Oct 2026 and differ per dataset (book 26 Oct; traded value + surveillance 27 Oct) - confirm the first live pull matches the published as-of dates before building charts on it. - Source text inconsistencies (fund-house counts, pledge "quarterly" vs monthly-looking range) - rely on the data, not the prose.` 

# `====================================================================== 12. FIRST CONCRETE STEPS` 

```
======================================================================
```

`1. Fetch /exports/index.json and /api/v1; record dataset ids, columns, units and row counts (section 13 checklist). 2. Create app/features/mtf/{shared,ingestion,overview,stocks} skeleton. 3. Add Alembic + migration 0000 (schema mtf) + first migration` 

- `(mtf_daily_total, mtf_daily_flow, mtf_stock_snapshot, mtf_ingest_run, mtf_dataset_state). 4. Implement client + manifest + base ingestor + first two specs. 5. Run ingestion manually via CLI, verify row counts against manifest. 6. Build overview + stocks endpoints, then the frontend views. 7. Enable the scheduler last.` 

```
======================================================================
13. VERIFICATION CHECKLIST (do on the first real pull)
```

# `======================================================================` 

- `[ ] Manifest: dataset ids, filenames, column lists, units, SHA-256, row counts match section 2 (4,177 / 2,217 / 25 / 2,307 / 17,394 / 3,489 / 1,683 / 5,326).` 

- `[ ] Daily traded value: per-exchange / per-segment columns? Notional vs premium definition for F&O (affects book/turnover ratio wording). [ ] Stock universe: does each row carry its own as-of date (range starts 2017-07-05)? If yes, use it; decide how to treat stale rows. [ ] Broker book: is (broker_id, as_of, basis, source_type) unique? Which` 

```
      column holds the primary-source reference?
```

- `[ ] Promoter pledge: period format (quarter vs month).` 

- `[ ] Surveillance: how are multiple flags per ISIN represented?` 

- `[ ] Breadth / composition / flow legacy JSON units (expect lakh).` 

- `[ ] Mid-month CP holders path and coverage JSON path (not named on the page).` 

- `[ ] Holders / AMC allocation: single as-of or several in one file?` 

- `[ ] broker_cp.json: names and shape of the derived series (repo trend, outstanding-over-time, maturity wall).` 

- `[ ] Global margin debt: history or latest only.` 

- `[ ] Their methodology page: definitions of leverage %, flush detection, promoter proxy, point-in-time F&O membership (needed before we re-implement any of these ourselves).` 

- `[ ] bhavcopy / pr / mcx index.json: real coverage windows and sizes.` 

```
======================================================================
14. SUPABASE POSTGRES NOTES
```

- `====================================================================== Connections` 

- `App runtime: async engine (asyncpg). If it uses the transaction pooler (port 6543), set statement_cache_size=0 (and no server-side prepared statements). Direct / session connections do not need this. - Alembic + CLI backfills: direct or session-mode connection.` 

- `Advisory lock: use pg_try_advisory_xact_lock inside the job transaction. Session-level advisory locks are unreliable through the transaction pooler. Security` 

- `Tables in schema mtf, RLS enabled with no policies; do not expose the schema in the Supabase API settings. The FastAPI backend connects with a server role; no MTF data is reachable with the anon key.` 

- `Size` 

- `Stock snapshot ~3,489 rows x ~250 trading days = ~0.9M rows/year; with indexes expect a few hundred MB per year (rough estimate - measure after the first weeks). The free tier is 500 MB; plan upgrade or reduce: * store only rows with book_cr > 0, or only when values changed` 

- `keep full history for the top N stocks and monthly for the rest - Everything else in the plan (daily totals, flow, brokers, CP, holders, pledge, demat) is small.` 

- `Bhavcopy / PR / MCX: keep out of Postgres by default (section 2D). Portability` 

- `No Supabase-specific SQL in models/migrations apart from RLS statements and the schema name (both configurable), so the move to another SQL host stays a connection-string change.` 

