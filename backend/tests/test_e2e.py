import pytest
import httpx

BASE_URL = "http://127.0.0.1:8000/api"

@pytest.fixture
def client():
    return httpx.Client(base_url=BASE_URL, timeout=10.0)

def test_01_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "FINARCH AI" in data["service"]

def test_02_demo_profile_and_financial_twin(client):
    # Reset to clean demo state first
    r_reset = client.post("/profile/reset-demo")
    assert r_reset.status_code == 200
    
    res = client.get("/financial-twin")
    assert res.status_code == 200
    data = res.json()
    
    assert "profile" in data
    assert "metrics" in data
    assert "health_score" in data
    assert "risk_assessment" in data
    
    metrics = data["metrics"]
    assert metrics["monthly_income"] == 120000.0
    assert metrics["monthly_expenses"] == 65000.0
    assert metrics["monthly_surplus"] == 55000.0
    assert metrics["total_debt"] == 300000.0
    assert metrics["net_worth"] == 650000.0
    assert metrics["emergency_fund_coverage_months"] > 2.0
    
    health = data["health_score"]
    assert 0 <= health["overall_score"] <= 100
    assert health["emergency_fund_score"] > 0
    assert health["debt_health_score"] > 0
    assert len(health["insights"]) > 0

def test_03_decision_engine_50k(client):
    res = client.post("/analyze?amount=50000")
    assert res.status_code == 200
    data = res.json()
    
    assert data["amount"] == 50000.0
    assert len(data["ranked_actions"]) >= 5
    highest = data["highest_value_action"]
    assert highest["category"] == "DEBT_REDUCTION"
    assert highest["decision_score"] >= 85.0
    assert highest["five_year_projected_wealth"] > 50000.0
    assert highest["confidence_pct"] >= 90

def test_04_opportunity_optimizer(client):
    payload = {
        "amount": 50000.0,
        "weight_expected_return": 0.30,
        "weight_risk_reduction": 0.20,
        "weight_liquidity": 0.20,
        "weight_debt_payoff": 0.20,
        "weight_goal_alignment": 0.10
    }
    res = client.post("/optimize", json=payload)
    assert res.status_code == 200
    data = res.json()
    
    assert "best_action" in data
    assert "comparison_table" in data
    assert len(data["comparison_table"]) >= 5
    assert data["weights_used"]["expected_return"] == 0.30

def test_05_what_if_simulator(client):
    payload = {
        "salary_increase_pct": 10.0,
        "expense_increase_pct": 0.0,
        "extra_monthly_sip": 5000.0,
        "one_time_investment": 0.0,
        "one_time_debt_payoff": 0.0,
        "market_shock_pct": 0.0,
        "stop_sip_months": 0,
        "projection_years": 10
    }
    res = client.post("/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    
    assert data["five_year_wealth_simulated"] > data["five_year_wealth_current"]
    assert data["five_year_delta"] > 0
    assert len(data["yearly_trajectory"]) == 11
    assert len(data["key_takeaways"]) > 0

def test_06_monte_carlo_1000_paths(client):
    payload = {
        "initial_wealth": 650000.0,
        "monthly_savings": 33000.0,
        "years": 10,
        "num_simulations": 1000,
        "expected_return_pct": 12.0,
        "annual_volatility_pct": 15.0,
        "target_goal_wealth": 7500000.0
    }
    res = client.post("/simulate/monte-carlo", json=payload)
    assert res.status_code == 200
    data = res.json()
    
    assert data["num_simulations"] == 1000
    assert 0 <= data["goal_success_probability_pct"] <= 100
    assert data["p90_best_case"] >= data["median_wealth"] >= data["p10_worst_case"]
    assert len(data["distribution_bins"]) > 5
    assert len(data["percentile_trajectories"]["p50"]) == 11

def test_07_goals_crud(client):
    # Get initial goals
    r_get = client.get("/goals")
    assert r_get.status_code == 200
    init_count = len(r_get.json())
    
    # Create goal
    new_g = {
        "name": "Japan Travel Fund",
        "category": "custom",
        "target_amount": 300000.0,
        "current_amount": 50000.0,
        "target_year": 2028,
        "monthly_contribution": 10000.0,
        "priority": "HIGH",
        "is_essential": False
    }
    r_create = client.post("/goals", json=new_g)
    assert r_create.status_code == 200
    created = r_create.json()
    assert created["id"] is not None
    assert created["name"] == "Japan Travel Fund"
    
    # Verify count increased
    r_after = client.get("/goals")
    assert len(r_after.json()) == init_count + 1
    
    # Delete goal
    r_del = client.delete(f"/goals/{created['id']}")
    assert r_del.status_code == 200
    
    # Verify count restored
    r_final = client.get("/goals")
    assert len(r_final.json()) == init_count

def test_08_explainable_ai_advisor(client):
    questions = [
        "Where should I put my next ₹20,000?",
        "Should I invest or repay my loan?",
        "Can I afford a ₹3 lakh bike?",
        "How long will it take to build my emergency fund?"
    ]
    for q in questions:
        res = client.post("/ai/chat", json={"message": q})
        assert res.status_code == 200
        data = res.json()
        assert len(data["recommendation_title"]) > 0
        assert len(data["what"]) > 0
        assert len(data["why"]) > 0
        assert len(data["alternatives_considered"]) > 0
        assert len(data["assumptions"]) > 0
        assert len(data["risks"]) > 0
        assert len(data["trade_offs"]) > 0

def test_09_market_knowledge_layer(client):
    res = client.get("/market/demo")
    assert res.status_code == 200
    data = res.json()
    assert "Demo Data" in data["badge"]
    assert len(data["regulatory_bodies"]) >= 3
    assert len(data["benchmark_returns_history"]) >= 4
