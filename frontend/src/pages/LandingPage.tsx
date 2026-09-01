import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFinancial } from '../context/FinancialContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  SlidersHorizontal,
  TrendingUp,
  BrainCircuit,
  Bot,
  Flame,
  CheckCircle,
  BarChart3,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetDemoProfile } = useFinancial();

  const handleLaunchDemo = async () => {
    await resetDemoProfile();
    navigate('/overview');
  };

  const pipelineSteps = [
    { step: '01', name: 'Understand', desc: 'Synthesizes complete income, expenses, debts & goals into a live Digital Twin.', icon: BrainCircuit },
    { step: '02', name: 'Analyze', desc: 'Computes liquidity ratios, debt carry costs, tax liabilities & financial health.', icon: BarChart3 },
    { step: '03', name: 'Compare', desc: 'Weighs competing actions (investing, debt prepayment, emergency reserves) via multi-objective utility scoring.', icon: SlidersHorizontal },
    { step: '04', name: 'Simulate', desc: 'Runs 1,000 Monte Carlo paths and 10-year dual-strategy scenario stress tests.', icon: Flame },
    { step: '05', name: 'Recommend', desc: 'Produces explainable, mathematically verified decisions with WHAT, WHY, and RISKS.', icon: Cpu },
  ];

  const features = [
    {
      title: 'Financial Digital Twin',
      desc: 'Real-time mathematical replication of your assets, liabilities, cash flows, and risk appetite.',
      icon: BrainCircuit,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
    },
    {
      title: 'Opportunity Optimizer',
      desc: 'Multi-objective utility optimization comparing debt payoff vs SIP vs emergency cushions for every available rupee.',
      icon: SlidersHorizontal,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      title: 'What-If Scenario Lab',
      desc: 'Simulate salary hikes, market drops (-20%), loan accelerations, and SIP pauses with dual 10-year trajectories.',
      icon: Flame,
      color: 'from-amber-500/20 to-rose-500/20 text-amber-400 border-amber-500/30'
    },
    {
      title: 'Monte Carlo Stress Test',
      desc: '1,000 stochastic economic cycles providing 10th/50th/90th percentile wealth forecasts and shortfall probabilities.',
      icon: TrendingUp,
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30'
    },
    {
      title: 'Explainable AI Advisor',
      desc: 'Transparent reasoning breaking down exact data-driven WHAT, WHY, ALTERNATIVES, ASSUMPTIONS, and RISKS.',
      icon: Bot,
      color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30'
    },
    {
      title: 'Safety & Suitability Guardrails',
      desc: 'Automated circuit-breakers preventing aggressive speculative risks when emergency reserves are deficient.',
      icon: ShieldCheck,
      color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 bg-radial-grid">
      {/* Top Bar */}
      <header className="h-20 border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold tracking-wider text-slate-100 font-mono text-lg">
              FINARCH<span className="text-cyan-400">.AI</span>
            </span>
            <span className="hidden sm:inline-block ml-3 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Autonomous Decision Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLaunchDemo}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Load Demo Profile
          </button>
          <Link
            to="/overview"
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-glow-cyan">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Don't just invest your money. Make the best financial decision.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 leading-tight">
          YOUR AUTONOMOUS <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            FINANCIAL DECISION ENGINE
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          From fragmented financial choices to one mathematically verified decision. FINARCH AI optimizes your complete balance sheet across investing, debt repayment, emergency buffers, and tax efficiency.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/overview"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all flex items-center gap-2"
          >
            <span>Launch FINARCH</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleLaunchDemo}
            className="px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-100 font-semibold text-sm transition-all"
          >
            Explore Preloaded Demo
          </button>
        </div>

        {/* Interactive Highlight Card */}
        <div className="mt-16 glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-card-elevated text-left max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                Autonomous Engine Output
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
                "Where should your next ₹10,000 go?"
              </h3>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Optimized Recommendation</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Highest-Value Action</span>
              <span className="text-sm font-bold text-cyan-300 mt-1 block">Pay Down High-Interest Debt</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Credit Card @ 38% APR</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Guaranteed 5Y Impact</span>
              <span className="text-sm font-bold text-emerald-400 font-mono mt-1 block">+₹40,166 Saved</span>
              <span className="text-[11px] text-slate-400 mt-1 block">100% Risk-Free Equivalent Yield</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Mathematical Confidence</span>
              <span className="text-sm font-bold text-purple-400 font-mono mt-1 block">94% Confidence</span>
              <span className="text-[11px] text-slate-400 mt-1 block">Multi-Objective Utility Rank #1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Pipeline Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Continuous Pipeline</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 mt-2">
            The Autonomous Financial Decision Pipeline
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            How FINARCH AI transforms raw financial data into verified wealth actions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {pipelineSteps.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.step}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {p.step}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <h4 className="text-base font-bold text-slate-100 mb-2">{p.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
                {idx < 4 && (
                  <div className="hidden lg:flex items-center justify-end mt-4 text-slate-400">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Matrix */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Comprehensive Capabilities</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 mt-2">
            Engineered for Serious Financial Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} border flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800/80 text-center text-xs text-slate-400 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-slate-300 font-bold">
            <span>FINARCH AI</span>
            <span className="text-slate-400">• Hackathon Decision Engine</span>
          </div>
          <div>
            Built with React, TypeScript, Tailwind CSS, FastAPI, and Explainable AI.
          </div>
        </div>
      </footer>
    </div>
  );
};
