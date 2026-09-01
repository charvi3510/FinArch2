from app.agents.market_intelligence import run_market_agents


def test_parallel_agent_outputs_have_confidence_and_evidence():
    result = run_market_agents(
        {"price_change_pct": 3.4, "volume_change_pct": 27, "sentiment_score": 0.42, "degraded": True},
        {"risk_tolerance": "moderate", "investment_horizon_years": 7},
    )
    assert len(result["agents"]) == 3
    assert all(a["confidence"] >= 0 for a in result["agents"])
    assert all(a["evidence_ids"] for a in result["agents"])
    assert result["pipeline"][-1] == "synthesis"
