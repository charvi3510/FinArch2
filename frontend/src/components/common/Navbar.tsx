import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Sparkles, RefreshCw, Activity, DollarSign, Menu, Server } from 'lucide-react';

interface Props {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<Props> = ({ onToggleSidebar }) => {
  const { healthScore, currency, setCurrency, resetDemoProfile, isBackendConnected, isLoading } = useFinancial();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Autonomous Financial Decision Engine</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live Twin Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend status indicator */}
        <div
          title={isBackendConnected ? 'FastAPI Backend Online' : 'Running on Embedded Client AI Engine'}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono"
        >
          <Server className={`w-3.5 h-3.5 ${isBackendConnected ? 'text-emerald-400' : 'text-cyan-400'}`} />
          <span className="text-slate-400">{isBackendConnected ? 'FastAPI' : 'Client Engine'}</span>
        </div>

        {/* Currency Switcher */}
        <button
          onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono font-medium text-slate-300 transition-colors"
          title="Switch currency display"
        >
          <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currency}</span>
        </button>

        {/* Load Demo Profile Button */}
        <button
          onClick={resetDemoProfile}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-all shadow-glow-cyan"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Load Demo Profile</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {/* Financial Health Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Health:</span>
            <span className="font-mono text-xs font-bold text-emerald-400">{healthScore.overall_score}/100</span>
          </div>
        </div>
      </div>
    </header>
  );
};
