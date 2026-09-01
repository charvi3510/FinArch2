import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { RiskAssessment } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  Activity
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
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const twin = await ApiService.getFinancialTwin();
        setAssessment(twin.risk_assessment);
      } catch (e) {
        console.error('Failed to get risk:', e);
      }
    };
    fetchRisk();
  }, [profile]);

  const radarData = assessment
    ? Object.entries(assessment.radar_metrics).map(([key, val]) => ({
        subject: key,
        value: val,
        fullMark: 100
      }))
    : [];

  const handleToleranceChange = async (tol: 'conservative' | 'moderate' | 'aggressive') => {
    await updateProfile({
      ...profile,
      risk_tolerance: tol
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              RISK <span className="text-cyan-400">ANALYSIS</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              6-Axis Multidimensional
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluate portfolio risk suitability against stated risk appetite, tail risks, and liquidity buffers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['conservative', 'moderate', 'aggressive'].map((t) => (
            <button
              key={t}
              onClick={() => handleToleranceChange(t as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                profile.risk_tolerance === t
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Alignment Diagnostic Banner */}
      <div
        className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          assessment?.risk_alignment === 'ALIGNED'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}
      >
        <div className="flex items-start gap-3">
          {assessment?.risk_alignment === 'ALIGNED' ? (
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider block">
              Portfolio Suitability Status
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
              {assessment?.risk_alignment === 'ALIGNED'
                ? 'Portfolio Risk is Well-Aligned'
                : 'Risk Profile Mismatch Detected'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {assessment?.summary ||
                `Your stated risk profile is '${profile.risk_tolerance}'. Your actual calculated portfolio risk score is ${assessment?.actual_portfolio_risk_score}/100.`}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="p-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Stated Tolerance</span>
            <span className="text-base font-bold text-cyan-400">{assessment?.stated_tolerance_score}/100</span>
          </div>
          <div className="p-3 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase block">Actual Risk</span>
            <span className="text-base font-bold text-purple-400">{assessment?.actual_portfolio_risk_score}/100</span>
          </div>
        </div>
      </div>

      {/* Radar Chart + Downside Stress Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart (6 Cols) */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
              6-Axis Risk Profile Mapping
            </h3>
            <span className="text-xs font-mono text-cyan-400">Multivariate Polar Grid</span>
          </div>

          <div className="w-full h-80 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Radar name="Profile Score" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            Higher values indicate stronger resilience across volatility, liquidity, and debt safety.
          </div>
        </div>

        {/* Downside Stress Tests & Tail Risk (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider pb-3 border-b border-slate-800">
              Downside Market Stress Tests (Historical Calibration)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Severe Market Correction (-25% Shock)</span>
                  <span className="text-[11px] text-slate-400">Simulates 2008 / 2020 economic shock</span>
                </div>
                <span className="text-sm font-mono font-bold text-rose-400">
                  -{formatCurrency(metrics.total_investments * 0.22, currency)}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Interest Rate Spike (+200 bps)</span>
                  <span className="text-[11px] text-slate-400">Impact on floating-rate personal & auto loans</span>
                </div>
                <span className="text-sm font-mono font-bold text-amber-400">
                  +₹{Math.round(metrics.total_debt * 0.02 / 12)}/mo EMI
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">95% Monthly Value at Risk (VaR)</span>
                  <span className="text-[11px] text-slate-400">Maximum expected loss at 95% confidence level</span>
                </div>
                <span className="text-sm font-mono font-bold text-purple-400">
                  {formatCurrency(assessment?.value_at_risk_95_pct || 0, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Mitigation Recommendations */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-wider pb-3 border-b border-slate-800">
              Risk Mitigation Recommendations
            </h3>

            <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
              {assessment?.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
