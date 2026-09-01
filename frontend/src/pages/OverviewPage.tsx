import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { StatCard } from '../components/common/StatCard';
import { HealthScoreRadial } from '../components/common/HealthScoreRadial';
import { ActionEvaluation } from '../types';
import {
  TrendingUp,
  Shield,
  CreditCard,
  Target,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  Zap,
  Activity,
  CheckCircle2,
  X,
  Cpu
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

export const OverviewPage: React.FC = () => {
  const { profile, metrics, healthScore, currency } = useFinancial();
  const navigate = useNavigate();

  const [highestAction, setHighestAction] = useState<ActionEvaluation | null>(null);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);

  useEffect(() => {
    const fetchTopAction = async () => {
      try {
        const result = await ApiService.analyzeDecision(50000);
        setHighestAction(result.highest_value_action);
      } catch (e) {
        console.error('Failed to fetch top action', e);
      }
    };
    fetchTopAction();
  }, [profile]);

  // Integrated 5Y Net Worth Trajectory Data
  const netWorthTrajectoryData = [
    { year: 'Today', netWorth: metrics.net_worth, base: metrics.net_worth },
    { year: 'Year 1', netWorth: Math.round(metrics.net_worth + metrics.monthly_surplus * 12 * 1.08), base: metrics.net_worth * 1.06 },
    { year: 'Year 2', netWorth: Math.round(metrics.net_worth + metrics.monthly_surplus * 24 * 1.18), base: metrics.net_worth * 1.14 },
    { year: 'Year 3', netWorth: Math.round(metrics.net_worth + metrics.monthly_surplus * 36 * 1.30), base: metrics.net_worth * 1.23 },
    { year: 'Year 4', netWorth: Math.round(metrics.net_worth + metrics.monthly_surplus * 48 * 1.45), base: metrics.net_worth * 1.33 },
    { year: 'Year 5', netWorth: Math.round(metrics.net_worth + metrics.monthly_surplus * 60 * 1.62), base: metrics.net_worth * 1.45 },
  ];

  // Cashflow Matrix Data
  const cashflowData = [
    { name: 'Income', amount: metrics.monthly_income, color: '#00f59b' },
    { name: 'Expenses', amount: metrics.monthly_expenses, color: '#f43f5e' },
    { name: 'Investments', amount: profile.monthly_sip, color: '#22d3ee' },
    { name: 'Surplus', amount: Math.max(metrics.monthly_surplus, 0), color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
              AUTONOMOUS EXECUTIVE VIEW
            </span>
            <span className="tech-label text-slate-400">FINANCIAL COMMAND</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mt-1">
            EXECUTIVE DASHBOARD
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/twin')}
            className="px-3.5 py-1.5 rounded-md bg-obsidian-900 hover:bg-obsidian-850 border border-white/[0.12] text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-mint-400" />
            <span>Digital Twin</span>
          </button>
          <button
            onClick={() => navigate('/decision')}
            className="px-4 py-1.5 rounded-md bg-mint-500 hover:bg-mint-400 text-obsidian-950 font-mono font-bold text-xs shadow-mint-glow transition-all flex items-center gap-1.5"
          >
            <span>Decision Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TOP STATS STRIP: 4 Monolithic Panels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="NET WORTH"
          value={formatCurrency(metrics.net_worth, currency)}
          subtitle="Assets minus total debt"
          accentColor="mint"
          onClick={() => navigate('/twin')}
        />
        <StatCard
          title="MONTHLY SURPLUS"
          value={formatCurrency(metrics.monthly_surplus, currency)}
          subtitle={`${metrics.savings_rate_pct}% savings rate`}
          accentColor="mint"
          onClick={() => navigate('/twin')}
        />
        <StatCard
          title="TOTAL LIABILITIES"
          value={formatCurrency(metrics.total_debt, currency)}
          subtitle={`${metrics.debt_to_income_pct}% Debt-to-Income`}
          accentColor="crimson"
          onClick={() => navigate('/twin')}
        />
        <StatCard
          title="EMERGENCY BUFFER"
          value={`${metrics.emergency_fund_coverage_months.toFixed(1)} Mo`}
          subtitle="Target: 6.0 Months"
          accentColor={metrics.emergency_fund_coverage_months >= 6 ? 'mint' : 'amber'}
          onClick={() => navigate('/twin')}
        />
      </div>

      {/* HIGHEST-VALUE ACTION HERO + FINANCIAL HEALTH ARC METER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Autonomous Highest-Value Action Hero Card */}
        <div className="lg:col-span-2 fin-panel-accent p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mint-400 animate-ping"></span>
                <span className="tech-label text-mint-400">YOUR HIGHEST-VALUE ACTION</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="tech-badge bg-crimson-500/10 text-crimson-400 border border-crimson-500/30">
                  PRIORITY: HIGH
                </span>
                <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
                  CONFIDENCE: {highestAction?.confidence_pct || 94}%
                </span>
              </div>
            </div>

            <div className="mt-5">
              <span className="tech-label text-slate-400">RECOMMENDED ALLOCATION: ₹50,000</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
                {highestAction?.action_name || 'PAY DOWN HIGH-INTEREST DEBT'}
              </h2>

              {/* 3 Impact Badges */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-obsidian-900 border border-white/[0.08] p-3 rounded-lg">
                  <span className="tech-label text-slate-400 block">GUARANTEED RETURN</span>
                  <span className="text-lg font-mono font-extrabold text-mint-400 mt-0.5 block">
                    {highestAction?.expected_annual_return_pct || 38}% APR
                  </span>
                </div>
                <div className="bg-obsidian-900 border border-white/[0.08] p-3 rounded-lg">
                  <span className="tech-label text-slate-400 block">5-YEAR ALPHA IMPACT</span>
                  <span className="text-lg font-mono font-extrabold text-cyan-400 mt-0.5 block">
                    {highestAction?.projected_benefit || '+₹40,166 Saved'}
                  </span>
                </div>
                <div className="bg-obsidian-900 border border-white/[0.08] p-3 rounded-lg">
                  <span className="tech-label text-slate-400 block">DEBT DURATION</span>
                  <span className="text-lg font-mono font-extrabold text-white mt-0.5 block">
                    -14 Months
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-slate-300 font-mono leading-relaxed bg-obsidian-900/60 p-3.5 rounded border border-white/[0.05]">
                {highestAction?.recommendation_summary ||
                  'Eliminating revolving credit card debt @ 38% APR yields guaranteed post-tax returns far surpassing market equities without exposing capital to drawdown.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setIsWhyModalOpen(true)}
              className="px-4 py-2 rounded-md bg-obsidian-900 hover:bg-obsidian-850 border border-white/[0.15] text-xs font-mono font-bold text-mint-400 hover:border-mint-500/40 transition-all flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>WHY THIS WINS</span>
            </button>

            <button
              onClick={() => navigate('/decision')}
              className="px-5 py-2 rounded-md bg-mint-500 hover:bg-mint-400 text-obsidian-950 font-mono font-bold text-xs shadow-mint-glow transition-all flex items-center gap-1.5"
            >
              <span>EXECUTE IN DECISION ENGINE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: Financial Health Arc Meter */}
        <div className="fin-panel p-6 sm:p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <span className="tech-label text-slate-200">FINANCIAL HEALTH</span>
            <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-mint-400">
              REAL-TIME
            </span>
          </div>

          <div className="my-auto py-2">
            <HealthScoreRadial scoreData={healthScore} size="lg" showBreakdown={true} />
          </div>

          <div className="pt-3 border-t border-white/[0.08] text-center">
            <button
              onClick={() => navigate('/twin')}
              className="text-xs font-mono text-slate-400 hover:text-mint-400 transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <span>Inspect Balance Sheet Factors</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* INTEGRATED DATA PANELS: 5Y Trajectory Area & Cashflow Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 5-Year Wealth Trajectory (2 Cols) */}
        <div className="lg:col-span-2 fin-panel p-6 sm:p-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
            <div>
              <span className="tech-label text-slate-400">PROJECTED ACCUMULATION</span>
              <h3 className="text-base font-bold text-white font-mono">5-YEAR WEALTH TRAJECTORY</h3>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-mint-500"></span>
                <span className="text-slate-300">Optimal Allocation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                <span className="text-slate-400">Baseline</span>
              </div>
            </div>
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={netWorthTrajectoryData}>
                <defs>
                  <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f59b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f59b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#4A5B68" fontSize={11} />
                <YAxis stroke="#4A5B68" fontSize={11} tickFormatter={(v) => formatCurrency(v, currency)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0D0F', borderColor: '#222B32', borderRadius: '8px' }}
                  formatter={(val: any) => [formatCurrency(Number(val), currency), '']}
                />
                <Area type="monotone" dataKey="netWorth" name="Optimal" stroke="#00f59b" strokeWidth={2} fill="url(#optGrad)" />
                <Area type="monotone" dataKey="base" name="Baseline" stroke="#4A5B68" strokeDasharray="3 3" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Matrix (1 Col) */}
        <div className="fin-panel p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <span className="tech-label text-slate-400">MONTHLY INFLOW / OUTFLOW</span>
              <h3 className="text-base font-bold text-white font-mono">CASH FLOW MATRIX</h3>
            </div>
            <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-300">
              ₹{metrics.monthly_income.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {cashflowData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-medium">{item.name}</span>
                  <span className="font-bold text-white">{formatCurrency(item.amount, currency)}</span>
                </div>
                <div className="w-full h-1.5 bg-obsidian-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: item.color,
                      width: `${Math.min((item.amount / metrics.monthly_income) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">Net Monthly Savings:</span>
            <span className="font-extrabold text-mint-400">+{formatCurrency(metrics.monthly_surplus, currency)}/mo</span>
          </div>
        </div>
      </div>

      {/* WHY THIS WINS MODAL */}
      {isWhyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fin-panel p-6 sm:p-8 max-w-2xl w-full border border-mint-500/40 space-y-6 shadow-mint-glow animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-mint-400" />
                <h3 className="text-lg font-bold font-mono text-white">
                  AUTONOMOUS DECISION REASONING
                </h3>
              </div>
              <button
                onClick={() => setIsWhyModalOpen(false)}
                className="p-1 rounded bg-obsidian-900 border border-white/[0.08] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
              <div className="bg-obsidian-900 p-4 rounded-lg border border-white/[0.08]">
                <span className="tech-label text-mint-400 block mb-1">1. Mathematical Superiority</span>
                <p>
                  At <strong className="text-white">38% APR</strong>, paying off revolving credit card debt produces a guaranteed, risk-free post-tax yield of 38%. Even top-quartile equity funds (13–15% expected) cannot overcome this compounding drag.
                </p>
              </div>

              <div className="bg-obsidian-900 p-4 rounded-lg border border-white/[0.08]">
                <span className="tech-label text-cyan-400 block mb-1">2. Liquidity Cushion Status</span>
                <p>
                  Emergency reserve coverage is currently at <strong className="text-white">{metrics.emergency_fund_coverage_months.toFixed(1)} months</strong>, satisfying basic circuit breakers and permitting aggressive debt liquidation.
                </p>
              </div>

              <div className="bg-obsidian-900 p-4 rounded-lg border border-white/[0.08]">
                <span className="tech-label text-amber-400 block mb-1">3. Opportunity Cost Comparison</span>
                <p>
                  Investing ₹50,000 in equity yields ~₹87,000 over 5 years. Retaining 38% debt accrues ~₹1,27,000 in interest penalties. Net advantage to debt payoff: <strong className="text-mint-400">+₹40,166</strong>.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setIsWhyModalOpen(false)}
                className="px-5 py-2 rounded-md bg-mint-500 text-obsidian-950 font-mono font-bold text-xs"
              >
                Close Reasoning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
