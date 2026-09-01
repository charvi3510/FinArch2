from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class GoalBase(BaseModel):
    id: Optional[int] = None
    name: str
    category: str = "general"
    target_amount: float
    current_amount: float = 0.0
    target_year: int = 2028
    monthly_contribution: float = 0.0
    priority: str = "HIGH"
    is_essential: bool = False
    
    # Calculated properties
    completion_percentage: Optional[float] = None
    required_monthly: Optional[float] = None
    is_on_track: Optional[bool] = None

class FinancialProfileSchema(BaseModel):
    # Incomes
    salary_income: float = 110000.0
    other_income: float = 10000.0
    
    # Expenses
    rent_expense: float = 25000.0
    food_expense: float = 15000.0
    transport_expense: float = 6000.0
    utilities_expense: float = 5000.0
    subscriptions_expense: float = 3000.0
    other_expenses: float = 11000.0
    
    # Assets
    cash_balance: float = 35000.0
    bank_savings: float = 115000.0
    emergency_fund: float = 150000.0
    fixed_deposits: float = 50000.0
    gold_assets: float = 70000.0
    mutual_funds: float = 180000.0
    stocks_equity: float = 350000.0
    other_assets: float = 0.0
    
    # Liabilities
    credit_card_debt: float = 40000.0
    credit_card_rate: float = 38.0
    personal_loan: float = 180000.0
    personal_loan_rate: float = 14.5
    education_loan: float = 0.0
    education_loan_rate: float = 9.0
    home_loan: float = 0.0
    home_loan_rate: float = 8.5
    vehicle_loan: float = 80000.0
    vehicle_loan_rate: float = 9.5
    other_liabilities: float = 0.0
    
    # Monthly SIP
    monthly_sip: float = 22000.0
    
    # Risk
    risk_tolerance: str = "moderate"
    investment_horizon_years: int = 7
    emergency_target_months: int = 6
    
    # Goals list
    goals: List[GoalBase] = []

class FinancialHealthScoreBreakdown(BaseModel):
    overall_score: int
    emergency_fund_score: int
    debt_health_score: int
    savings_score: int
    diversification_score: int
    goal_progress_score: int
    risk_alignment_score: int
    insights: List[str]
    score_grade: str

class FinancialMetrics(BaseModel):
    net_worth: float
    monthly_income: float
    monthly_expenses: float
    monthly_surplus: float
    total_investments: float
    total_debt: float
    total_liquid_cash: float
    emergency_fund_coverage_months: float
    savings_rate_pct: float
    debt_to_income_pct: float
    weighted_debt_interest_rate: float
    equity_allocation_pct: float
    debt_allocation_pct: float
    gold_allocation_pct: float
    cash_allocation_pct: float

class ActionEvaluation(BaseModel):
    action_id: str
    action_name: str
    category: str
    rank: int
    decision_score: float # 0 - 100
    expected_annual_return_pct: float
    risk_level: str # LOW, MODERATE, HIGH
    liquidity_rating: str # HIGH, MEDIUM, LOW
    tax_efficiency_rating: str # HIGH, MEDIUM, LOW
    five_year_projected_wealth: float
    projected_benefit: str
    confidence_pct: int
    recommendation_summary: str
    pros: List[str]
    cons: List[str]
    key_assumptions: List[str]

class DecisionEngineResult(BaseModel):
    amount: float
    highest_value_action: ActionEvaluation
    ranked_actions: List[ActionEvaluation]
    safety_warnings: List[str]
    validation_status: str

class OptimizationRequest(BaseModel):
    amount: float = 50000.0
    weight_expected_return: float = 0.25
    weight_risk_reduction: float = 0.20
    weight_liquidity: float = 0.20
    weight_debt_payoff: float = 0.20
    weight_goal_alignment: float = 0.15

class WhatIfRequest(BaseModel):
    salary_increase_pct: float = 0.0
    expense_increase_pct: float = 0.0
    extra_monthly_sip: float = 0.0
    one_time_investment: float = 0.0
    one_time_debt_payoff: float = 0.0
    market_shock_pct: float = 0.0 # e.g. -20%
    stop_sip_months: int = 0
    projection_years: int = 10

class WhatIfYearPoint(BaseModel):
    year: int
    current_net_worth: float
    simulated_net_worth: float
    current_debt: float
    simulated_debt: float
    current_investments: float
    simulated_investments: float

class WhatIfResult(BaseModel):
    five_year_wealth_current: float
    five_year_wealth_simulated: float
    five_year_delta: float
    ten_year_wealth_current: float
    ten_year_wealth_simulated: float
    ten_year_delta: float
    debt_free_date_current: str
    debt_free_date_simulated: str
    emergency_fund_ready_current: str
    emergency_fund_ready_simulated: str
    goal_probability_current: int
    goal_probability_simulated: int
    yearly_trajectory: List[WhatIfYearPoint]
    key_takeaways: List[str]

class MonteCarloRequest(BaseModel):
    initial_wealth: float = 650000.0
    monthly_savings: float = 33000.0
    years: int = 10
    num_simulations: int = 1000
    expected_return_pct: float = 12.0
    annual_volatility_pct: float = 15.0
    target_goal_wealth: float = 7500000.0

class MonteCarloResult(BaseModel):
    num_simulations: int
    target_goal: float
    goal_success_probability_pct: float
    expected_final_wealth: float
    median_wealth: float
    p10_worst_case: float
    p90_best_case: float
    min_wealth: float
    max_wealth: float
    distribution_bins: List[Dict[str, Any]]
    percentile_trajectories: Dict[str, List[float]] # p10, p50, p90 per year
    assumptions_summary: str

class RiskAssessment(BaseModel):
    risk_tolerance: str
    stated_tolerance_score: int
    actual_portfolio_risk_score: int
    risk_alignment: str # "ALIGNED", "AGGRESSIVE_MISMATCH", "CONSERVATIVE_MISMATCH"
    radar_metrics: Dict[str, int] # Tolerance, Volatility, Liquidity, Diversification, Debt, Horizon
    max_drawdown_estimate_pct: float
    value_at_risk_95_pct: float
    summary: str
    recommendations: List[str]

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = []
    api_key: Optional[str] = None
    provider: Optional[str] = "local" # local, gemini, openai, anthropic

class ChatResponse(BaseModel):
    recommendation_title: str
    what: str
    why: str
    alternatives_considered: List[str]
    assumptions: List[str]
    risks: List[str]
    trade_offs: str
    suggested_followups: List[str]
    source: str # "FINARCH Deterministic Engine" or "LLM Agent"
