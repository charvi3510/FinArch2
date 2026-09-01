from app.agents.market_intelligence import retrieve, run_market_agents


def test_retrieval_returns_attributed_evidence():
    docs = retrieve("risk liquidity debt", top_k=3)
    assert len(docs) == 3
    assert all(doc["id"] and doc["title"] and doc["text"] for doc in docs)


def test_three_agents_and_profile_effect():
    snapshot = {"price_change_pct": 3.4, "volume_change_pct": 27, "sentiment_score": 0.42, "degraded": True}
    conservative = run_market_agents(snapshot, {"risk_tolerance": "conservative", "investment_horizon_years": 3})
    aggressive = run_market_agents(snapshot, {"risk_tolerance": "aggressive", "investment_horizon_years": 12})
    assert len(conservative["agents"]) == 3
    assert {a["agent"] for a in conservative["agents"]} == {"momentum_agent", "volume_anomaly_agent", "sentiment_agent"}
    assert conservative["retrieved_evidence"]
    assert conservative["degraded_mode"] is True
    assert conservative["synthesis"]["decision_score"] != aggressive["synthesis"]["decision_score"]


def test_degraded_snapshot_still_produces_recommendation():
    result = run_market_agents({"price_change_pct": 0, "volume_change_pct": 0, "sentiment_score": 0, "degraded": True}, {"risk_tolerance": "moderate", "investment_horizon_years": 7})
    assert result["synthesis"]["recommendation"] in {"INCREASE", "HOLD", "REDUCE"}
