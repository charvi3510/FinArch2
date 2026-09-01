import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinancial } from '../context/FinancialContext';
import {
  Activity,
  ArrowRight,
  Cpu,
  Shield,
  Layers,
  Sliders,
  Sparkles,
  CheckCircle,
  Terminal,
  Database,
  TrendingUp,
  GitFork
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetDemoProfile } = useFinancial();
  const [selectedCapital, setSelectedCapital] = useState<number>(50000);

  const handleEnterApp = () => {
    navigate('/overview');
  };

  const handleLoadDemo = async () => {
    await resetDemoProfile();
    navigate('/overview');
  };

  const pipelineSteps = [
    { code: '01', title: 'UNDERSTAND', desc: 'Synthesizes total balance sheet, cashflow, debt, and risk into a real-time Digital Twin.' },
    { code: '02', title: 'ANALYZE', desc: 'Evaluates tax drag, expense ratios, debt interest burdens, and opportunity cost matrices.' },
    { code: '03', title: 'COMPARE', desc: 'Ranks competing allocations (Debt vs SIP vs Emergency vs Cash) via Pareto utility.' },
    { code: '04', title: 'SIMULATE', desc: 'Projects 10-year deterministic paths and 1,000 stochastic Monte Carlo market cycles.' },
    { code: '05', title: 'DECIDE', desc: 'Generates mathematically optimal capital action with structured, explainable reasoning.' },
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col justify-between selection:bg-mint-500 selection:text-obsidian-950 font-sans">
      {/* Top Precision Command Bar */}
      <header className="border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-obsidian-900 border border-mint-500/40 flex items-center justify-center text-mint-400">
            <Activity className="w-4 h-4 text-mint-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-base font-extrabold text-white tracking-wider">FINARCH</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-mint-500/10 text-mint-400 border border-mint-500/30 font-bold">
                AI
              </span>
            </div>
            <span className="tech-label text-[9px] text-slate-400 block">FINANCIAL INTELLIGENCE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadDemo}
            className="px-3.5 py-1.5 rounded-md bg-obsidian-900 hover:bg-obsidian-850 border border-white/[0.12] text-xs font-mono text-slate-300 hover:text-white transition-all"
          >
            LOAD DEMO
          </button>
          <button
            onClick={handleEnterApp}
            className="px-4 py-1.5 rounded-md bg-mint-500 hover:bg-mint-400 text-obsidian-950 font-mono font-bold text-xs shadow-mint-glow transition-all flex items-center gap-1.5"
          >
            <span>ENTER FINARCH</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16 space-y-16 flex-1 w-full">
        {/* Editorial Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-900 border border-white/[0.08] text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-mint-500 animate-ping"></span>
            <span>AUTONOMOUS FINANCIAL DECISION ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] font-mono">
            AUTONOMOUS FINANCIAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-400 via-mint-500 to-cyan-400">
              DECISION ENGINE
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            "Your money has competing futures. <br className="hidden sm:inline" />
            <strong className="text-white font-medium">FINARCH calculates which one wins.</strong>"
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleEnterApp}
              className="px-8 py-3.5 rounded-lg bg-mint-500 hover:bg-mint-400 text-obsidian-950 font-mono font-bold text-sm tracking-wider shadow-mint-glow transition-all flex items-center gap-2"
            >
              <span>ENTER FINARCH</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleLoadDemo}
              className="px-7 py-3.5 rounded-lg bg-obsidian-900 hover:bg-obsidian-850 border border-white/[0.15] text-slate-200 font-mono font-semibold text-sm hover:border-mint-500/40 transition-all"
            >
              LOAD DEMO
            </button>
          </div>
        </div>

        {/* SIGNATURE VISUALIZATION: Central Capital Node Branching & Converging */}
        <div className="fin-panel p-6 sm:p-10 relative overflow-hidden grid-pattern">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-8">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-mint-400" />
              <span className="tech-label text-slate-200">REAL-TIME CAPITAL ALLOCATION CONVERGENCE</span>
            </div>
            <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-400">
              SIMULATION ENGINE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Node: Capital Pool */}
            <div className="flex flex-col items-center lg:items-start space-y-3">
              <span className="tech-label">INPUT CAPITAL</span>
              <div className="bg-obsidian-900 border border-white/[0.12] p-5 rounded-xl w-full max-w-xs text-center lg:text-left">
                <span className="text-3xl sm:text-4xl font-mono font-extrabold text-white block">
                  ₹{selectedCapital.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">Surplus Capital Allocation Pool</span>
              </div>
            </div>

            {/* Middle Paths: 5 Competing Allocations */}
            <div className="space-y-2.5">
              <span className="tech-label block text-center lg:text-left">COMPETING FINANCIAL PATHS</span>

              {/* Path 1: Debt */}
              <div className="bg-obsidian-900 border border-mint-500/40 p-3 rounded-lg flex items-center justify-between text-xs font-mono relative overflow-hidden">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-mint-400 animate-pulse"></div>
                  <span className="font-bold text-white">01. DEBT PREPAYMENT</span>
                </div>
                <span className="font-bold text-mint-400">+38% Guaranteed APR</span>
              </div>

              {/* Path 2: Emergency */}
              <div className="bg-obsidian-900/70 border border-white/[0.06] p-2.5 rounded-lg flex items-center justify-between text-xs font-mono text-slate-400">
                <span>02. EMERGENCY RESERVE</span>
                <span>4.6 Mo Buffer</span>
              </div>

              {/* Path 3: Equity SIP */}
              <div className="bg-obsidian-900/70 border border-white/[0.06] p-2.5 rounded-lg flex items-center justify-between text-xs font-mono text-slate-400">
                <span>03. EQUITY SIP COMPOUNDING</span>
                <span>13.5% Expected</span>
              </div>

              {/* Path 4: Fixed Income */}
              <div className="bg-obsidian-900/70 border border-white/[0.06] p-2.5 rounded-lg flex items-center justify-between text-xs font-mono text-slate-400">
                <span>04. FIXED INCOME / SGB</span>
                <span>7.2% Post-Tax</span>
              </div>

              {/* Path 5: Cash */}
              <div className="bg-obsidian-900/70 border border-white/[0.06] p-2.5 rounded-lg flex items-center justify-between text-xs font-mono text-slate-400">
                <span>05. LIQUID CASH</span>
                <span>-5.5% Real Drag</span>
              </div>
            </div>

            {/* Right Node: Optimal Decision Convergence */}
            <div className="flex flex-col items-center lg:items-end space-y-3">
              <span className="tech-label">FINARCH DECISION</span>
              <div className="bg-obsidian-900 border border-mint-500/60 p-6 rounded-xl w-full max-w-xs shadow-mint-glow">
                <div className="flex items-center justify-between mb-2">
                  <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
                    RANK #1 ACTION
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">SCORE: 96.0</span>
                </div>
                <h3 className="text-lg font-bold text-white font-mono">PAY DOWN DEBT</h3>
                <p className="text-xs text-slate-300 mt-2 font-mono leading-relaxed">
                  Liquidating 38% credit card APR yields <strong className="text-mint-400">+₹40,166</strong> risk-free 5Y alpha.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Step Computational Pipeline */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="tech-label text-mint-400">HOW FINARCH COMPUTES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              5-STAGE AUTONOMOUS DECISION PIPELINE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {pipelineSteps.map((s) => (
              <div
                key={s.code}
                className="fin-panel p-5 space-y-3 relative group hover:border-mint-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-mint-400">{s.code}</span>
                  <span className="tech-label text-[9px] text-slate-400">STAGE</span>
                </div>
                <h3 className="text-sm font-bold font-mono text-white tracking-wider">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Technical Footer */}
      <footer className="border-t border-white/[0.08] px-6 py-6 text-center text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>FINARCH AI — Autonomous Financial Intelligence OS</span>
        <span>Built for Hackathon Evaluation • Zero External API Required</span>
      </footer>
    </div>
  );
};
