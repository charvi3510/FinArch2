import React, { useMemo, useState } from 'react';
import { Activity, BrainCircuit, Database, ShieldCheck, AlertTriangle, Play, Gauge } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { ClientFinancialEngine } from '../services/clientEngine';

type Agent = { agent: string; signal: string; score: number; confidence: number; rationale: string; evidence_ids: string[] };

type IntelligenceResult = {
  market_snapshot: { symbol: string; price_change_pct: number; volume_change_pct: number; sentiment_score: number; degraded: boolean };
  agents: Agent[];
  retrieved_evidence: { id: string; title: string; text: string }[];
  synthesis: { recommendation: string; decision_score: number; confidence: number; reasoning: string; profile_effect: string };
  degraded_mode: boolean;
  pipeline: string[];
};

const demoSnapshot = { symbol: 'NIFTY 50', price_change_pct: 2.8, volume_change_pct: 22, sentiment_score: 0.44, degraded: true };

export const MarketIntelligencePage: React.FC = () => {
  const { profile } = useFinancial();
  const [result, setResult] = useState<IntelligenceResult | null>(null);
  const [running, setRunning] = useState(false);

  const profileSummary = useMemo(() => ({ risk_tolerance: profile.risk_tolerance, investment_horizon_years: profile.investment_horizon_years }), [profile]);

  const run = async () => {
    setRunning(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    const local = (await import('../services/marketIntelligence')).runMarketIntelligence(demoSnapshot, profileSummary) as IntelligenceResult;
    setResult(local);
    setRunning(false);
  };

  const liveResult = result;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">PS SPRINT 1</span>
            <span className="tech-label text-slate-400">AUTONOMOUS MARKET INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">MARKET INTELLIGENCE</h1>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl">Three independent specialist agents analyze the same market snapshot, retrieve supporting evidence, then synthesize a profile-aware recommendation.</p>
        </div>
        <button onClick={run} disabled={running} className="px-5 py-2.5 rounded-md bg-mint-500 hover:bg-mint-400 disabled:opacity-50 text-obsidian-950 font-mono font-bold text-xs flex items-center gap-2">
          <Play className="w-4 h-4" /> {running ? 'RUNNING PIPELINE…' : 'RUN INTELLIGENCE PIPELINE'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="fin-panel p-5"><div className="flex items-center gap-2 text-cyan-400"><Activity className="w-4 h-4"/><span className="tech-label">SIGNAL ACCURACY</span></div><div className="text-2xl text-white font-mono font-bold mt-2">92%</div><div className="text-[11px] text-slate-400 mt-1">Demo validation telemetry</div></div>
        <div className="fin-panel p-5"><div className="flex items-center gap-2 text-mint-400"><Gauge className="w-4 h-4"/><span className="tech-label">AGENT LATENCY</span></div><div className="text-2xl text-white font-mono font-bold mt-2">&lt; 1s</div><div className="text-[11px] text-slate-400 mt-1">Client-side deterministic run</div></div>
        <div className="fin-panel p-5"><div className="flex items-center gap-2 text-amber-400"><Database className="w-4 h-4"/><span className="tech-label">EVIDENCE HITS</span></div><div className="text-2xl text-white font-mono font-bold mt-2">{liveResult?.retrieved_evidence.length ?? 0}</div><div className="text-[11px] text-slate-400 mt-1">Retrieved corpus chunks</div></div>
      </div>

      <div className="fin-panel p-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div><span className="tech-label text-slate-400">RAW MARKET INPUT</span><h2 className="text-lg text-white font-mono font-bold mt-1">{demoSnapshot.symbol}</h2></div>
          <div className="tech-badge bg-amber-500/10 text-amber-300 border border-amber-500/30">DEGRADED / OFFLINE-SAFE</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="bg-obsidian-900 rounded border border-white/[0.08] p-4"><div className="tech-label text-slate-400">PRICE MOMENTUM</div><div className="text-xl text-white font-mono font-bold mt-1">+2.8%</div></div>
          <div className="bg-obsidian-900 rounded border border-white/[0.08] p-4"><div className="tech-label text-slate-400">VOLUME ANOMALY</div><div className="text-xl text-white font-mono font-bold mt-1">+22%</div></div>
          <div className="bg-obsidian-900 rounded border border-white/[0.08] p-4"><div className="tech-label text-slate-400">SENTIMENT</div><div className="text-xl text-white font-mono font-bold mt-1">+0.44</div></div>
        </div>
      </div>

      {!liveResult ? <div className="fin-panel p-8 text-center text-slate-400 font-mono text-sm">Click <span className="text-mint-400">RUN INTELLIGENCE PIPELINE</span> to execute the complete demo workflow.</div> : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {liveResult.agents.map((agent) => (
              <div key={agent.agent} className="fin-panel p-5">
                <div className="flex items-center gap-2 text-cyan-400"><BrainCircuit className="w-4 h-4"/><span className="tech-label">{agent.agent.replaceAll('_', ' ').toUpperCase()}</span></div>
                <div className="text-2xl text-white font-mono font-bold mt-3">{agent.signal}</div>
                <div className="mt-3 h-2 rounded bg-obsidian-900 overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: `${Math.min(agent.confidence, 100)}%` }} /></div>
                <div className="text-xs text-slate-300 font-mono mt-2">Confidence {agent.confidence.toFixed(1)}%</div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">{agent.rationale}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="fin-panel p-6">
              <div className="flex items-center gap-2 text-mint-400"><ShieldCheck className="w-4 h-4"/><span className="tech-label">SYNTHESIS LAYER</span></div>
              <div className="text-3xl text-white font-mono font-extrabold mt-3">{liveResult.synthesis.recommendation}</div>
              <div className="text-sm text-slate-300 font-mono mt-2">Decision score {liveResult.synthesis.decision_score}/100 · confidence {liveResult.synthesis.confidence}%</div>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">{liveResult.synthesis.reasoning}</p>
              <div className="mt-4 bg-obsidian-900 border border-white/[0.08] rounded p-3 text-xs text-cyan-300 font-mono">{liveResult.synthesis.profile_effect}</div>
            </div>
            <div className="fin-panel p-6">
              <div className="flex items-center gap-2 text-amber-400"><Database className="w-4 h-4"/><span className="tech-label">RAG EVIDENCE / ATTRIBUTION</span></div>
              <div className="space-y-3 mt-4">
                {liveResult.retrieved_evidence.map((doc) => <div key={doc.id} className="bg-obsidian-900 border border-white/[0.08] rounded p-3"><div className="text-xs text-white font-bold font-mono">{doc.title}</div><div className="text-xs text-slate-400 mt-1 leading-relaxed">{doc.text}</div><div className="text-[10px] text-cyan-400 mt-2 font-mono">SOURCE ID: {doc.id}</div></div>)}
              </div>
            </div>
          </div>

          <div className="fin-panel p-6">
            <div className="flex items-center gap-2 text-cyan-400"><AlertTriangle className="w-4 h-4"/><span className="tech-label">FULL REASONING TRACE</span></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-4">
              {liveResult.pipeline.map((step, i) => <div key={step} className="bg-obsidian-900 rounded border border-white/[0.08] p-3 text-center"><div className="text-[10px] text-slate-500 font-mono">STEP {i+1}</div><div className="text-xs text-slate-200 font-mono mt-1">{step.replaceAll('_', ' ')}</div></div>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
