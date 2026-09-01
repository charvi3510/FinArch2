import pytest
from app.schemas.financial import FinancialProfileSchema, OptimizationRequest, WhatIfRequest, MonteCarloRequest
from app.financial_engine.calculator import FinancialCalculator
from app.financial_engine.health_score import FinancialHealthEngine
from app.optimization.decision_engine import DecisionEngine
from app.optimization.portfolio_optimizer import OpportunityOptimizer
from app.simulation.monte_carlo import MonteCarloSimulator
from app.simulation.what_if import WhatIfSimulator
from app.risk.risk_engine import RiskEngine

def test_financial_calculator():
    profile = FinancialProfileSchema()
    metrics = FinancialCalculator.calculate_metrics(profile)
    
    assert metrics.monthly_income == 120000.0
    assert metrics.monthly_expenses == 65000.0
    assert metrics.monthly_surplus == 55000.0
    assert metrics.total_debt == 300000.0
    assert metrics.emergency_fund_coverage_months > 2.0
    assert metrics.net_worth > 0

def test_health_score_calculation():
    profile = FinancialProfileSchema()
    health = FinancialHealthEngine.calculate_health_score(profile)
    
    assert 0 <= health.overall_score <= 100
    assert health.emergency_fund_score > 0
    assert health.debt_health_score > 0
    assert len(health.insights) > 0

def test_decision_engine_ranks_debt_repayment_highest():
    profile = FinancialProfileSchema(credit_card_debt=40000.0, credit_card_rate=38.0)
    result = DecisionEngine.evaluate_next_rupee_action(profile, 10000.0)
    
    assert len(result.ranked_actions) > 0
    assert result.highest_value_action.category == "DEBT_REDUCTION"
    assert result.highest_value_action.decision_score > 85

def test_monte_carlo_simulation():
    req = MonteCarloRequest(num_simulations=150, years=5)
    res = MonteCarloSimulator.run_simulation(req)
    
    assert res.num_simulations == 150
    assert res.p90_best_case >= res.median_wealth >= res.p10_worst_case
    assert len(res.distribution_bins) > 0

def test_what_if_simulation():
    profile = FinancialProfileSchema()
    req = WhatIfRequest(extra_monthly_sip=5000.0, projection_years=5)
    res = WhatIfSimulator.simulate_scenarios(profile, req)
    
    assert res.five_year_wealth_simulated > res.five_year_wealth_current
    assert len(res.yearly_trajectory) == 6
