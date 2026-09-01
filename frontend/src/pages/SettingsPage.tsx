import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { MarketKnowledge } from '../types';
import {
  Settings,
  Key,
  Database,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Server,
  BookOpen,
  Info,
  CheckCircle2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currency, setCurrency, resetDemoProfile, isBackendConnected, showToast } = useFinancial();
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
    showToast('API Key Saved', 'External LLM API Key successfully configured in browser.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
            SYSTEM <span className="text-cyan-400">SETTINGS</span>
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Configuration & Knowledge Layer
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage API keys, currency formatting, benchmark knowledge layers, and demo data presets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LLM API Key Configuration */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">AI Model & API Key Configuration</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            FINARCH AI operates 100% autonomously using its built-in deterministic financial engine without requiring external APIs. You can optionally supply an API key to enable experimental conversational LLM features.
          </p>

          <form onSubmit={handleSaveApiKey} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Optional LLM API Key (OpenAI / Gemini)
              </label>
              <input
                type="password"
                placeholder="sk-... or AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-xs focus:border-cyan-400 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Saved securely in browser local storage. Never committed or sent to third-party tracking.
              </span>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
              >
                Save Key
              </button>
            </div>
          </form>
        </div>

        {/* Preferences & Demo Profile Reset */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Database className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Preferences & Demo Data Management</h3>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Display Currency</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  currency === 'INR'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>₹ Indian Rupee (INR)</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  currency === 'USD'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>$ US Dollar (USD)</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Reset Demo Profile</span>
              <span className="text-[11px] text-slate-400">Restore default ₹1.2L income & ₹3L debt benchmark user.</span>
            </div>

            <button
              onClick={resetDemoProfile}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Market Knowledge Layer Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-mono uppercase tracking-wider">
              Market & Regulatory Knowledge Layer
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {marketKnowledge?.badge || 'Demo Data - Simulated Benchmarks'}
          </span>
        </div>

        {/* Regulatory Bodies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketKnowledge?.regulatory_bodies.map((reg) => (
            <div key={reg.name} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-100 block">{reg.name}</span>
              {reg.key_rate && <span className="text-cyan-400 block font-mono">{reg.key_rate}</span>}
              {reg.framework && <span className="text-slate-400 block">{reg.framework}</span>}
              {reg.industry_aum && <span className="text-emerald-400 block font-mono">AUM: {reg.industry_aum}</span>}
            </div>
          ))}
        </div>

        {/* Benchmark Historical Returns Table */}
        <div>
          <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block mb-3">
            Simulated Historical Benchmark Returns
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-[10px] uppercase font-mono text-slate-400">
                <tr>
                  <th className="p-3 rounded-l-xl">Asset Class</th>
                  <th className="p-3">5Y CAGR</th>
                  <th className="p-3">10Y CAGR</th>
                  <th className="p-3">Annual Volatility</th>
                  <th className="p-3 rounded-r-xl">Risk Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {marketKnowledge?.benchmark_returns_history.map((bm) => (
                  <tr key={bm.asset_class} className="hover:bg-slate-900/40">
                    <td className="p-3 font-sans font-semibold text-slate-200">{bm.asset_class}</td>
                    <td className="p-3 text-emerald-400">+{bm.cagr_5y}%</td>
                    <td className="p-3 text-cyan-400">+{bm.cagr_10y}%</td>
                    <td className="p-3 text-slate-400">{bm.volatility_annual}%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                        {bm.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
