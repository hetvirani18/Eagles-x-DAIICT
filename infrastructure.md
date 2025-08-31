# H₂-Optimize Infrastructure & Onboarding Guide

This guide explains the end-to-end architecture, components, APIs, data models, environments, and how to run and contribute. It’s the fastest way to onboard to the Green Hydrogen Infrastructure Mapping & Optimization stack.

## Architecture overview

```mermaid
flowchart LR
  subgraph Frontend [React 19 App]
    UI[Map, Search, Analysis Panels]
    Hooks[useApiData/useApiDataReact19]
    APIClient[Axios client (/api)]
  end

  subgraph Backend [FastAPI]
    RouterCore[/api/* endpoints/]
    RouterAdv[/api/v1/advanced/*/]
    Services[Algorithm & Financial Services]
  end

  DB[(MongoDB)]

  UI --> Hooks --> APIClient --> RouterCore
  APIClient --> RouterAdv
  RouterCore --> Services
  RouterAdv --> Services
  Services <---> DB
```

## Tech stack and versions

- Frontend: React 19, react-leaflet 5, TailwindCSS, Axios, CRACO
- Backend: FastAPI (lifespan), Pydantic v2, Motor (async MongoDB), Uvicorn
- Database: MongoDB; seeded with realistic Gujarat datasets on first run

## Key components

- Frontend (folder: `frontend`)
  - Mapping UI: `src/components/MapComponent.jsx`, `MainMapPage.jsx`
  - Search: `SearchComponent.jsx` (+ React19 variant)
  - Data loading: `hooks/useApiData.js` and `useApiDataReact19.js`
  - API client: `src/services/api.js` (baseURL = `${REACT_APP_BACKEND_URL}/api`)

- Backend (folder: `backend`)
  - App: `server.py` (FastAPI app, lifespan DB connect/seed, /api router, includes advanced router)
  - Advanced routes: `advanced_analysis_routes.py` under `/api/v1/advanced`
  - Models: `models.py` (Pydantic v2 schemas & enums)
  - DB: `database.py` (Motor client, indexes, env-driven connection)
  - Services: `services/algorithm.py`, `dynamic_production_calculator.py`, `advanced_financial_modeling.py`, `investor_economics.py`
  - Seed data: `data/real_gujarat_data.py`, populated via `data/populate_data.py`

## Data models (high level)

- Core geo model: `LocationPoint { latitude, longitude }`
- Entities:
  - EnergySource (Solar/Wind/Hybrid, capacity_mw, cost_per_kwh, …)
  - DemandCenter (IndustryType, hydrogen_demand_mt_year, willingness_to_pay, …)
  - WaterSource/WaterBody (capacity/quality, availability, …)
  - GasPipeline/RoadNetwork (route points, capacities/scores)
  - Pipeline/StorageFacility/DistributionHub (hydrogen infra)
  - City (for search/autocomplete)
  - OptimalLocation (analysis result with factor scores and nearest assets)

## API contracts (selected)

- Base prefix: `/api`
  - GET `/energy-sources`, `/demand-centers`, `/water-sources`, `/water-bodies`
  - GET `/gas-pipelines`, `/road-networks`, `/cities?q=`
  - New infra: GET `/pipelines`, `/storage-facilities`, `/distribution-hubs`
  - POST `/analyze-location` body: `LocationPoint`, optional weights
  - POST `/calculate-optimal-locations` body: `SearchBounds`, optional weights
  - GET `/optimal-locations` computed grid-based results

- Advanced prefix: `/api/v1/advanced`
  - POST `/comprehensive-analysis`, `/compare-locations`, `/optimize-capacity`, `/generate-investor-report`
  - POST `/financial-modeling`
  - GET `/market-intelligence`, `/investment-alerts`, `/dashboard-metrics`, `/health`
  - Note: Some advanced modules use safe placeholders to avoid import/runtime failures; they return structured mock data and are ready for future plug-ins.

## Algorithms and scoring

- Distance: Haversine formula (km)
- Factor scores (0–100): Energy (30%), Demand (25%), Water (20%), Pipeline (15%), Transport (10)
- Bonuses for high-capacity/low-cost energy, high-demand/premium WTP, high-quality water, pipeline/road connectivity
- Grid search: Gujarat-wide grid + regional fallback for low results
- Production & economics: dynamic capacity, projected cost/kg, ROI, payback, grade mapping

## Database & seeding

- Connection via environment: `MONGO_URL`, `DB_NAME`
- On startup (lifespan), if `energy_sources` empty -> `populate_comprehensive_data()` seeds all collections
- Indexes: simple indexes on `location.latitude`/`location.longitude` for common entities

## Environments and configuration

Create `.env` files using the provided examples.

Backend (`backend/.env`):

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=h2_optimize
```

Frontend (`frontend/.env`):

```env
REACT_APP_BACKEND_URL=http://localhost:8080
WDS_SOCKET_PORT=0
```

## Run locally

1) Start MongoDB (local or container)

1) Backend

- Python 3.11+ recommended
- In `backend/`: create venv, install `requirements.txt`, run `uvicorn server:app --host 0.0.0.0 --port 8080 --reload`
- On first run, DB will seed itself automatically

1) Frontend

- Node 18+
- In `frontend/`: `npm install`, then `npm start` (CRACO dev server, <http://localhost:3000>)

## Frontend map features

- Marker layers: energy, demand, water sources/bodies, optimal locations
- Coverage rings: visible around selected optimal location; radii computed from nearby resources
- Legend and analysis panel for selected optimal location

## Quality gates

- Backend: run your preferred formatter/linter/tests (black/isort/flake8/mypy/pytest if configured)
- Frontend: CRA/CRACO scripts; ESLint config present

## Known notes

- Advanced endpoints include placeholder implementations for market intelligence, risk, and ESG modules to keep APIs online; replace with real services when available.
- Ensure environment variable names match the backend code: `MONGO_URL` and `DB_NAME`.

## Contributing

- Keep public APIs stable; prefer adding new endpoints vs breaking existing ones
- Add/update tests when changing algorithm scoring or financial modeling
- Document new models/fields here and in `README.md`
