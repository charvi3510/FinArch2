from app.agents.market_intelligence import retrieve, run_market_agents


def test_retrieval_returns_attributed_documents():
    docs = retrieve("risk liquidity debt")
    assert len(docs) == 3
    assert all({"id", "title", "text"}.issubset(d) for d in docs)


def test_three_agents_and_synthesis():
    result = run_market_agents(
        {"price_change_pct": 3.4, "volume_change_pct": 27, "sentiment_score": 0.42, "degraded": True},
        {"risk_tolerance": "moderate", "investment_horizon_years": 7},
    )
    assert len(result["agents"]) == 3
    assert {a["agent"] for a in result["agents"]} == {"momentum_agent", "volume_anomaly_agent", "sentiment_agent"}
    assert result["synthesis"]["recommendation"] in {"INCREASE", "HOLD", "REDUCE"}
    assert 0 <= result["synthesis"]["confidence"] <= 100
    assert result["retrieved_evidence"]


def test_profile_changes_identical_input():
    snapshot = {"price_change_pct": 3.4, "volume_change_pct": 27, "sentiment_score": 0.42, "degraded": True}
    conservative = run_market_agents(snapshot, {"risk_tolerance": "conservative", "investment_horizon_years": 3})
    aggressive = run_market_agents(snapshot, {"risk_tolerance": "aggressive", "investment_horizon_years": 15})
    assert conservative["synthesis"]["decision_score"] != aggressive["synthesis"]["decision_score"]


def test_degraded_mode_is_explicit():
    result = run_market_agents(
        {"price_change_pct": 0, "volume_change_pct": 0, "sentiment_score": 0, "degraded": True},
        {"risk_tolerance": "moderate", "investment_horizon_years": 7},
    )
    assert result["degraded_mode"] is True
    assert result["retrieved_evidence"]
