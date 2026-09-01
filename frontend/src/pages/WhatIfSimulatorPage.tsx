import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { WhatIfResult, MonteCarloResult } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import {
  Sliders,
  GitCompare,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  HelpCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const WhatIfSimulatorPage: React.FC = () => {
  const { profile, currency } = useFinancial();

  // Control Levers
  const [params, setParams] = useState({
    salary_increase_pct: 10,
    expense_increase_pct: 0,
    extra_monthly_sip: 5000,
    one_time_investment: 0,
    one_time_debt_payoff: 0,
    market_shock_pct: 0,
    stop_sip_months: 0,
    projection_years: 10,
  });

  const [activeTab, setActiveTab] = useState<'dual' | 'montecarlo'>('dual');
  const [whatIfResult, setWhatIfResult] = useState<WhatIfResult | null>(null);
  const [mcResult, setMcResult] = useState<MonteCarloResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Run What-If Simulation
  const runWhatIf = async () => {
    setLoading(true);
    try {
      const data = await ApiService.simulateWhatIf(params);
      setWhatIfResult(data);
    } catch (e) {
      console.error('What-If error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Run Monte Carlo Simulation
  const runMonteCarlo = async () => {
    try {
      const mc = await ApiService.runMonteCarlo(
        profile.stocks_equity + profile.mutual_funds + profile.fixed_deposits,
        profile.salary_income + profile.other_income - (profile.rent_expense + profile.food_expense + profile.transport_expense + profile.utilities_expense + profile.subscriptions_expense + profile.other_expenses) + params.extra_monthly_sip,
        10,
        1000,
        12 + params.market_shock_pct / 5,
        15,
        7500000
      );
      setMcResult(mc);
    } catch (e) {
      console.error('Monte Carlo error:', e);
    }
  };

  useEffect(() => {
    runWhatIf();
    runMonteCarlo();
  }, [params, profile]);

  const handleReset = () => {
    setParams({
      salary_increase_pct: 0,
      expense_increase_pct: 0,
      extra_monthly_sip: 0,
      one_time_investment: 0,
      one_time_debt_payoff: 0,
      market_shock_pct: 0,
      stop_sip_months: 0,
      projection_years: 10,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
              SIMULATION LAB
            </span>
            <span className="tech-label text-slate-400">10-YEAR DUAL SCENARIOS & 1,000-PATH MONTE CARLO</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
            WHAT-IF SIMULATOR
          </h1>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-md bg-obsidian-900 hover:bg-obsidian-850 border border-white/[0.12] text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Levers</span>
        </button>
      </div>

      {/* SPLIT-SCREEN LAYOUT: CONTROL LEVERS (Left) vs SIMULATED FUTURE (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (5 cols): CONTROL VARIABLES */}
        <div className="lg:col-span-5 fin-panel p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <span className="tech-label text-slate-200">CONTROL LEVERS</span>
            <span className="tech-label text-mint-400">INPUT SHOCKS</span>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setParams((p) => ({ ...p, extra_monthly_sip: 5000 }))}
              className="px-2.5 py-1 rounded bg-obsidian-900 border border-white/[0.08] hover:border-mint-500/40 text-[11px] font-mono text-slate-300 hover:text-white"
            >
              +₹5,000 Extra SIP
            </button>
            <button
              onClick={() => setParams((p) => ({ ...p, salary_increase_pct: 15 }))}
              className="px-2.5 py-1 rounded bg-obsidian-900 border border-white/[0.08] hover:border-mint-500/40 text-[11px] font-mono text-slate-300 hover:text-white"
            >
              +15% Salary Hike
            </button>
            <button
              onClick={() => setParams((p) => ({ ...p, market_shock_pct: -20 }))}
              className="px-2.5 py-1 rounded bg-obsidian-900 border border-crimson-500/30 text-[11px] font-mono text-crimson-400 hover:bg-crimson-500/10"
            >
              -20% Market Drop Today
            </button>
          </div>

          {/* Lever 1: Salary Hike */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Salary Growth</span>
              <span className="text-mint-400 font-bold">+{params.salary_increase_pct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={params.salary_increase_pct}
              onChange={(e) => setParams({ ...params, salary_increase_pct: Number(e.target.value) })}
              className="w-full h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-mint-500"
            />
          </div>

          {/* Lever 2: Expense Inflation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Expense Inflation</span>
              <span className="text-crimson-400 font-bold">+{params.expense_increase_pct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={params.expense_increase_pct}
              onChange={(e) => setParams({ ...params, expense_increase_pct: Number(e.target.value) })}
              className="w-full h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-crimson-500"
            />
          </div>

          {/* Lever 3: Extra Monthly SIP */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Extra Systematic SIP</span>
              <span className="text-cyan-400 font-bold">+{formatCurrency(params.extra_monthly_sip, currency)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="2500"
              value={params.extra_monthly_sip}
              onChange={(e) => setParams({ ...params, extra_monthly_sip: Number(e.target.value) })}
              className="w-full h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Lever 4: Market Shock */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Immediate Market Shock</span>
              <span className={`font-bold ${params.market_shock_pct < 0 ? 'text-crimson-400' : 'text-slate-300'}`}>
                {params.market_shock_pct}%
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="30"
              step="5"
              value={params.market_shock_pct}
              onChange={(e) => setParams({ ...params, market_shock_pct: Number(e.target.value) })}
              className="w-full h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* RIGHT COLUMN (7 cols): SIMULATED FUTURE */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
            <button
              onClick={() => setActiveTab('dual')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                activeTab === 'dual'
                  ? 'bg-mint-500 text-obsidian-950 shadow-sm'
                  : 'bg-obsidian-900 border border-white/[0.08] text-slate-400 hover:text-white'
              }`}
            >
              10-Year Dual Strategy Curves
            </button>
            <button
              onClick={() => setActiveTab('montecarlo')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                activeTab === 'montecarlo'
                  ? 'bg-mint-500 text-obsidian-950 shadow-sm'
                  : 'bg-obsidian-900 border border-white/[0.08] text-slate-400 hover:text-white'
              }`}
            >
              1,000 Monte Carlo Paths
            </button>
          </div>

          {/* TAB 1: DUAL STRATEGY TRAJECTORY */}
          {activeTab === 'dual' && (
            <div className="fin-panel p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="tech-label text-slate-400">DUAL STRATEGY COMPOUNDING</span>
                  <h3 className="text-base font-bold text-white font-mono">
                    BASE CASE VS. YOUR SCENARIO
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="text-slate-400">─── Base Case</span>
                  <span className="text-mint-400 font-bold">─── Simulated</span>
                </div>
              </div>

              {/* Impact readout stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-obsidian-900 border border-white/[0.06] p-3 rounded-lg">
                  <span className="tech-label text-slate-400 block">5Y WEALTH IMPACT</span>
                  <span className="text-base font-mono font-bold text-white mt-0.5 block">
                    {formatCurrency(whatIfResult?.five_year_wealth_simulated || 0, currency)}
                  </span>
                  <span className="text-[10px] font-mono text-mint-400">
                    +{(whatIfResult?.five_year_delta || 0) >= 0 ? '+' : ''}
                    {formatCurrency(whatIfResult?.five_year_delta || 0, currency)} vs Base
                  </span>
                </div>

                <div className="bg-obsidian-900 border border-white/[0.06] p-3 rounded-lg">
                  <span className="tech-label text-slate-400 block">10Y PROJECTION</span>
                  <span className="text-base font-mono font-bold text-cyan-400 mt-0.5 block">
                    {formatCurrency(whatIfResult?.ten_year_wealth_simulated || 0, currency)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Compounded</span>
                </div>

                <div className="bg-obsidian-900 border border-white/[0.06] p-3 rounded-lg col-span-2 sm:col-span-1">
                  <span className="tech-label text-slate-400 block">DEBT-FREE DATE</span>
                  <span className="text-base font-mono font-bold text-white mt-0.5 block">
                    {whatIfResult?.debt_free_date_simulated || 'Year 2028'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Base: {whatIfResult?.debt_free_date_current}</span>
                </div>
              </div>

              <div className="h-64 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={whatIfResult?.yearly_trajectory || []}>
                    <defs>
                      <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f59b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00f59b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#4A5B68" fontSize={11} tickFormatter={(y) => `Yr ${y}`} />
                    <YAxis stroke="#4A5B68" fontSize={11} tickFormatter={(v) => formatCurrency(v, currency)} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0D0F', borderColor: '#222B32', borderRadius: '8px' }}
                      formatter={(val: any) => [formatCurrency(Number(val), currency), '']}
                    />
                    <Area type="monotone" dataKey="simulated_net_worth" stroke="#00f59b" strokeWidth={2} fill="url(#simGrad)" />
                    <Area type="monotone" dataKey="current_net_worth" stroke="#4A5B68" strokeDasharray="3 3" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 2: MONTE CARLO 1,000 PATHS */}
          {activeTab === 'montecarlo' && (
            <div className="fin-panel p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div>
                  <span className="tech-label text-slate-400">STOCHASTIC MODELING</span>
                  <h3 className="text-base font-bold text-white font-mono">
                    1,000 SIMULATED MARKET PATHS
                  </h3>
                </div>
                <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
                  GOAL PROBABILITY: {mcResult?.goal_success_probability_pct || 70.4}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-obsidian-900 p-3 rounded-lg border border-white/[0.06]">
                  <span className="tech-label text-slate-400 block">10th Percentile (Downside)</span>
                  <span className="text-sm font-bold text-crimson-400 mt-1 block">
                    {formatCurrency(mcResult?.p10_worst_case || 0, currency)}
                  </span>
                </div>
                <div className="bg-obsidian-900 p-3 rounded-lg border border-white/[0.06]">
                  <span className="tech-label text-slate-400 block">50th (Median Expectation)</span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {formatCurrency(mcResult?.median_wealth || 0, currency)}
                  </span>
                </div>
                <div className="bg-obsidian-900 p-3 rounded-lg border border-white/[0.06]">
                  <span className="tech-label text-slate-400 block">90th Percentile (Bull Case)</span>
                  <span className="text-sm font-bold text-mint-400 mt-1 block">
                    {formatCurrency(mcResult?.p90_best_case || 0, currency)}
                  </span>
                </div>
              </div>

              {/* Distribution Histogram */}
              <div className="h-56 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mcResult?.distribution_bins || []}>
                    <XAxis dataKey="range_label" stroke="#4A5B68" fontSize={10} />
                    <YAxis stroke="#4A5B68" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0D0F', borderColor: '#222B32', borderRadius: '8px' }}
                      formatter={(val: any) => [`${val} Paths`, 'Frequency']}
                    />
                    <Bar dataKey="frequency" fill="#00f59b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
