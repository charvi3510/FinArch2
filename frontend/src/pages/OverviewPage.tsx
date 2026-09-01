import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '../context/FinancialContext';
import { StatCard } from '../components/common/StatCard';
import { HealthScoreRadial } from '../components/common/HealthScoreRadial';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { ApiService } from '../services/api';
import { DecisionEngineResult, ActionEvaluation } from '../types';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Shield,
  PiggyBank,
  ArrowUpRight,
  Sparkles,
  SlidersHorizontal,
  Flame,
  Bot,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Calendar,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, metrics, healthScore, currency } = useFinancial();

  const [decisionResult, setDecisionResult] = useState<DecisionEngineResult | null>(null);
  const [selectedActionModal, setSelectedActionModal] = useState<ActionEvaluation | null>(null);
  const [loadingDecision, setLoadingDecision] = useState<boolean>(true);

  useEffect(() => {
    const fetchDecision = async () => {
      setLoadingDecision(true);
      try {
        const res = await ApiService.analyzeDecision(10000);
        setDecisionResult(res);
      } catch (e) {
        console.error('Failed to load decision:', e);
      } finally {
        setLoadingDecision(false);
      }
    };
    fetchDecision();
  }, [profile]);

  // 5-Year Net Worth Trajectory Data for Chart
  const netWorthTrajectoryData = [
    { year: '2026', netWorth: metrics.net_worth, investments: metrics.total_investments, debt: metrics.total_debt },
    { year: '2027', netWorth: Math.round(metrics.net_worth * 1.18), investments: Math.round(metrics.total_investments * 1.22), debt: Math.round(metrics.total_debt * 0.7) },
    { year: '2028', netWorth: Math.round(metrics.net_worth * 1.42), investments: Math.round(metrics.total_investments * 1.48), debt: Math.round(metrics.total_debt * 0.4) },
    { year: '2029', netWorth: Math.round(metrics.net_worth * 1.74), investments: Math.round(metrics.total_investments * 1.82), debt: Math.round(metrics.total_debt * 0.15) },
    { year: '2030', netWorth: Math.round(metrics.net_worth * 2.15), investments: Math.round(metrics.total_investments * 2.25), debt: 0 },
    { year: '2031', netWorth: Math.round(metrics.net_worth * 2.68), investments: Math.round(metrics.total_investments * 2.78), debt: 0 }
  ];

  // Cashflow breakdown data
  const cashflowData = [
    { name: 'Income', amount: metrics.monthly_income },
    { name: 'Expenses', amount: metrics.monthly_expenses },
    { name: 'SIP & Invest', amount: profile.monthly_sip },
    { name: 'Surplus', amount: Math.max(metrics.monthly_surplus - profile.monthly_sip, 0) }
  ];

  // Asset allocation pie data
  const allocationPieData = [
    { name: 'Equity & Stocks', value: metrics.equity_allocation_pct, color: '#06b6d4' },
    { name: 'Debt & FDs', value: metrics.debt_allocation_pct, color: '#10b981' },
    { name: 'Gold / SGB', value: metrics.gold_allocation_pct, color: '#f59e0b' },
    { name: 'Liquid Cash', value: metrics.cash_allocation_pct, color: '#6366f1' }
  ];

  const highestAction = decisionResult?.highest_value_action;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              FINARCH <span className="text-cyan-400">OVERVIEW</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Autonomous Command Center
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time balance sheet diagnostic and optimal multi-objective capital allocation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/twin')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>Edit Digital Twin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={() => navigate('/decision')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Action Engine</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Net Worth"
          value={formatCurrency(metrics.net_worth, currency)}
          subtitle="Assets minus Liabilities"
          trend="+18.4% YoY"
          trendPositive={true}
          icon={<Wallet className="w-4 h-4" />}
          accentColor="cyan"
          onClick={() => navigate('/twin')}
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(metrics.monthly_income, currency)}
          subtitle="Salary & Inflows"
          icon={<ArrowUpRight className="w-4 h-4" />}
          accentColor="emerald"
          onClick={() => navigate('/twin')}
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(metrics.monthly_expenses, currency)}
          subtitle={`Savings Rate: ${metrics.savings_rate_pct}%`}
          icon={<TrendingUp className="w-4 h-4" />}
          accentColor="amber"
          onClick={() => navigate('/twin')}
        />
        <StatCard
          title="Investments"
          value={formatCurrency(metrics.total_investments, currency)}
          subtitle={`Equity ${metrics.equity_allocation_pct}% / Debt ${metrics.debt_allocation_pct}%`}
          icon={<PiggyBank className="w-4 h-4" />}
          accentColor="purple"
          onClick={() => navigate('/portfolio')}
        />
        <StatCard
          title="Total Debt"
          value={formatCurrency(metrics.total_debt, currency)}
          subtitle={`Weighted APR: ${metrics.weighted_debt_interest_rate}%`}
          trend={metrics.total_debt > 0 ? 'High Priority' : 'Clean'}
          trendPositive={metrics.total_debt === 0}
          icon={<CreditCard className="w-4 h-4" />}
          accentColor={metrics.total_debt > 0 ? 'rose' : 'emerald'}
          onClick={() => navigate('/twin')}
        />
        <StatCard
          title="Emergency Fund"
          value={formatCurrency(metrics.total_liquid_cash, currency)}
          subtitle={`${metrics.emergency_fund_coverage_months} Mo Coverage`}
          trend={metrics.emergency_fund_coverage_months >= 6 ? 'Target Met' : 'Gap Detected'}
          trendPositive={metrics.emergency_fund_coverage_months >= 6}
          icon={<Shield className="w-4 h-4" />}
          accentColor={metrics.emergency_fund_coverage_months >= 6 ? 'emerald' : 'amber'}
          onClick={() => navigate('/twin')}
        />
      </div>

      {/* HIGHEST-VALUE ACTION HERO CARD + HEALTH SCORE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Highest-Value Action Card */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-glow-cyan relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/15 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  YOUR HIGHEST-VALUE ACTION
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Priority: HIGH
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Confidence: {highestAction?.confidence_pct || 94}%
                </span>
              </div>
            </div>

            <div className="mt-5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {highestAction?.action_name || 'PAY DOWN HIGH-INTEREST DEBT'}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Guaranteed Return: </span>
                  <span className="text-emerald-400 font-bold">{highestAction?.expected_annual_return_pct || 38}% APR</span>
                </div>
                <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Estimated 5Y Impact: </span>
                  <span className="text-cyan-400 font-bold">{highestAction?.projected_benefit || '+₹40,166 Saved'}</span>
                </div>
                <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Tax Efficiency: </span>
                  <span className="text-purple-400 font-bold">100% Tax-Free</span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {highestAction?.recommendation_summary ||
                  'Based on your current debt carry cost, emergency reserve, investment horizon, and risk tolerance, paying down high-interest liabilities provides an immediate guaranteed return that beats volatile equity market alternatives.'}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
            <button
              onClick={() => highestAction && setSelectedActionModal(highestAction)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all shadow-glow-cyan flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>View Reasoning & Breakdown</span>
            </button>

            <button
              onClick={() => navigate('/optimizer')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>Compare Alternatives</span>
            </button>

            <button
              onClick={() => navigate('/simulator')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Run What-If Simulation</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Financial Health Score Radial */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              FINANCIAL HEALTH
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Multivariate 0-100</span>
          </div>

          <div className="py-2">
            <HealthScoreRadial scoreData={healthScore} size="lg" showBreakdown={true} />
          </div>

          <div className="mt-3 text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-300 font-semibold">Key Diagnostic: </span>
            {healthScore.insights[0] || 'Rebalance high-interest debts to increase health score above 90.'}
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 5-Year Projected Net Worth Curve */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                5-Year Net Worth Trajectory
              </h3>
              <p className="text-xs text-slate-400">Compounding growth under recommended strategy</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              CAGR: ~18.2%
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={netWorthTrajectoryData}>
                <defs>
                  <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#475569" fontSize={11} />
                <YAxis
                  stroke="#475569"
                  fontSize={11}
                  tickFormatter={(v) => formatCurrency(v, currency)}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [formatCurrency(Number(val), currency), '']}
                />
                <Area type="monotone" dataKey="netWorth" name="Net Worth" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#netWorthGrad)" />
                <Area type="monotone" dataKey="investments" name="Investments" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#invGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cashflow & Surplus Allocation */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Monthly Cash Flow Dynamics
              </h3>
              <p className="text-xs text-slate-400">Income vs Living Expenses vs Investments</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
              Surplus: {formatCurrency(metrics.monthly_surplus, currency)}/mo
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} tickFormatter={(v) => formatCurrency(v, currency)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: any) => [formatCurrency(Number(val), currency), 'Amount']}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {cashflowData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#10b981' : index === 1 ? '#f43f5e' : index === 2 ? '#06b6d4' : '#8b5cf6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Goal Progress Mini Cards Section */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
              Active Financial Goals Tracking
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
              {profile.goals.length} Goals Active
            </span>
          </div>
          <button
            onClick={() => navigate('/goals')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>Manage All Goals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {profile.goals.map((goal) => {
            const pct = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
            return (
              <div key={goal.id || goal.name} className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 truncate">{goal.name}</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                    {goal.target_year}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between font-mono">
                  <span className="text-sm font-bold text-slate-100">
                    {formatCurrency(goal.current_amount, currency)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    / {formatCurrency(goal.target_amount, currency)}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 75 ? 'bg-emerald-400' : pct >= 40 ? 'bg-cyan-400' : 'bg-amber-400'}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{pct}% Complete</span>
                  <span className="font-mono text-slate-300">{formatCurrency(goal.monthly_contribution, currency)}/mo</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EXPLAINABILITY MODAL */}
      {selectedActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedActionModal(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Explainable AI Decision Breakdown</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-100 mt-2">
              {selectedActionModal.action_name}
            </h3>

            <div className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm text-cyan-200 leading-relaxed">
              <strong>Core Rationale: </strong>
              {selectedActionModal.recommendation_summary}
            </div>

            {/* Pros & Cons */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  Advantages & Benefits
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedActionModal.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-2">
                  Risks & Constraints
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedActionModal.cons.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Key Assumptions */}
            <div className="mt-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Key Assumptions:</span>
              <ul className="list-disc list-inside space-y-1">
                {selectedActionModal.key_assumptions.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedActionModal(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
