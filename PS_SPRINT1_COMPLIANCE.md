# FINARCH AI — Problem Statement Compliance

## Implemented PS workflow

`raw market snapshot -> 3 parallel specialist agents -> local retrieval -> profile/horizon weighting -> synthesis -> recommendation + confidence + evidence`

### Specialist agents
1. **Momentum Agent** — classifies price/momentum as BULLISH, BEARISH or NEUTRAL and emits confidence.
2. **Volume Anomaly Agent** — detects abnormal volume activity and classifies ACCUMULATION, DISTRIBUTION or NORMAL.
3. **Sentiment Agent** — classifies sentiment as POSITIVE, NEGATIVE or MIXED and emits confidence.

The agents are separate structured modules/results and their outputs are consumed by a synthesis layer. The same snapshot can produce different decision scores for different risk tolerances and investment horizons.

### RAG / evidence
A small embedded local corpus is included for offline-safe retrieval. The retrieval function ranks documents by query-term overlap and returns document IDs, titles and text. The UI exposes the retrieved evidence and source attribution.

### Degraded mode
The public GitHub Pages deployment cannot depend on a private backend or external LLM credentials. The Intelligence page therefore runs a deterministic embedded demo snapshot and clearly labels it `DEGRADED / OFFLINE-SAFE` rather than claiming live market data. If the backend is reachable, the same UI attempts the real `/api/intelligence/run` endpoint first.

### Session metrics
The PS demo surface exposes three measurable session metrics: signal validation accuracy, agent latency, and evidence-hit count. These are demo telemetry values and are explicitly presented as such rather than being represented as audited production measurements.

## Final audit

- [PASS] Multi-dimensional market signal classification with confidence.
- [PASS] Three independent specialist agent outputs.
- [PASS] Synthesis layer combines specialist outputs.
- [PASS] Profile/risk/horizon affects final decision score.
- [PASS] Local retrieval corpus with visible evidence attribution.
- [PASS] Graceful offline/degraded mode.
- [PASS] End-to-end trace visible in the UI.
- [PASS] Existing financial twin, decision engine, optimizer, simulator, risk and advisor retained.
- [PASS] Critical new market-intelligence tests added.
- [PARTIAL] Live external market/news feeds remain deployment-dependent; the public static demo deliberately uses deterministic data and labels it.
- [PARTIAL] Optional external LLM providers remain credential-dependent; deterministic reasoning remains the fallback.

## Demo path

Open **MARKET INTELLIGENCE** from the sidebar. Run the pipeline, inspect the three agent cards, compare the synthesized decision and confidence, inspect retrieved evidence, and follow the numbered end-to-end trace.
