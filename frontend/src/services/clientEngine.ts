import {
  FinancialProfile,
  FinancialMetrics,
  FinancialHealthScoreBreakdown,
  ActionEvaluation,
  DecisionEngineResult,
  OptimizationResult,
  OpportunityItem,
  WhatIfResult,
  WhatIfYearPoint,
  MonteCarloResult,
  MonteCarloBin,
  RiskAssessment,
  ChatResponse,
  MarketKnowledge,
  Goal
} from '../types';

export const DEFAULT_DEMO_PROFILE: FinancialProfile = {
  salary_income: 110000,
  other_income: 10000,
  rent_expense: 25000,
  food_expense: 15000,
  transport_expense: 6000,
  utilities_expense: 5000,
  subscriptions_expense: 3000,
  other_expenses: 11000,
  cash_balance: 35000,
  bank_savings: 115000,
  emergency_fund: 150000,
  fixed_deposits: 50000,
  gold_assets: 70000,
  mutual_funds: 180000,
  stocks_equity: 350000,
  other_assets: 0,
  credit_card_debt: 40000,
  credit_card_rate: 38.0,
  personal_loan: 180000,
  personal_loan_rate: 14.5,
  education_loan: 0,
  education_loan_rate: 9.0,
  home_loan: 0,
  home_loan_rate: 8.5,
  vehicle_loan: 80000,
  vehicle_loan_rate: 9.5,
  other_liabilities: 0,
  monthly_sip: 22000,
  risk_tolerance: 'moderate',
  investment_horizon_years: 7,
  emergency_target_months: 6,
  goals: [
    {
      id: 1,
      name: '6-Month Emergency Cushion',
      category: 'emergency',
      target_amount: 390000,
      current_amount: 150000,
      target_year: 2027,
      monthly_contribution: 10000,
      priority: 'HIGH',
      is_essential: true,
      completion_percentage: 38.5,
      required_monthly: 20000,
      is_on_track: false
    },
    {
      id: 2,
      name: 'Electric SUV Downpayment',
      category: 'vehicle',
      target_amount: 800000,
      current_amount: 250000,
      target_year: 2028,
      monthly_contribution: 12000,
      priority: 'MEDIUM',
      is_essential: false,
      completion_percentage: 31.2,
      required_monthly: 22916,
      is_on_track: false
    },
    {
      id: 3,
      name: 'Dream Apartment Downpayment',
      category: 'home',
      target_amount: 2500000,
      current_amount: 420000,
      target_year: 2031,
      monthly_contribution: 15000,
      priority: 'HIGH',
      is_essential: false,
      completion_percentage: 16.8,
      required_monthly: 34666,
      is_on_track: false
    },
    {
      id: 4,
      name: 'Retirement Corpus (NPS + Equity)',
      category: 'retirement',
      target_amount: 20000000,
      current_amount: 650000,
      target_year: 2050,
      monthly_contribution: 10000,
      priority: 'HIGH',
      is_essential: true,
      completion_percentage: 3.2,
      required_monthly: 67187,
      is_on_track: false
    }
  ]
};

export class ClientFinancialEngine {
  static calculateMetrics(profile: FinancialProfile): FinancialMetrics {
    const monthly_income = profile.salary_income + profile.other_income;
    const monthly_expenses =
      profile.rent_expense +
      profile.food_expense +
      profile.transport_expense +
      profile.utilities_expense +
      profile.subscriptions_expense +
      profile.other_expenses;

    const monthly_surplus = monthly_income - monthly_expenses;
    const total_liquid_cash = profile.cash_balance + profile.bank_savings + profile.emergency_fund;
    const total_investments =
      profile.stocks_equity +
      profile.mutual_funds +
      profile.gold_assets +
      profile.fixed_deposits +
      profile.other_assets;
    const total_assets = total_liquid_cash + total_investments;

    const total_debt =
      profile.credit_card_debt +
      profile.personal_loan +
      profile.education_loan +
      profile.home_loan +
      profile.vehicle_loan +
      profile.other_liabilities;

    const weighted_interest_sum =
      profile.credit_card_debt * profile.credit_card_rate +
      profile.personal_loan * profile.personal_loan_rate +
      profile.education_loan * profile.education_loan_rate +
      profile.home_loan * profile.home_loan_rate +
      profile.vehicle_loan * profile.vehicle_loan_rate;

    const weighted_debt_rate = total_debt > 0 ? weighted_interest_sum / total_debt : 0;
    const net_worth = total_assets - total_debt;
    const emergency_coverage_months = monthly_expenses > 0 ? (profile.emergency_fund + profile.bank_savings) / monthly_expenses : 0;
    const savings_rate_pct = monthly_income > 0 ? (monthly_surplus / monthly_income) * 100 : 0;
    const debt_to_income_pct = monthly_income > 0 ? (total_debt / (monthly_income * 12)) * 100 : 0;

    const equity_total = profile.stocks_equity + profile.mutual_funds * 0.7;
    const debt_total = profile.fixed_deposits + profile.mutual_funds * 0.3;
    const gold_total = profile.gold_assets;
    const cash_total = total_liquid_cash;
    const portfolio_total = equity_total + debt_total + gold_total + cash_total;

    return {
      net_worth: Math.round(net_worth),
      monthly_income: Math.round(monthly_income),
      monthly_expenses: Math.round(monthly_expenses),
      monthly_surplus: Math.round(monthly_surplus),
      total_investments: Math.round(total_investments),
      total_debt: Math.round(total_debt),
      total_liquid_cash: Math.round(total_liquid_cash),
      emergency_fund_coverage_months: Number(emergency_coverage_months.toFixed(1)),
      savings_rate_pct: Number(savings_rate_pct.toFixed(1)),
      debt_to_income_pct: Number(debt_to_income_pct.toFixed(1)),
      weighted_debt_interest_rate: Number(weighted_debt_rate.toFixed(2)),
      equity_allocation_pct: portfolio_total > 0 ? Number(((equity_total / portfolio_total) * 100).toFixed(1)) : 0,
      debt_allocation_pct: portfolio_total > 0 ? Number(((debt_total / portfolio_total) * 100).toFixed(1)) : 0,
      gold_allocation_pct: portfolio_total > 0 ? Number(((gold_total / portfolio_total) * 100).toFixed(1)) : 0,
      cash_allocation_pct: portfolio_total > 0 ? Number(((cash_total / portfolio_total) * 100).toFixed(1)) : 0,
    };
  }

  static calculateHealthScore(profile: FinancialProfile): FinancialHealthScoreBreakdown {
    const metrics = this.calculateMetrics(profile);
    const insights: string[] = [];

    // Emergency Fund (20%)
    const targetMonths = Math.max(profile.emergency_target_months, 3);
    const cov = metrics.emergency_fund_coverage_months;
    let emergency_score = cov >= targetMonths ? 100 : cov >= 3.0 ? 60 + ((cov - 3.0) / (targetMonths - 3.0)) * 40 : (cov / 3.0) * 60;
    emergency_score = Math.min(Math.max(Math.round(emergency_score), 0), 100);

    if (emergency_score < 70) {
      insights.push(`Emergency cushion is ${cov.toFixed(1)} mo. Target is ${targetMonths} mo for full risk insulation.`);
    } else {
      insights.push(`Healthy emergency reserve covering ${cov.toFixed(1)} months of living expenses.`);
    }

    // Debt Health (25%)
    let debt_score = 100;
    if (metrics.total_debt > 0) {
      let base = 100 - Math.min(metrics.debt_to_income_pct * 1.5, 50);
      if (profile.credit_card_debt > 0) {
        base -= 30;
        insights.push(`Revolving credit card debt of ₹${profile.credit_card_debt.toLocaleString()} @ ${profile.credit_card_rate}% APR is dragging wealth.`);
      }
      if (profile.personal_loan > 0) {
        base -= 15;
        insights.push(`Personal loan of ₹${profile.personal_loan.toLocaleString()} @ ${profile.personal_loan_rate}% has high carry cost.`);
      }
      debt_score = Math.min(Math.max(Math.round(base), 10), 100);
    } else {
      insights.push('Zero active debt burden. Outstanding balance sheet safety.');
    }

    // Savings Rate (20%)
    const sr = metrics.savings_rate_pct;
    let savings_score = sr >= 40 ? 100 : sr >= 20 ? 70 + ((sr - 20) / 20) * 30 : sr > 0 ? (sr / 20) * 70 : 10;
    savings_score = Math.min(Math.max(Math.round(savings_score), 0), 100);
    if (sr >= 30) {
      insights.push(`Strong monthly savings velocity of ${sr.toFixed(1)}% providing consistent surplus.`);
    }

    // Diversification (15%)
    const eq = metrics.equity_allocation_pct;
    let div_score = 40 <= eq && eq <= 75 && metrics.gold_allocation_pct >= 5 ? 90 : 30 <= eq && eq <= 85 ? 75 : 55;

    // Goal Progress (10%)
    let goal_score = 60;
    if (profile.goals && profile.goals.length > 0) {
      const avg = profile.goals.reduce((acc, g) => acc + Math.min((g.current_amount / g.target_amount) * 100, 100), 0) / profile.goals.length;
      goal_score = Math.min(Math.max(Math.round(avg), 20), 100);
    }

    // Risk Alignment (10%)
    const tol = profile.risk_tolerance;
    let risk_score = tol === 'conservative' ? (eq <= 40 ? 90 : 50) : tol === 'moderate' ? (45 <= eq && eq <= 75 ? 90 : 65) : eq >= 65 ? 90 : 70;

    const overall = Math.round(
      emergency_score * 0.20 +
      debt_score * 0.25 +
      savings_score * 0.20 +
      div_score * 0.15 +
      goal_score * 0.10 +
      risk_score * 0.10
    );

    const grade = overall >= 85 ? 'EXCELLENT' : overall >= 70 ? 'STRONG' : overall >= 50 ? 'MODERATE' : 'VULNERABLE';

    return {
      overall_score: overall,
      emergency_fund_score: emergency_score,
      debt_health_score: debt_score,
      savings_score: savings_score,
      diversification_score: div_score,
      goal_progress_score: goal_score,
      risk_alignment_score: risk_score,
      insights: insights.slice(0, 4),
      score_grade: grade
    };
  }

  static evaluateDecision(profile: FinancialProfile, amount: number = 10000): DecisionEngineResult {
    const metrics = this.calculateMetrics(profile);
    const safety_warnings: string[] = [];

    if (metrics.emergency_fund_coverage_months < 3.0) {
      safety_warnings.push(`Emergency cushion is only ${metrics.emergency_fund_coverage_months.toFixed(1)} mo (< 3 mo safe reserve). Capital preservation advised.`);
    }
    if (profile.credit_card_debt > 0) {
      safety_warnings.push(`Credit card balance of ₹${profile.credit_card_debt.toLocaleString()} @ ${profile.credit_card_rate}% APR requires immediate payoff.`);
    }

    const actions: ActionEvaluation[] = [];

    // Action 1: Debt
    if (profile.credit_card_debt > 0 || profile.personal_loan > 0) {
      const highest_rate = Math.max(
        profile.credit_card_debt > 0 ? profile.credit_card_rate : 0,
        profile.personal_loan > 0 ? profile.personal_loan_rate : 0
      );
      const saved_5y = amount * Math.pow(1 + highest_rate / 100, 5);
      const debtScore = profile.credit_card_debt > 0 ? 96.5 : 72 + Math.min(highest_rate * 0.75, 25);

      actions.push({
        action_id: 'pay_high_interest_debt',
        action_name: 'Pay Down High-Interest Debt',
        category: 'DEBT_REDUCTION',
        rank: 0,
        decision_score: Number(debtScore.toFixed(1)),
        expected_annual_return_pct: highest_rate,
        risk_level: 'LOW',
        liquidity_rating: 'LOW',
        tax_efficiency_rating: 'HIGH',
        five_year_projected_wealth: Math.round(saved_5y),
        projected_benefit: `+₹${Math.round(saved_5y - amount).toLocaleString()} guaranteed interest saved`,
        confidence_pct: 94,
        recommendation_summary: `Repaying debt @ ${highest_rate.toFixed(1)}% APR delivers a guaranteed tax-free return of ${highest_rate.toFixed(1)}%, superior to any volatile equity benchmark.`,
        pros: [
          `Guaranteed ${highest_rate.toFixed(1)}% annual return without market risk`,
          '100% tax-free equivalent yield',
          'Immediately lowers Debt-to-Income and frees future monthly cash flow'
        ],
        cons: ['Capital is locked into loan principal'],
        key_assumptions: [`Interest rate remains at ${highest_rate.toFixed(1)}% APR`, 'Zero prepayment penalties apply']
      });
    }

    // Action 2: Emergency Fund
    if (metrics.emergency_fund_coverage_months < profile.emergency_target_months) {
      const emScore = metrics.emergency_fund_coverage_months < 3.0 ? 92.0 : 81.0;
      const em5y = amount * Math.pow(1.07, 5);

      actions.push({
        action_id: 'build_emergency_fund',
        action_name: 'Strengthen Emergency Reserve',
        category: 'CAPITAL_PRESERVATION',
        rank: 0,
        decision_score: emScore,
        expected_annual_return_pct: 7.0,
        risk_level: 'LOW',
        liquidity_rating: 'HIGH',
        tax_efficiency_rating: 'MEDIUM',
        five_year_projected_wealth: Math.round(em5y),
        projected_benefit: `+₹${Math.round(em5y - amount).toLocaleString()} liquid safety cushion`,
        confidence_pct: 91,
        recommendation_summary: `Your emergency reserve covers ${metrics.emergency_fund_coverage_months.toFixed(1)} months. Reaching 6 months prevents distress selling during market downturns.`,
        pros: ['Instant T+1 liquidity for medical/job crises', 'Shields long-term portfolio from forced liquidation', 'Stable ~7% yield in liquid funds'],
        cons: ['Lower return than 12%+ long-term equity'],
        key_assumptions: ['Funds held in RBI-regulated Liquid Mutual Funds or High Yield FDs']
      });
    }

    // Action 3: Increase SIP
    let sipScore = 80.0 + (profile.risk_tolerance === 'aggressive' ? 5 : profile.risk_tolerance === 'moderate' ? 2 : -5);
    if (profile.credit_card_debt > 0) sipScore -= 16;
    const sip5y = amount * Math.pow(1.125, 5);

    actions.push({
      action_id: 'increase_monthly_sip',
      action_name: 'Increase Monthly SIP in Diversified Equity',
      category: 'WEALTH_GROWTH',
      rank: 0,
      decision_score: Number(Math.max(sipScore, 40).toFixed(1)),
      expected_annual_return_pct: 12.5,
      risk_level: 'MODERATE',
      liquidity_rating: 'MEDIUM',
      tax_efficiency_rating: 'HIGH',
      five_year_projected_wealth: Math.round(sip5y),
      projected_benefit: `+₹${Math.round(sip5y - amount).toLocaleString()} compounding equity growth`,
      confidence_pct: 86,
      recommendation_summary: 'Rupee-cost averaging via SIP captures economic compounding while dampening market timing risk.',
      pros: ['Averages purchase price across market volatility', 'Historical 12-14% CAGR in Indian equities', 'LTCG tax efficiency above ₹1.25L'],
      cons: ['Short-term volatility (10-20% standard deviation)'],
      key_assumptions: ['Maintained uninterrupted over 5-7 year horizon']
    });

    // Action 4: Direct Equity
    let eqScore = profile.risk_tolerance === 'aggressive' ? 76.0 : 66.0;
    if (profile.credit_card_debt > 0) eqScore -= 20;
    const eq5y = amount * Math.pow(1.14, 5);

    actions.push({
      action_id: 'invest_direct_equity',
      action_name: 'Lump Sum in High-Growth Equities',
      category: 'AGGRESSIVE_GROWTH',
      rank: 0,
      decision_score: Number(eqScore.toFixed(1)),
      expected_annual_return_pct: 14.0,
      risk_level: 'HIGH',
      liquidity_rating: 'HIGH',
      tax_efficiency_rating: 'HIGH',
      five_year_projected_wealth: Math.round(eq5y),
      projected_benefit: `+₹${Math.round(eq5y - amount).toLocaleString()} maximum upside target`,
      confidence_pct: 73,
      recommendation_summary: 'High-growth direct equity allocation targets maximum compounding upside for long horizons.',
      pros: ['Highest potential return', 'T+1 settlement liquidity'],
      cons: ['Susceptible to 20-30% market drawdowns'],
      key_assumptions: ['Investment horizon > 7 years']
    });

    // Action 5: Fixed Income
    const debt5y = amount * Math.pow(1.078, 5);
    actions.push({
      action_id: 'invest_fixed_income',
      action_name: 'Allocate to Fixed Income / SGB',
      category: 'DEFENSIVE_ALLOCATION',
      rank: 0,
      decision_score: 68.0,
      expected_annual_return_pct: 7.8,
      risk_level: 'LOW',
      liquidity_rating: 'MEDIUM',
      tax_efficiency_rating: 'MEDIUM',
      five_year_projected_wealth: Math.round(debt5y),
      projected_benefit: `+₹${Math.round(debt5y - amount).toLocaleString()} steady defensive accrual`,
      confidence_pct: 90,
      recommendation_summary: 'Sovereign Gold Bonds and Target Maturity Debt funds provide capital preservation with regular yield.',
      pros: ['Guaranteed predictability', 'Protects against equity bear cycles'],
      cons: ['Modest real return after inflation and tax'],
      key_assumptions: ['Interest rate cycle stays stable']
    });

    // Action 6: Rebalance
    const reb5y = amount * Math.pow(1.118, 5);
    actions.push({
      action_id: 'rebalance_portfolio',
      action_name: 'Reallocate Portfolio to Target Risk Asset Mix',
      category: 'PORTFOLIO_OPTIMIZATION',
      rank: 0,
      decision_score: 73.0,
      expected_annual_return_pct: 11.8,
      risk_level: 'MODERATE',
      liquidity_rating: 'MEDIUM',
      tax_efficiency_rating: 'MEDIUM',
      five_year_projected_wealth: Math.round(reb5y),
      projected_benefit: `+₹${Math.round(reb5y - amount).toLocaleString()} optimized Sharpe ratio`,
      confidence_pct: 84,
      recommendation_summary: 'Rebalancing locks in gains from high performers and redistributes to undervalued assets.',
      pros: ['Systematic buy low sell high discipline', 'Reduces concentration risk'],
      cons: ['May trigger minor capital gains tax upon reallocation'],
      key_assumptions: ['Target 60% Equity / 25% Debt / 10% Gold / 5% Cash']
    });

    // Action 7: Cash
    const cash5y = amount * Math.pow(1.04, 5);
    actions.push({
      action_id: 'hold_liquid_cash',
      action_name: 'Hold in High-Yield Savings / Arbitrage Fund',
      category: 'CASH_MANAGEMENT',
      rank: 0,
      decision_score: 48.0,
      expected_annual_return_pct: 4.0,
      risk_level: 'LOW',
      liquidity_rating: 'HIGH',
      tax_efficiency_rating: 'LOW',
      five_year_projected_wealth: Math.round(cash5y),
      projected_benefit: `+₹${Math.round(cash5y - amount).toLocaleString()} complete instant liquidity`,
      confidence_pct: 98,
      recommendation_summary: 'Holding cash provides maximum optionality for sudden opportunities but suffers from inflation drag.',
      pros: ['Zero price volatility', 'Instant liquidity'],
      cons: ['Negative real return against 5.5% inflation'],
      key_assumptions: ['Held in savings account or overnight fund']
    });

    actions.sort((a, b) => b.decision_score - a.decision_score);
    actions.forEach((act, idx) => {
      act.rank = idx + 1;
    });

    return {
      amount,
      highest_value_action: actions[0],
      ranked_actions: actions,
      safety_warnings,
      validation_status: 'VALIDATED'
    };
  }

  static optimizeOpportunity(
    profile: FinancialProfile,
    amount: number = 50000,
    weights = {
      expected_return: 0.25,
      risk_reduction: 0.20,
      liquidity: 0.20,
      debt_payoff: 0.20,
      goal_alignment: 0.15
    }
  ): OptimizationResult {
    const metrics = this.calculateMetrics(profile);
    const debtRate = Math.max(profile.credit_card_debt > 0 ? profile.credit_card_rate : 0, profile.personal_loan > 0 ? profile.personal_loan_rate : 0, 9.0);

    const rawOptions = [
      {
        id: 'DEBT_PAYOFF',
        name: 'Pay Down High-Interest Debt',
        expected_return: debtRate,
        risk_score: 5,
        liquidity_score: 15,
        debt_impact_score: 98,
        goal_alignment_score: 85,
        pros: 'Guaranteed tax-free return equal to debt interest saved',
        risk_label: 'GUARANTEED (ZERO VOLATILITY)'
      },
      {
        id: 'EQUITY_SIP',
        name: 'Invest in Equity (Mutual Funds / SIP)',
        expected_return: 12.5,
        risk_score: 65,
        liquidity_score: 75,
        debt_impact_score: 10,
        goal_alignment_score: 92,
        pros: 'Highest compounding growth over 5+ year horizons',
        risk_label: 'MODERATE RISK'
      },
      {
        id: 'EMERGENCY_RESERVE',
        name: 'Build Emergency Fund (Liquid)',
        expected_return: 7.0,
        risk_score: 10,
        liquidity_score: 98,
        debt_impact_score: 0,
        goal_alignment_score: metrics.emergency_fund_coverage_months < 3 ? 100 : 88,
        pros: 'Crucial safety buffer against unexpected life crises',
        risk_label: 'VERY LOW RISK'
      },
      {
        id: 'FIXED_INCOME',
        name: 'Invest in Fixed Income / Corporate FD / SGB',
        expected_return: 8.0,
        risk_score: 25,
        liquidity_score: 50,
        debt_impact_score: 0,
        goal_alignment_score: 70,
        pros: 'Stable, predictable accrual yield with capital preservation',
        risk_label: 'LOW RISK'
      },
      {
        id: 'HOLD_CASH',
        name: 'Hold Liquid Cash in Savings',
        expected_return: 3.8,
        risk_score: 5,
        liquidity_score: 100,
        debt_impact_score: 0,
        goal_alignment_score: 40,
        pros: 'Instant access for immediate buying opportunities',
        risk_label: 'INFLATION DRAG'
      }
    ];

    const scored: OpportunityItem[] = rawOptions.map((opt) => {
      const retTerm = (opt.expected_return / 30.0) * 100;
      const riskTerm = 100 - opt.risk_score;
      const liqTerm = opt.liquidity_score;
      const debtTerm = metrics.total_debt > 0 ? opt.debt_impact_score : 0;
      const goalTerm = opt.goal_alignment_score;

      const rawScore =
        weights.expected_return * retTerm +
        weights.risk_reduction * riskTerm +
        weights.liquidity * liqTerm +
        weights.debt_payoff * debtTerm +
        weights.goal_alignment * goalTerm;

      const score = Math.min(Math.max(Number(rawScore.toFixed(1)), 5), 99);
      const fiveYearWealth = Math.round(amount * Math.pow(1 + opt.expected_return / 100, 5));

      return {
        action: opt.name,
        action_id: opt.id,
        expected_return: `${opt.expected_return.toFixed(1)}%`,
        expected_return_num: opt.expected_return,
        risk: opt.risk_label,
        risk_score: opt.risk_score,
        liquidity: `${opt.liquidity_score}/100`,
        goal_impact: `${opt.goal_alignment_score}/100`,
        five_year_wealth: fiveYearWealth,
        wealth_delta: fiveYearWealth - amount,
        score,
        pros: opt.pros
      };
    });

    scored.sort((a, b) => b.score - a.score);

    return {
      amount,
      best_action: scored[0],
      comparison_table: scored,
      weights_used: weights,
      formula_explanation: 'Decision Score = (w_ret × Return) + (w_risk × (100 - Risk)) + (w_liq × Liquidity) + (w_debt × Debt_Impact) + (w_goal × Goal_Alignment)'
    };
  }

  static simulateWhatIf(
    profile: FinancialProfile,
    params: {
      salary_increase_pct?: number;
      expense_increase_pct?: number;
      extra_monthly_sip?: number;
      one_time_investment?: number;
      one_time_debt_payoff?: number;
      market_shock_pct?: number;
      stop_sip_months?: number;
      projection_years?: number;
    }
  ): WhatIfResult {
    const metrics = this.calculateMetrics(profile);
    const years = params.projection_years || 10;
    const baseIncome = metrics.monthly_income;
    const baseExpense = metrics.monthly_expenses;
    const baseSurplus = Math.max(baseIncome - baseExpense, 0);
    const baseSip = Math.min(profile.monthly_sip, baseSurplus);

    const simIncome = baseIncome * (1 + (params.salary_increase_pct || 0) / 100);
    const simExpense = baseExpense * (1 + (params.expense_increase_pct || 0) / 100);
    const simSip = baseSip + (params.extra_monthly_sip || 0);

    let curInv = metrics.total_investments;
    let curDebt = metrics.total_debt;
    let simInv = (metrics.total_investments + (params.one_time_investment || 0)) * (1 + (params.market_shock_pct || 0) / 100);
    let simDebt = Math.max(metrics.total_debt - (params.one_time_debt_payoff || 0), 0);

    const yearlyTrajectory: WhatIfYearPoint[] = [];
    const expReturn = 0.115;
    const debtRate = Math.max(metrics.weighted_debt_interest_rate / 100, 0.08);

    let debtFreeCur = curDebt > 0 ? 'Not Projected (>10 yrs)' : 'Debt Free Today';
    let debtFreeSim = simDebt > 0 ? 'Not Projected (>10 yrs)' : 'Debt Free Today';

    for (let yr = 0; yr <= years; yr++) {
      if (yr === 0) {
        yearlyTrajectory.push({
          year: 0,
          current_net_worth: Math.round(curInv + metrics.total_liquid_cash - curDebt),
          simulated_net_worth: Math.round(simInv + metrics.total_liquid_cash - simDebt),
          current_debt: Math.round(curDebt),
          simulated_debt: Math.round(simDebt),
          current_investments: Math.round(curInv),
          simulated_investments: Math.round(simInv)
        });
        continue;
      }

      for (let m = 0; m < 12; m++) {
        curInv = curInv * (1 + expReturn / 12) + baseSip;
        if (curDebt > 0) {
          const interest = curDebt * (debtRate / 12);
          const payment = Math.min(curDebt + interest, Math.max(15000, curDebt * 0.04));
          curDebt = Math.max(0, curDebt + interest - payment);
          if (curDebt === 0 && debtFreeCur.startsWith('Not Projected')) {
            debtFreeCur = `Year ${yr} (${2026 + yr})`;
          }
        }

        const isSipStopped = yr === 1 && m < (params.stop_sip_months || 0);
        const effectiveSimSip = isSipStopped ? 0 : simSip;
        simInv = simInv * (1 + expReturn / 12) + effectiveSimSip;

        if (simDebt > 0) {
          const interest = simDebt * (debtRate / 12);
          const payment = Math.min(simDebt + interest, Math.max(20000, simDebt * 0.05));
          simDebt = Math.max(0, simDebt + interest - payment);
          if (simDebt === 0 && debtFreeSim.startsWith('Not Projected')) {
            debtFreeSim = `Year ${yr} (${2026 + yr})`;
          }
        }
      }

      yearlyTrajectory.push({
        year: yr,
        current_net_worth: Math.round(curInv + metrics.total_liquid_cash - curDebt),
        simulated_net_worth: Math.round(simInv + metrics.total_liquid_cash - simDebt),
        current_debt: Math.round(curDebt),
        simulated_debt: Math.round(simDebt),
        current_investments: Math.round(curInv),
        simulated_investments: Math.round(simInv)
      });
    }

    const y5Cur = yearlyTrajectory[Math.min(5, yearlyTrajectory.length - 1)].current_net_worth;
    const y5Sim = yearlyTrajectory[Math.min(5, yearlyTrajectory.length - 1)].simulated_net_worth;
    const y10Cur = yearlyTrajectory[yearlyTrajectory.length - 1].current_net_worth;
    const y10Sim = yearlyTrajectory[yearlyTrajectory.length - 1].simulated_net_worth;
    const delta5y = y5Sim - y5Cur;

    const takeaways: string[] = [];
    if (delta5y > 0) {
      takeaways.push(`Simulated strategy increases 5-year wealth by +₹${delta5y.toLocaleString()} (+${((delta5y / y5Cur) * 100).toFixed(1)}%).`);
    } else if (delta5y < 0) {
      takeaways.push(`Simulated strategy results in a 5-year gap of -₹${Math.abs(delta5y).toLocaleString()} due to expense increases or market shocks.`);
    }

    if ((params.extra_monthly_sip || 0) > 0) {
      takeaways.push(`Adding ₹${(params.extra_monthly_sip || 0).toLocaleString()}/mo SIP increases 10-year compounding wealth by +₹${(y10Sim - y10Cur).toLocaleString()}.`);
    }

    return {
      five_year_wealth_current: y5Cur,
      five_year_wealth_simulated: y5Sim,
      five_year_delta: delta5y,
      ten_year_wealth_current: y10Cur,
      ten_year_wealth_simulated: y10Sim,
      ten_year_delta: y10Sim - y10Cur,
      debt_free_date_current: debtFreeCur,
      debt_free_date_simulated: debtFreeSim,
      emergency_fund_ready_current: 'August 2027',
      emergency_fund_ready_simulated: 'January 2027',
      goal_probability_current: 74,
      goal_probability_simulated: delta5y > 0 ? 89 : 64,
      yearly_trajectory: yearlyTrajectory,
      key_takeaways: takeaways
    };
  }

  static runMonteCarlo(
    initialWealth: number = 650000,
    monthlySavings: number = 33000,
    years: number = 10,
    numSims: number = 1000,
    expectedReturnPct: number = 12.0,
    volatilityPct: number = 15.0,
    targetGoal: number = 7500000
  ): MonteCarloResult {
    const months = years * 12;
    const monthlyReturn = Math.pow(1 + expectedReturnPct / 100, 1 / 12) - 1;
    const monthlyVol = (volatilityPct / 100) / Math.sqrt(12);

    const finalWealths: number[] = [];
    const p10Trajectory: number[] = [];
    const p50Trajectory: number[] = [];
    const p90Trajectory: number[] = [];

    // Simulate 1000 paths
    const paths: number[][] = [];

    // Simple Box-Muller normal generator
    const randomNormal = () => {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    for (let s = 0; s < numSims; s++) {
      const path: number[] = [initialWealth];
      let current = initialWealth;
      for (let m = 0; m < months; m++) {
        const shock = monthlyReturn + monthlyVol * randomNormal();
        current = current * (1 + shock) + monthlySavings;
        path.push(current);
      }
      paths.push(path);
      finalWealths.push(current);
    }

    finalWealths.sort((a, b) => a - b);

    // Calculate percentiles
    const p10Idx = Math.floor(numSims * 0.1);
    const p50Idx = Math.floor(numSims * 0.5);
    const p90Idx = Math.floor(numSims * 0.9);

    const p10 = finalWealths[p10Idx];
    const p50 = finalWealths[p50Idx];
    const p90 = finalWealths[p90Idx];
    const mean = finalWealths.reduce((acc, v) => acc + v, 0) / numSims;
    const minVal = finalWealths[0];
    const maxVal = finalWealths[finalWealths.length - 1];

    const successCount = finalWealths.filter((w) => w >= targetGoal).length;
    const successProb = Number(((successCount / numSims) * 100).toFixed(1));

    // Trajectories per year
    for (let yr = 0; yr <= years; yr++) {
      const monthIdx = yr * 12;
      const stepValues = paths.map((p) => p[monthIdx]).sort((a, b) => a - b);
      p10Trajectory.push(Math.round(stepValues[p10Idx]));
      p50Trajectory.push(Math.round(stepValues[p50Idx]));
      p90Trajectory.push(Math.round(stepValues[p90Idx]));
    }

    // Bins for histogram
    const numBins = 10;
    const binSize = (maxVal - minVal) / numBins;
    const distributionBins: MonteCarloBin[] = [];

    for (let b = 0; b < numBins; b++) {
      const bMin = minVal + b * binSize;
      const bMax = bMin + binSize;
      const count = finalWealths.filter((w) => (b === numBins - 1 ? w >= bMin && w <= bMax : w >= bMin && w < bMax)).length;
      distributionBins.push({
        range_label: `₹${(bMin / 100000).toFixed(1)}L - ₹${(bMax / 100000).toFixed(1)}L`,
        min_val: Math.round(bMin),
        max_val: Math.round(bMax),
        count,
        probability_pct: Number(((count / numSims) * 100).toFixed(1))
      });
    }

    return {
      num_simulations: numSims,
      target_goal: targetGoal,
      goal_success_probability_pct: successProb,
      expected_final_wealth: Math.round(mean),
      median_wealth: Math.round(p50),
      p10_worst_case: Math.round(p10),
      p90_best_case: Math.round(p90),
      min_wealth: Math.round(minVal),
      max_wealth: Math.round(maxVal),
      distribution_bins: distributionBins,
      percentile_trajectories: {
        p10: p10Trajectory,
        p50: p50Trajectory,
        p90: p90Trajectory
      },
      assumptions_summary: `Generated ${numSims.toLocaleString()} stochastic simulation paths across ${years} years with ${expectedReturnPct}% CAGR, ${volatilityPct}% volatility, and ₹${monthlySavings.toLocaleString()}/mo contributions.`
    };
  }

  static assessRisk(profile: FinancialProfile): RiskAssessment {
    const metrics = this.calculateMetrics(profile);
    const tol = profile.risk_tolerance;
    const statedScore = tol === 'conservative' ? 30 : tol === 'moderate' ? 65 : 90;
    const eq = metrics.equity_allocation_pct;
    const dti = metrics.debt_to_income_pct;
    const emMonths = metrics.emergency_fund_coverage_months;

    const actualRisk = Math.min(Math.max(Math.round(eq * 0.55 + Math.min(dti * 0.8, 30) + Math.max(0, (6 - emMonths) * 4)), 10), 98);
    const diff = actualRisk - statedScore;
    const alignment: 'ALIGNED' | 'AGGRESSIVE_MISMATCH' | 'CONSERVATIVE_MISMATCH' =
      diff > 15 ? 'AGGRESSIVE_MISMATCH' : diff < -15 ? 'CONSERVATIVE_MISMATCH' : 'ALIGNED';

    const summary =
      alignment === 'AGGRESSIVE_MISMATCH'
        ? `Your active portfolio risk (${actualRisk}/100) exceeds your stated '${tol}' profile due to high equity weight combined with debt obligations.`
        : alignment === 'CONSERVATIVE_MISMATCH'
        ? `Your portfolio risk (${actualRisk}/100) is more conservative than your '${tol}' target, risking purchasing power loss.`
        : `Your portfolio risk score (${actualRisk}/100) is well-aligned with your '${tol}' profile.`;

    const radar = {
      'Risk Tolerance': statedScore,
      'Portfolio Volatility': Math.min(Math.round(eq * 1.1), 95),
      'Liquidity Buffer': Math.min(Math.round((emMonths / 6.0) * 90 + 10), 100),
      'Diversification': 40 <= eq && eq <= 75 ? 85 : 60,
      'Debt Safety': Math.max(Math.round(100 - (dti * 2 + (profile.credit_card_debt > 0 ? 30 : 0))), 15),
      'Time Horizon': Math.min(profile.investment_horizon_years * 12, 95)
    };

    return {
      risk_tolerance: tol,
      stated_tolerance_score: statedScore,
      actual_portfolio_risk_score: actualRisk,
      risk_alignment: alignment,
      radar_metrics: radar,
      max_drawdown_estimate_pct: Number(((eq / 100) * 38 + (metrics.gold_allocation_pct / 100) * -10).toFixed(1)),
      value_at_risk_95_pct: Math.round(metrics.total_investments * (radar['Portfolio Volatility'] / 100) * 0.08),
      summary,
      recommendations: [
        `Accumulate at least ${profile.emergency_target_months} months in liquid reserves before taking higher market exposures.`,
        'Repay high-interest revolving credit card liabilities immediately to de-risk your balance sheet.',
        'Rebalance your portfolio when equity moves ±5% beyond your target baseline.'
      ]
    };
  }

  static generateAIExplanation(profile: FinancialProfile, userMsg: string): ChatResponse {
    const lower = userMsg.toLowerCase();
    const metrics = this.calculateMetrics(profile);
    const health = this.calculateHealthScore(profile);

    if (lower.includes('next') || lower.includes('10000') || lower.includes('20000') || lower.includes('50000') || lower.includes('put') || lower.includes('where')) {
      const res = this.evaluateDecision(profile, 20000);
      const best = res.highest_value_action;

      return {
        recommendation_title: `RECOMMENDATION: ${best.action_name.toUpperCase()}`,
        what: `Deploy your surplus funds into ${best.action_name}.`,
        why: `Your financial profile indicates high debt leverage / priority buffer needs. ${best.recommendation_summary} This delivers an annualized benefit of ${best.expected_annual_return_pct}% with ${best.confidence_pct}% statistical confidence.`,
        alternatives_considered: res.ranked_actions.slice(1, 4).map((a) => a.action_name),
        assumptions: [
          ...best.key_assumptions,
          `Current monthly disposable surplus is ~₹${metrics.monthly_surplus.toLocaleString()}`,
          `Risk profile is categorized as ${profile.risk_tolerance}`
        ],
        risks: [
          ...best.cons,
          'Opportunity cost if alternative speculative assets experience sudden short-term spikes'
        ],
        trade_offs: `Choosing ${best.action_name} trades maximum immediate liquidity for higher long-term risk-adjusted net worth stability.`,
        suggested_followups: [
          'How will this impact my 5-year wealth?',
          'Can I afford a ₹3 lakh bike right now?',
          'What if I increase my monthly SIP instead?'
        ],
        source: 'FINARCH Autonomous Decision Engine'
      };
    }

    if (lower.includes('loan') || lower.includes('repay') || lower.includes('debt') || lower.includes('invest or')) {
      const debtRate = Math.max(profile.credit_card_debt > 0 ? profile.credit_card_rate : 0, profile.personal_loan > 0 ? profile.personal_loan_rate : 0, 9.5);
      return {
        recommendation_title: 'RECOMMENDATION: REPAY HIGH-INTEREST DEBT FIRST',
        what: `Pay down high-rate debt (Cost: ${debtRate}% APR) prior to expanding discretionary equity investments.`,
        why: `Your high-interest debt carries an effective cost of ${debtRate}%. Beating this in the stock market post-tax (12.5% LTCG) would require gross equity returns above ~${(debtRate + 2.5).toFixed(1)}% guaranteed, which is statistically improbable.`,
        alternatives_considered: [
          'Investing ₹20,000 in Nifty 50 Index Funds (12% CAGR, volatile)',
          'Locking funds in Fixed Deposits (7.2% pre-tax)',
          'Purchasing Sovereign Gold Bonds'
        ],
        assumptions: [`Debt rate remains constant at ${debtRate}% APR`, 'Prepayment goes directly toward principal'],
        risks: ['Funds paid toward debt cannot be instantly withdrawn without new borrowing'],
        trade_offs: 'Guaranteed 14-38% risk-free return vs uncertain equity compounding upside.',
        suggested_followups: ['What is my debt-free date under this plan?', 'Where should my next ₹10,000 go?'],
        source: 'FINARCH Autonomous Decision Engine'
      };
    }

    if (lower.includes('bike') || lower.includes('car') || lower.includes('afford') || lower.includes('buy') || lower.includes('3 lakh')) {
      const canAfford = metrics.monthly_surplus >= 25000 && metrics.emergency_fund_coverage_months >= 4 && profile.credit_card_debt === 0;
      return {
        recommendation_title: 'AFFORDABILITY ASSESSMENT: ₹3,00,000 PURCHASE',
        what: canAfford ? 'AFFORDABLE VIA CONTROLLED CASHFLOW' : 'POSTPONE OR FUND VIA 12-MONTH SINKING FUND',
        why: `Your monthly surplus is ₹${metrics.monthly_surplus.toLocaleString()}. Carrying ₹${(profile.credit_card_debt + profile.personal_loan).toLocaleString()} in debt and having an emergency cushion of ${metrics.emergency_fund_coverage_months.toFixed(1)} mo means an immediate ₹3L outlay creates liquidity fragility.`,
        alternatives_considered: [
          'Create a 15-month sinking fund contributing ₹20,000/mo in liquid funds',
          'Explore low-cost pre-owned options at ₹1.2 Lakh',
          'Take a secured low-interest loan @ 8.8% only after clearing card debt'
        ],
        assumptions: ['Insurance, fuel, and upkeep will add ~₹2,500/month in recurring costs'],
        risks: ['Risk of missing payments if emergency expenses arise'],
        trade_offs: 'Immediate lifestyle upgrade vs delaying emergency fund completion and financial freedom.',
        suggested_followups: ['How long will it take to build my emergency fund?', 'Where should my next ₹20,000 go?'],
        source: 'FINARCH Autonomous Decision Engine'
      };
    }

    return {
      recommendation_title: 'FINARCH FINANCIAL DIAGNOSTIC SUMMARY',
      what: `Your Financial Health Score is ${health.overall_score}/100 (${health.score_grade}). Prioritize debt optimization and emergency resilience.`,
      why: `Your net worth is ₹${metrics.net_worth.toLocaleString()} with a ${metrics.savings_rate_pct.toFixed(1)}% savings rate. Eliminating revolving liabilities will unlock massive compounding potential.`,
      alternatives_considered: ['Consolidate debt', 'Increase systematic equity SIPs', 'Cut subscription overhead'],
      assumptions: ['Monthly income continues at ₹1,20,000/mo', 'No sudden inflation spikes beyond 6%'],
      risks: ['Market corrections', 'Interest rate rises on floating loans'],
      trade_offs: 'Short-term discipline to achieve debt-free wealth compounding.',
      suggested_followups: [
        'Where should I put my next ₹20,000?',
        'Should I invest or repay my loan?',
        'Can I afford a ₹3 lakh bike?',
        'How risky is my portfolio?'
      ],
      source: 'FINARCH Autonomous Decision Engine'
    };
  }

  static getMarketKnowledge(): MarketKnowledge {
    return {
      badge: 'Demo Data - Simulated Market Benchmarks',
      last_updated: 'September 2026',
      regulatory_bodies: [
        {
          name: 'Reserve Bank of India (RBI)',
          key_rate: 'Repo Rate @ 6.50%',
          policy_stance: 'Neutral',
          inflation_target: '4.0% (±2%)'
        },
        {
          name: 'Securities and Exchange Board of India (SEBI)',
          framework: 'Categorization and Rationalization of Mutual Fund Schemes',
          mandate: 'Investor Protection & Market Transparency'
        },
        {
          name: 'Association of Mutual Funds in India (AMFI)',
          industry_aum: '₹66+ Lakh Crore',
          monthly_sip_inflows: '₹23,000+ Crore'
        }
      ],
      benchmark_returns_history: [
        { asset_class: 'Nifty 50 (Large Cap)', cagr_5y: 15.2, cagr_10y: 13.8, volatility_annual: 14.5, risk: 'Moderate-High' },
        { asset_class: 'Nifty Midcap 150', cagr_5y: 21.4, cagr_10y: 17.6, volatility_annual: 19.8, risk: 'High' },
        { asset_class: 'Crisil 10Y G-Sec Debt', cagr_5y: 6.8, cagr_10y: 7.3, volatility_annual: 4.1, risk: 'Low' },
        { asset_class: 'Physical Gold / SGB', cagr_5y: 14.1, cagr_10y: 11.2, volatility_annual: 12.0, risk: 'Moderate' },
        { asset_class: 'Liquid Mutual Funds', cagr_5y: 6.4, cagr_10y: 6.6, volatility_annual: 0.6, risk: 'Very Low' }
      ],
      taxation_rules_reference: {
        equity_ltcg: '12.5% on capital gains exceeding ₹1,25,000 per fiscal year',
        equity_stcg: '20.0% on equities held under 12 months',
        debt_funds: 'Taxed at marginal income tax slab rate',
        gold_sgb_redemption: '100% Tax-Exempt if held till 8-year maturity'
      }
    };
  }
}
