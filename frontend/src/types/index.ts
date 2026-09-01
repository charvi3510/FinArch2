export interface Goal {
  id?: number;
  name: string;
  category: 'emergency' | 'vehicle' | 'home' | 'retirement' | 'education' | 'wealth' | 'custom';
  target_amount: number;
  current_amount: number;
  target_year: number;
  monthly_contribution: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  is_essential: boolean;
  completion_percentage?: number;
  required_monthly?: number;
  is_on_track?: boolean;
}

export interface FinancialProfile {
  // Income
  salary_income: number;
  other_income: number;
  // Expenses
  rent_expense: number;
  food_expense: number;
  transport_expense: number;
  utilities_expense: number;
  subscriptions_expense: number;
  other_expenses: number;
  // Assets
  cash_balance: number;
  bank_savings: number;
  emergency_fund: number;
  fixed_deposits: number;
  gold_assets: number;
  mutual_funds: number;
  stocks_equity: number;
  other_assets: number;
  // Liabilities
  credit_card_debt: number;
  credit_card_rate: number;
  personal_loan: number;
  personal_loan_rate: number;
  education_loan: number;
  education_loan_rate: number;
  home_loan: number;
  home_loan_rate: number;
  vehicle_loan: number;
  vehicle_loan_rate: number;
  other_liabilities: number;
  // Systematic
  monthly_sip: number;
  // Risk & Horizon
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
  investment_horizon_years: number;
  emergency_target_months: number;
  // Goals
  goals: Goal[];
}

export interface FinancialMetrics {
  net_worth: number;
  monthly_income: number;
  monthly_expenses: number;
  monthly_surplus: number;
  total_investments: number;
  total_debt: number;
  total_liquid_cash: number;
  emergency_fund_coverage_months: number;
  savings_rate_pct: number;
  debt_to_income_pct: number;
  weighted_debt_interest_rate: number;
  equity_allocation_pct: number;
  debt_allocation_pct: number;
  gold_allocation_pct: number;
  cash_allocation_pct: number;
}

export interface FinancialHealthScoreBreakdown {
  overall_score: number;
  emergency_fund_score: number;
  debt_health_score: number;
  savings_score: number;
  diversification_score: number;
  goal_progress_score: number;
  risk_alignment_score: number;
  insights: string[];
  score_grade: string;
}

export interface ActionEvaluation {
  action_id: string;
  action_name: string;
  category: string;
  rank: number;
  decision_score: number;
  expected_annual_return_pct: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH';
  liquidity_rating: 'HIGH' | 'MEDIUM' | 'LOW';
  tax_efficiency_rating: 'HIGH' | 'MEDIUM' | 'LOW';
  five_year_projected_wealth: number;
  projected_benefit: string;
  confidence_pct: number;
  recommendation_summary: string;
  pros: string[];
  cons: string[];
  key_assumptions: string[];
}

export interface DecisionEngineResult {
  amount: number;
  highest_value_action: ActionEvaluation;
  ranked_actions: ActionEvaluation[];
  safety_warnings: string[];
  validation_status: string;
}

export interface OpportunityItem {
  action: string;
  action_id: string;
  expected_return: string;
  expected_return_num: number;
  risk: string;
  risk_score: number;
  liquidity: string;
  goal_impact: string;
  five_year_wealth: number;
  wealth_delta: number;
  score: number;
  pros: string;
}

export interface OptimizationResult {
  amount: number;
  best_action: OpportunityItem;
  comparison_table: OpportunityItem[];
  weights_used: {
    expected_return: number;
    risk_reduction: number;
    liquidity: number;
    debt_payoff: number;
    goal_alignment: number;
  };
  formula_explanation: string;
}

export interface WhatIfYearPoint {
  year: number;
  current_net_worth: number;
  simulated_net_worth: number;
  current_debt: number;
  simulated_debt: number;
  current_investments: number;
  simulated_investments: number;
}

export interface WhatIfResult {
  five_year_wealth_current: number;
  five_year_wealth_simulated: number;
  five_year_delta: number;
  ten_year_wealth_current: number;
  ten_year_wealth_simulated: number;
  ten_year_delta: number;
  debt_free_date_current: string;
  debt_free_date_simulated: string;
  emergency_fund_ready_current: string;
  emergency_fund_ready_simulated: string;
  goal_probability_current: number;
  goal_probability_simulated: number;
  yearly_trajectory: WhatIfYearPoint[];
  key_takeaways: string[];
}

export interface MonteCarloBin {
  range_label: string;
  min_val: number;
  max_val: number;
  count: number;
  probability_pct: number;
}

export interface MonteCarloResult {
  num_simulations: number;
  target_goal: number;
  goal_success_probability_pct: number;
  expected_final_wealth: number;
  median_wealth: number;
  p10_worst_case: number;
  p90_best_case: number;
  min_wealth: number;
  max_wealth: number;
  distribution_bins: MonteCarloBin[];
  percentile_trajectories: {
    p10: number[];
    p50: number[];
    p90: number[];
  };
  assumptions_summary: string;
}

export interface RiskAssessment {
  risk_tolerance: string;
  stated_tolerance_score: number;
  actual_portfolio_risk_score: number;
  risk_alignment: 'ALIGNED' | 'AGGRESSIVE_MISMATCH' | 'CONSERVATIVE_MISMATCH';
  radar_metrics: {
    [key: string]: number;
  };
  max_drawdown_estimate_pct: number;
  value_at_risk_95_pct: number;
  summary: string;
  recommendations: string[];
}

export interface ChatResponse {
  recommendation_title: string;
  what: string;
  why: string;
  alternatives_considered: string[];
  assumptions: string[];
  risks: string[];
  trade_offs: string;
  suggested_followups: string[];
  source: string;
}

export interface RegulatoryBody {
  name: string;
  key_rate?: string;
  policy_stance?: string;
  inflation_target?: string;
  framework?: string;
  mandate?: string;
  industry_aum?: string;
  monthly_sip_inflows?: string;
}

export interface MarketBenchmark {
  asset_class: string;
  cagr_5y: number;
  cagr_10y: number;
  volatility_annual: number;
  risk: string;
}

export interface MarketKnowledge {
  badge: string;
  last_updated: string;
  regulatory_bodies: RegulatoryBody[];
  benchmark_returns_history: MarketBenchmark[];
  taxation_rules_reference: Record<string, string>;
}
