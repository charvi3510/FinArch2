# HACKVERSE Sprint 1 — PS-01 Compliance Audit

## Implemented workflow

`raw market snapshot -> 3 parallel specialist agents -> local retrieval -> evidence grounding -> profile/horizon weighting -> synthesis -> recommendation`

The public demo is intentionally deterministic/offline-safe because GitHub Pages cannot host the FastAPI backend. When a backend is configured, the same UI calls `/api/intelligence/run` first and falls back safely if unavailable.

## Specialist agents

1. **Momentum Agent** — classifies price/momentum as BULLISH, BEARISH or NEUTRAL and emits confidence, rationale and evidence IDs.
2. **Volume Anomaly Agent** — classifies abnormal volume as ACCUMULATION, DISTRIBUTION or NORMAL and emits confidence, rationale and evidence IDs.
3. **Sentiment Agent** — classifies sentiment as POSITIVE, NEGATIVE or MIXED and emits confidence, rationale and evidence IDs.

The backend dispatches the three specialists concurrently with `ThreadPoolExecutor`. Their structured `AgentResult` records are consumed by a synthesis layer.

## Retrieval / RAG

An embedded local corpus contains regulatory, financial and suitability references. The retrieval layer ranks contextually relevant documents for the market/suitability query and returns stable document IDs, titles and text. Each specialist output includes `evidence_ids`; the UI renders the corresponding retrieved source material so grounding is traceable from agent to evidence.

## Personalization

The stored financial profile supplies risk tolerance and investment horizon to the synthesis layer. The automated backend test uses identical market inputs for conservative and aggressive profiles and verifies that their decision scores differ. The UI also renders the stored portfolio state and its largest-bucket concentration.

## Session performance logging

Each completed Intelligence run is persisted in browser `localStorage` under `finarch_intelligence_sessions`. A session record contains:

- signal accuracy against the supplied forward-return observation;
- measured end-to-end agent-pipeline latency;
- portfolio concentration score;
- recommendation and timestamp;
- all structured agent outputs;
- user decision (`accepted`, `rejected`, or `not recorded`);
- degraded/online mode.

This gives the demo a real per-session persistence mechanism rather than hard-coded dashboard telemetry.

## Degraded-data scenario

The embedded snapshot is explicitly marked degraded and the UI says that it is deterministic demo data. If the backend or external data source is unavailable, the client-side intelligence engine still runs and returns the same cited local evidence. The pipeline therefore continues without producing an uncited result.

## Final audit against PS-01 minimum requirements

- [PASS] Signal classification across at least three independent dimensions: price momentum, volume anomaly and sentiment.
- [PASS] Classified outputs include stated confidence and cited reasoning/evidence IDs.
- [PASS] Retrieval-augmented component queries a local document corpus and grounds agent outputs in retrieved material.
- [PASS] Visible source attribution is rendered in the Intelligence UI.
- [PASS] At least three specialized agents execute in parallel with structured output contracts and a synthesis layer.
- [PASS] User profiling modifies the decision using stored risk tolerance/horizon; identical market input can produce different profile-adjusted outputs.
- [PASS] Live application interface renders market signals/classifications, synthesized output, attribution and current portfolio state.
- [PASS] Session performance logging captures three measurable metrics: signal accuracy, measured latency and portfolio concentration.
- [PASS] Session persistence stores agent outputs and user decisions as well as performance metrics.
- [PASS] End-to-end demo path is visible from raw ingestion through agents, retrieval, evidence grounding, profile weighting and synthesis.
- [PASS] Degraded-data handling is explicit, non-failing and still evidence-grounded.
- [PASS] Architecture and decision logic are documented for judges.

## Truthfulness / deployment note

The public GitHub Pages deployment uses the deterministic embedded snapshot and labels it as such; it does **not** pretend that live NSE/SEBI feeds or an external LLM are available without credentials/backend infrastructure. A backend deployment can use the same `/api/intelligence/run` workflow. Frontend production build and backend pytest execution should be confirmed through CI/local execution because the GitHub connector used for repository editing does not execute shell commands.

## Judge demo

1. Open **MARKET INTELLIGENCE**.
2. Inspect the three raw signals and classification dimensions.
3. Click **RUN INTELLIGENCE**.
4. Inspect each specialist's signal, confidence, rationale and evidence IDs.
5. Inspect retrieved source documents and the synthesis recommendation.
6. Inspect profile effect and current portfolio state/concentration.
7. Accept or reject the recommendation to record a user decision.
8. Run again and inspect the persistent session-performance table.
9. Change risk tolerance/horizon in the existing profile settings and rerun the same snapshot to demonstrate personalization.
