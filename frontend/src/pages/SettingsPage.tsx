import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { MarketKnowledge } from '../types';
import {
  Settings as SettingsIcon,
  Key,
  Database,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Server
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currency, setCurrency, resetDemoProfile, showToast } = useFinancial();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('finarch_ai_key') || '');
  const [marketKnowledge, setMarketKnowledge] = useState<MarketKnowledge | null>(null);

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const k = await ApiService.getMarketKnowledge();
        setMarketKnowledge(k);
      } catch (e) {
        console.error('Failed to get market knowledge', e);
      }
    };
    fetchKnowledge();
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('finarch_ai_key', apiKey.trim());
    showToast('API Key Configured', 'External LLM API Key saved in local storage.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
              SYSTEM CONFIGURATION
            </span>
            <span className="tech-label text-slate-400">PARAMETERS & KNOWLEDGE LAYER</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
            SETTINGS & BENCHMARKS
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LLM Key Config */}
        <div className="fin-panel p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <Key className="w-4 h-4 text-mint-400" />
            <h3 className="text-sm font-bold font-mono text-white">OPTIONAL LLM API CONNECTOR</h3>
          </div>

          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            FINARCH AI operates autonomously using its built-in deterministic engine. You can optionally supply an external OpenAI or Gemini API key to enable experimental reasoning expansions.
          </p>

          <form onSubmit={handleSaveApiKey} className="space-y-3 pt-2">
            <div>
              <label className="tech-label block mb-1 text-slate-300">
                API Key (OpenAI sk-... or Gemini AIzaSy...)
              </label>
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-obsidian-900 border border-white/[0.12] rounded-md px-3.5 py-2 text-white font-mono text-xs focus:border-mint-400 focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-md bg-mint-500 hover:bg-mint-400 text-obsidian-950 font-mono font-bold text-xs shadow-mint-glow transition-all"
              >
                Save API Key
              </button>
            </div>
          </form>
        </div>

        {/* Currency & Demo Reset */}
        <div className="fin-panel p-6 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono text-white">PREFERENCES & BENCHMARK RESET</h3>
          </div>

          <div>
            <label className="tech-label block mb-2 text-slate-300">Display Currency</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`p-2.5 rounded-md border text-xs font-mono font-bold transition-all ${
                  currency === 'INR'
                    ? 'bg-mint-500 text-obsidian-950 border-mint-500'
                    : 'bg-obsidian-900 text-slate-400 border-white/[0.08] hover:text-white'
                }`}
              >
                ₹ Indian Rupee (INR)
              </button>

              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`p-2.5 rounded-md border text-xs font-mono font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-mint-500 text-obsidian-950 border-mint-500'
                    : 'bg-obsidian-900 text-slate-400 border-white/[0.08] hover:text-white'
                }`}
              >
                $ US Dollar (USD)
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold font-mono text-white block">Reset Demo Twin</span>
              <span className="text-[10px] font-mono text-slate-400">Restore benchmark salary & debt profile.</span>
            </div>

            <button
              onClick={resetDemoProfile}
              className="px-3.5 py-1.5 rounded-md bg-obsidian-900 hover:bg-obsidian-850 border border-white/[0.12] text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3 text-mint-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Market Knowledge Layer Section */}
      <div className="fin-panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-mint-400" />
            <h3 className="text-sm font-bold font-mono text-white uppercase">
              MARKET KNOWLEDGE & BENCHMARKS
            </h3>
          </div>
          <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-400">
            {marketKnowledge?.badge || 'Simulated Benchmark Data'}
          </span>
        </div>

        {/* Regulatory Bodies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketKnowledge?.regulatory_bodies.map((reg) => (
            <div key={reg.name} className="p-3.5 rounded-md bg-obsidian-900 border border-white/[0.06] text-xs font-mono space-y-1">
              <span className="font-bold text-white block">{reg.name}</span>
              {reg.key_rate && <span className="text-mint-400 block">{reg.key_rate}</span>}
              {reg.framework && <span className="text-slate-400 block">{reg.framework}</span>}
              {reg.industry_aum && <span className="text-cyan-400 block">AUM: {reg.industry_aum}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
