import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  Scale,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export const RiskAnalysisPage: React.FC = () => {
  const { profile, metrics, updateProfile, currency } = useFinancial();

  // 6-Axis Radar Metrics
  const radarData = [
    { subject: 'Risk Tolerance', score: profile.risk_tolerance === 'aggressive' ? 85 : profile.risk_tolerance === 'moderate' ? 60 : 35, fullMark: 100 },
    { subject: 'Equity Exposure', score: Math.min(Math.round(((profile.stocks_equity + profile.mutual_funds) / (metrics.total_investments || 1)) * 100), 100), fullMark: 100 },
    { subject: 'Liquidity Cushion', score: Math.min(Math.round((metrics.emergency_fund_coverage_months / 6) * 100), 100), fullMark: 100 },
    { subject: 'Debt Safety', score: Math.max(100 - Math.round(metrics.debt_to_income_pct * 2), 0), fullMark: 100 },
    { subject: 'Diversification', score: 75, fullMark: 100 },
    { subject: 'Time Horizon', score: Math.min(profile.investment_horizon_years * 10, 100), fullMark: 100 },
  ];

  // Risk Matrix Items
  const riskMatrix = [
    {
      title: 'Debt Interest Drag',
      category: 'LIABILITY RISK',
      score: '38% APR',
      level: 'CRITICAL',
      status: 'Crimson',
      impact: 'Credit card interest compounds exponentially against net worth growth.',
    },
    {
      title: 'Equity Market Drawdown',
      category: 'VOLATILITY RISK',
      score: '-18.5% 95% VaR',
      level: 'MODERATE',
      status: 'Amber',
      impact: 'Worst-case 1-year historical drawdown under a 2-standard-deviation market shock.',
    },
    {
      title: 'Emergency Liquidity',
      category: 'CASH RISK',
      score: `${metrics.emergency_fund_coverage_months.toFixed(1)} Months`,
      level: 'MONITORED',
      status: metrics.emergency_fund_coverage_months >= 3 ? 'Mint' : 'Amber',
      impact: 'Buffer covers living expenses in the event of unexpected job or medical disruption.',
    },
    {
      title: 'Portfolio Concentration',
      category: 'ALLOCATION RISK',
      score: '68% Equities',
      level: 'ELEVATED',
      status: 'Amber',
      impact: 'Equity heavy balance sheet requires maintaining fixed income buffers.',
    },
  ];

  const handleUpdateTolerance = (tol: string) => {
    updateProfile({
      ...profile,
      risk_tolerance: tol as any,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
              RISK TOPOLOGY LAB
            </span>
            <span className="tech-label text-slate-400">MULTIVARIATE DOWNSIDE AUDIT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
            RISK ANALYSIS & SUITABILITY
          </h1>
        </div>

        {/* Risk Tolerance Switcher */}
        <div className="flex items-center gap-1 bg-obsidian-900 border border-white/[0.08] p-1 rounded-md text-xs font-mono">
          {['conservative', 'moderate', 'aggressive'].map((t) => (
            <button
              key={t}
              onClick={() => handleUpdateTolerance(t)}
              className={`px-3 py-1 rounded font-bold uppercase transition-all ${
                profile.risk_tolerance === t
                  ? 'bg-mint-500 text-obsidian-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2-COLUMN SPLIT: 6-AXIS RADAR (Left) + RISK MATRIX (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 6-Axis Radar Chart (5 cols) */}
        <div className="lg:col-span-5 fin-panel p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <span className="tech-label text-slate-400">SUITABILITY PROFILE</span>
              <h3 className="text-base font-bold text-white font-mono">6-AXIS RISK RADAR</h3>
            </div>
            <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-300">
              {profile.risk_tolerance.toUpperCase()}
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#222B32" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#323E48" fontSize={9} />
                <Radar
                  name="Risk Profile"
                  dataKey="score"
                  stroke="#00f59b"
                  fill="#00f59b"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0D0F', borderColor: '#222B32', borderRadius: '8px' }}
                  formatter={(val: any) => [`${val}/100`, 'Score']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Matrix Panels (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-2">
            <span className="tech-label text-slate-200">ACTIVE RISK MATRIX</span>
            <span className="tech-label text-slate-400">4 MONITORED VECTORS</span>
          </div>

          {riskMatrix.map((item) => (
            <div
              key={item.title}
              className="fin-panel p-4 space-y-2 group hover:border-white/[0.18] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="tech-label text-slate-400">{item.category}</span>
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    • {item.title}
                  </span>
                </div>
                <span
                  className={`tech-badge ${
                    item.status === 'Crimson'
                      ? 'bg-crimson-500/10 text-crimson-400 border border-crimson-500/30'
                      : item.status === 'Amber'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-mint-500/10 text-mint-400 border border-mint-500/30'
                  }`}
                >
                  {item.level}: {item.score}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-300 leading-relaxed">{item.impact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
