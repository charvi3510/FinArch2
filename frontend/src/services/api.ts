import {
  FinancialProfile,
  FinancialMetrics,
  FinancialHealthScoreBreakdown,
  DecisionEngineResult,
  OptimizationResult,
  WhatIfResult,
  MonteCarloResult,
  RiskAssessment,
  ChatResponse,
  MarketKnowledge,
  Goal
} from '../types';
import { ClientFinancialEngine, DEFAULT_DEMO_PROFILE } from './clientEngine';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const STORAGE_KEY = 'finarch_ai_profile';

export class ApiService {
  private static isBackendAvailable: boolean | null = null;

  static async checkBackend(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1200) });
      this.isBackendAvailable = res.ok;
      return res.ok;
    } catch {
      this.isBackendAvailable = false;
      return false;
    }
  }

  static getLocalProfile(): FinancialProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
    return DEFAULT_DEMO_PROFILE;
  }

  static saveLocalProfile(profile: FinancialProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Error saving to localStorage', e);
    }
  }

  static async getProfile(): Promise<FinancialProfile> {
    if (this.isBackendAvailable !== false) {
      try {
        const res = await fetch(`${API_BASE}/profile`, { signal: AbortSignal.timeout(1500) });
        if (res.ok) {
          const data = await res.json();
          this.saveLocalProfile(data);
          this.isBackendAvailable = true;
          return data;
        }
      } catch {
        this.isBackendAvailable = false;
      }
    }
    return this.getLocalProfile();
  }

  static async updateProfile(profile: FinancialProfile): Promise<FinancialProfile> {
    this.saveLocalProfile(profile);
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
          signal: AbortSignal.timeout(2000)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {
        this.isBackendAvailable = false;
      }
    }
    return profile;
  }

  static async resetToDemo(): Promise<FinancialProfile> {
    this.saveLocalProfile(DEFAULT_DEMO_PROFILE);
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/profile/reset-demo`, {
          method: 'POST',
          signal: AbortSignal.timeout(2000)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {
        this.isBackendAvailable = false;
      }
    }
    return DEFAULT_DEMO_PROFILE;
  }

  static async getFinancialTwin(): Promise<{
    profile: FinancialProfile;
    metrics: FinancialMetrics;
    health_score: FinancialHealthScoreBreakdown;
    risk_assessment: RiskAssessment;
    portfolio: any;
  }> {
    const profile = await this.getProfile();
    const metrics = ClientFinancialEngine.calculateMetrics(profile);
    const health_score = ClientFinancialEngine.calculateHealthScore(profile);
    const risk_assessment = ClientFinancialEngine.assessRisk(profile);
    const portfolio = {
      allocations: [
        { name: 'Equity & Stocks', value: profile.stocks_equity + profile.mutual_funds * 0.7, percentage: metrics.equity_allocation_pct, color: '#06b6d4' },
        { name: 'Debt & Fixed Income', value: profile.fixed_deposits + profile.mutual_funds * 0.3, percentage: metrics.debt_allocation_pct, color: '#10b981' },
        { name: 'Gold & Commodities', value: profile.gold_assets, percentage: metrics.gold_allocation_pct, color: '#f59e0b' },
        { name: 'Cash & Liquid', value: metrics.total_liquid_cash, percentage: metrics.cash_allocation_pct, color: '#6366f1' }
      ]
    };

    return { profile, metrics, health_score, risk_assessment, portfolio };
  }

  static async analyzeDecision(amount: number = 10000): Promise<DecisionEngineResult> {
    const profile = await this.getProfile();
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/analyze?amount=${amount}`, {
          method: 'POST',
          signal: AbortSignal.timeout(2000)
        });
        if (res.ok) return await res.json();
      } catch {
        this.isBackendAvailable = false;
      }
    }
    return ClientFinancialEngine.evaluateDecision(profile, amount);
  }

  static async optimizeOpportunity(
    amount: number = 50000,
    weights = {
      expected_return: 0.25,
      risk_reduction: 0.20,
      liquidity: 0.20,
      debt_payoff: 0.20,
      goal_alignment: 0.15
    }
  ): Promise<OptimizationResult> {
    const profile = await this.getProfile();
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/optimize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, ...weights }),
          signal: AbortSignal.timeout(2000)
        });
        if (res.ok) return await res.json();
      } catch {
        this.isBackendAvailable = false;
      }
    }
    return ClientFinancialEngine.optimizeOpportunity(profile, amount, weights);
  }

  static async simulateWhatIf(params: any): Promise<WhatIfResult> {
    const profile = await this.getProfile();
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
          signal: AbortSignal.timeout(2000)
        });
        if (res.ok) return await res.json();
      } catch {
        this.isBackendAvailable = false;
      }
    }
    return ClientFinancialEngine.simulateWhatIf(profile, params);
  }

  static async runMonteCarlo(
    initialWealth: number = 650000,
    monthlySavings: number = 33000,
    years: number = 10,
    numSimulations: number = 1000,
    expectedReturnPct: number = 12.0,
    volatilityPct: number = 15.0,
    targetGoal: number = 7500000
  ): Promise<MonteCarloResult> {
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/simulate/monte-carlo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            initial_wealth: initialWealth,
            monthly_savings: monthlySavings,
            years,
            num_simulations: numSimulations,
            expected_return_pct: expectedReturnPct,
            annual_volatility_pct: volatilityPct,
            target_goal_wealth: targetGoal
          }),
          signal: AbortSignal.timeout(3500)
        });
        if (res.ok) return await res.json();
      } catch {
        this.isBackendAvailable = false;
      }
    }
    return ClientFinancialEngine.runMonteCarlo(
      initialWealth,
      monthlySavings,
      years,
      numSimulations,
      expectedReturnPct,
      volatilityPct,
      targetGoal
    );
  }

  static async askAdvisor(message: string, apiKey?: string, provider: string = 'local'): Promise<ChatResponse> {
    const profile = await this.getProfile();
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, api_key: apiKey, provider }),
          signal: AbortSignal.timeout(4000)
        });
        if (res.ok) return await res.json();
      } catch {
        this.isBackendAvailable = false;
      }
    }
    return ClientFinancialEngine.generateAIExplanation(profile, message);
  }

  static async getMarketKnowledge(): Promise<MarketKnowledge> {
    if (this.isBackendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/market/demo`, { signal: AbortSignal.timeout(1500) });
        if (res.ok) return await res.json();
      } catch {
        this.isBackendAvailable = false;
      }
    }
    return ClientFinancialEngine.getMarketKnowledge();
  }
}
