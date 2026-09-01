# FINARCH AI
### *Autonomous Financial Intelligence for Retail Investors*

FINARCH AI is a decision-support prototype that combines a financial digital twin, portfolio/risk analysis, simulation, a deterministic explainable advisor, and a Problem-Statement-focused market intelligence pipeline.

## Hackathon PS-01 implementation

The Sprint 1 workflow is implemented as:

```text
Raw market snapshot
  -> parallel Momentum / Volume / Sentiment agents
  -> structured agent outputs + confidence
  -> local retrieval over financial/risk corpus
  -> user risk + horizon weighting
  -> synthesis recommendation
  -> evidence attribution + full reasoning trace
```

### PS requirement mapping

| Problem Statement requirement | FINARCH implementation | Status |
|---|---|---|
| Signal classification across at least 3 dimensions | Momentum, volume anomaly and sentiment agents | PASS |
| Confidence level + cited reasoning | Per-agent confidence and evidence IDs | PASS |
| RAG over document corpus | Embedded local corpus + ranked retrieval | PASS |
| Visible source attribution | Evidence cards with source IDs/text | PASS |
| 3+ specialized agents in parallel | Python `ThreadPoolExecutor` dispatch | PASS |
| Structured outputs consumed by synthesis | `AgentResult` dataclass -> synthesis layer | PASS |
| Personalized behavior | Risk tolerance + investment horizon alter synthesis score | PASS |
| Live interface | Existing dashboard plus `MARKET INTELLIGENCE` page | PASS |
| Portfolio/watchlist state | Existing Financial Twin / Portfolio / Goals surfaces | PASS |
| 3 measurable session metrics | Accuracy, agent latency and evidence hits on demo surface | PASS* |
| End-to-end demo | Raw input -> agents -> RAG -> profile weighting -> synthesis | PASS |
| Graceful degraded scenario | Explicit offline-safe deterministic fallback | PASS |
| Architecture summary | This README + `PS_SPRINT1_COMPLIANCE.md` | PASS |

`*` Demo telemetry values are presented as prototype measurements, not audited production statistics.

## Existing capabilities retained

- Financial Digital Twin and balance-sheet calculations
- Financial health score
- Next-rupee decision engine
- Multi-objective opportunity optimizer
- Portfolio/risk analysis
- Goals tracker
- What-if simulator
- Monte Carlo simulator
- Explainable AI advisor
- SQLite persistence and FastAPI backend
- Offline-safe client-side fallback

## Market Intelligence demo

Open **MARKET INTELLIGENCE** from the left navigation. The public GitHub Pages deployment uses an embedded deterministic market snapshot so the demo remains functional without API keys or a hosted backend.

The demo intentionally shows a `DEGRADED / OFFLINE-SAFE` state when external services are unavailable. It does not represent the embedded snapshot as live market data.

For a full-stack deployment, run the backend and the frontend together. The frontend attempts `/api/intelligence/run` first and falls back to the same deterministic client-side workflow when the API is unavailable.

## Local setup

### Full stack

```bash
git clone https://github.com/charvi3510/FinArch2.git
cd FinArch2/backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

### Frontend-only / GitHub Pages

```bash
cd frontend
npm install
npm run dev
```

The client engine keeps the core demo working without the backend.

## Important deployment limitation

GitHub Pages hosts the static frontend. It cannot securely host the FastAPI service or private LLM credentials. Therefore the public Pages demo uses deterministic embedded data and clearly labels it as such. A hosted backend can provide live/near-live feeds through `/api/intelligence/run`.

## Testing

Backend:

```bash
cd backend
python -m pytest tests
```

Frontend:

```bash
cd frontend
npm run build
npm run lint
```

## Safety

FINARCH AI is a financial decision-support prototype for educational and demonstration purposes. It is not financial, tax, legal or investment advice. Market returns and simulated outcomes are uncertain and are not guarantees.
