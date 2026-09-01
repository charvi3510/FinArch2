"""PS Sprint 1: deterministic multi-agent market intelligence and local RAG."""
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, asdict
from typing import Any, Dict, List
import re

CORPUS = [
    {"id": "rbi-liquidity", "title": "RBI monetary-policy reference", "text": "Liquidity and emergency reserves should be preserved before taking material market risk. Policy-rate and inflation context can change the opportunity cost of cash."},
    {"id": "sebi-investor-protection", "title": "SEBI investor-protection reference", "text": "Suitability, diversification, risk disclosure and investor protection are central considerations when evaluating market-linked investments."},
    {"id": "finarch-debt", "title": "FINARCH debt-priority rule", "text": "High-interest revolving debt creates a guaranteed savings opportunity. When expensive debt is outstanding, repayment can outrank volatile investments."},
    {"id": "finarch-risk", "title": "FINARCH risk-alignment rule", "text": "Recommended exposure should reflect stated risk tolerance, investment horizon, liquidity needs and existing portfolio concentration."},
]

@dataclass
class AgentResult:
    agent: str
    signal: str
    score: float
    confidence: float
    rationale: str
    evidence_ids: List[str]


def retrieve(query: str, top_k: int = 3) -> List[Dict[str, str]]:
    terms = set(re.findall(r"[a-z0-9]+", query.lower()))
    ranked = []
    for doc in CORPUS:
        words = set(re.findall(r"[a-z0-9]+", (doc["title"] + " " + doc["text"]).lower()))
        ranked.append((len(terms & words), doc))
    ranked.sort(key=lambda x: x[0], reverse=True)
    return [doc for _, doc in ranked[:top_k]]


def _momentum(price: float, ids: List[str]) -> AgentResult:
    signal = "BULLISH" if price > 2 else "BEARISH" if price < -2 else "NEUTRAL"
    return AgentResult("momentum_agent", signal, price, min(98, 55 + abs(price) * 8), f"Price change is {price:+.1f}% over the supplied window.", ids)


def _volume(price: float, volume: float, ids: List[str]) -> AgentResult:
    signal = "ACCUMULATION" if volume > 15 and price > 0 else "DISTRIBUTION" if volume > 15 and price < 0 else "NORMAL"
    return AgentResult("volume_anomaly_agent", signal, volume, min(97, 60 + abs(volume) * 1.2), f"Volume change is {volume:+.1f}%; anomaly threshold is 15%.", ids)


def _sentiment(sentiment: float, ids: List[str]) -> AgentResult:
    signal = "POSITIVE" if sentiment > 0.25 else "NEGATIVE" if sentiment < -0.25 else "MIXED"
    return AgentResult("sentiment_agent", signal, sentiment, min(96, 60 + abs(sentiment) * 30), f"Sentiment score is {sentiment:+.2f} on a -1 to +1 scale.", ids)


def run_market_agents(snapshot: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
    price = float(snapshot.get("price_change_pct", 0))
    volume = float(snapshot.get("volume_change_pct", 0))
    sentiment = float(snapshot.get("sentiment_score", 0))
    risk = str(profile.get("risk_tolerance", "moderate"))
    horizon = int(profile.get("investment_horizon_years", 7))
    evidence = retrieve("market momentum volume sentiment risk diversification debt liquidity")
    ids = [x["id"] for x in evidence]

    # Independent specialists execute concurrently over the same raw snapshot.
    with ThreadPoolExecutor(max_workers=3, thread_name_prefix="finarch-agent") as pool:
        futures = [pool.submit(_momentum, price, ids), pool.submit(_volume, price, volume, ids), pool.submit(_sentiment, sentiment, ids)]
        agents = [f.result() for f in futures]

    raw_score = price * 0.35 + max(min(volume, 100), -100) * 0.15 + sentiment * 10
    profile_bias = {"conservative": -12, "moderate": 0, "aggressive": 12}.get(risk, 0)
    horizon_bias = 5 if horizon >= 10 else 0 if horizon >= 5 else -5
    decision_score = max(0, min(100, 50 + raw_score + profile_bias + horizon_bias))
    recommendation = "INCREASE" if decision_score >= 62 else "REDUCE" if decision_score <= 38 else "HOLD"
    if risk == "conservative" and recommendation == "INCREASE": recommendation = "HOLD"
    if risk == "aggressive" and recommendation == "REDUCE" and horizon >= 10: recommendation = "HOLD"
    confidence = round(sum(a.confidence for a in agents) / len(agents), 1)
    return {"market_snapshot": snapshot, "agents": [asdict(a) for a in agents], "retrieved_evidence": evidence, "synthesis": {"recommendation": recommendation, "decision_score": round(decision_score, 1), "confidence": confidence, "reasoning": f"Three independent signals were synthesized and adjusted for a {risk} risk profile and {horizon}-year horizon.", "profile_effect": f"Risk tolerance={risk}; horizon={horizon} years changed the final suitability weighting."}, "degraded_mode": bool(snapshot.get("degraded", False)), "pipeline": ["raw_market_snapshot", "parallel_agents", "local_rag", "profile_weighting", "synthesis"]}
