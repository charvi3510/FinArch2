import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Menu, RotateCcw, Database, Shield, Radio } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currency, setCurrency, resetDemoProfile, isLoading } = useFinancial();

  return (
    <header className="h-14 bg-obsidian-950/90 backdrop-blur-md border-b border-white/[0.08] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Trigger & Twin Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-md bg-obsidian-900 border border-white/[0.08] text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-obsidian-900 border border-white/[0.08]">
          <Radio className="w-3 h-3 text-mint-400 animate-pulse" />
          <span className="tech-label text-[10px] text-slate-300">TWIN MODEL:</span>
          <span className="font-mono text-[10px] font-bold text-mint-400">ACTIVE & SYNCED</span>
        </div>
      </div>

      {/* Right Actions: Currency Toggle & Reset Demo */}
      <div className="flex items-center gap-3">
        {/* Currency Switcher */}
        <div className="flex items-center rounded-md bg-obsidian-900 border border-white/[0.08] p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setCurrency('INR')}
            className={`px-2.5 py-1 rounded font-bold transition-all ${
              currency === 'INR'
                ? 'bg-mint-500 text-obsidian-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ₹ INR
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-2.5 py-1 rounded font-bold transition-all ${
              currency === 'USD'
                ? 'bg-mint-500 text-obsidian-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            $ USD
          </button>
        </div>

        {/* Load Demo Profile Button */}
        <button
          onClick={resetDemoProfile}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-md bg-obsidian-900 hover:bg-obsidian-850 border border-white/[0.12] hover:border-mint-500/40 text-slate-200 hover:text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-mint-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Load Demo Profile</span>
          <span className="sm:hidden">Demo</span>
        </button>
      </div>
    </header>
  );
};
