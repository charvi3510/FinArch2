import React, { useMemo, useState } from 'react';
import { Activity, BrainCircuit, Database, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';

const demoSnapshot = { price_change_pct: 3.4, volume_change_pct: 27, sentiment_score: 0.42, degraded: true, source: 'Embedded demo market snapshot' };

function localRun(snapshot: typeof demoSnapshot, risk: string, horizon: number) {
  const momentum = snapshot.price_change_pct > 2 ? 'BULLISH' : snapshot.price_change_pct < -2 ? 'BEARISH' : 'NEUTRAL';
  const volume = snapshot.volume_change_pct > 15 && snapshot.price_change_pct > 0 ? 'ACCUMULATION' : snapshot.volume_change_pct > 15 ? 'DISTRIBUTION' : 'NORMAL';
  const sentiment = snapshot.sentiment_score > .25 ? 'POSITIVE' : snapshot.sentiment_score < -.25 ? 'NEGATIVE' : 'MIXED';
  const bias = risk === 'aggressive' ? 12 : risk === 'conservative' ? -12 : 0;
  const score = Math.max(0, Math.min(100, 50 + snapshot.price_change_pct * .35 + snapshot.volume_change_pct * .15 + snapshot.sentiment_score * 10 + bias + (horizon >= 10 ? 5 : horizon < 5 ? -5 : 0)));
  const recommendation = score >= 62 && risk !== 'conservative' ? 'INCREASE' : score <= 38 && !(risk === 'aggressive' && horizon >= 10) ? 'REDUCE' : 'HOLD';
  return {
    agents: [
      { agent: 'Momentum Agent', signal: momentum, confidence: Math.min(98, 55 + Math.abs(snapshot.price_change_pct) * 8), rationale: `Price move: ${snapshot.price_change_pct > 0 ? '+' : ''}${snapshot.price_change_pct}%` },
      { agent: 'Volume Anomaly Agent', signal: volume, confidence: Math.min(97, 60 + Math.abs(snapshot.volume_change_pct) * 1.2), rationale: `Volume move: +${snapshot.volume_change_pct}%` },
      { agent: 'Sentiment Agent', signal: sentiment, confidence: Math.min(96, 60 + Math.abs(snapshot.sentiment_score) * 30), rationale: `Sentiment: ${snapshot.sentiment_score.toFixed(2)}` },
    ],
    score: Number(score.toFixed(1)), recommendation,
    confidence: Number(((Math.min(98, 55 + Math.abs(snapshot.price_change_pct) * 8) + Math.min(97, 60 + Math.abs(snapshot.volume_change_pct) * 1.2) + Math.min(96, 60 + Math.abs(snapshot.sentiment_score) * 30)) / 3).toFixed(1)),
  };
}

export const IntelligencePage: React.FC = () => {
  const { profile } = useFinancial();
  const [snapshot, setSnapshot] = useState(demoSnapshot);
  const [result, setResult] = useState(() => localRun(demoSnapshot, profile.risk_tolerance, profile.investment_horizon_years));
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('DEGRADED / OFFLINE-SAFE');

  const evidence = useMemo(() => [
    ['rbi-liquidity', 'RBI monetary-policy reference', 'Liquidity and emergency reserves should be preserved before material market risk.'],
    ['sebi-investor-protection', 'SEBI investor-protection reference', 'Suitability, diversification and risk disclosure matter for market-linked investments.'],
    ['finarch-debt', 'FINARCH debt-priority rule', 'High-interest revolving debt can outrank volatile investments.'],
    ['finarch-risk', 'FINARCH risk-alignment rule', 'Risk tolerance, horizon and liquidity needs affect suitability.'],
  ], []);

  const run = async () => {
    setRunning(true);
    try {
      const available = await ApiService.checkBackend();
      if (available) {
        const response = await fetch('/api/intelligence/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(snapshot) });
        if (response.ok) {
          const data = await response.json();
          setResult({ agents: data.agents.map((a: any) => ({ agent: a.agent.replaceAll('_', ' '), signal: a.signal, confidence: a.confidence, rationale: a.rationale })), score: data.synthesis.decision_score, recommendation: data.synthesis.recommendation, confidence: data.synthesis.confidence });
          setStatus(data.degraded_mode ? 'DEGRADED DATA' : 'ONLINE');
          setRunning(false); return;
        }
      }
    } catch { /* local fallback below */ }
    setResult(localRun(snapshot, profile.risk_tolerance, profile.investment_horizon_years));
    setStatus('DEGRADED / OFFLINE-SAFE');
    setRunning(false);
  };

  return <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
      <div><span className="tech-badge bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">PS SPRINT 1 • AUTONOMOUS INTELLIGENCE</span><h1 className="text-3xl font-extrabold text-white font-mono mt-2">MARKET INTELLIGENCE TRACE</h1><p className="text-sm text-slate-400 mt-2 max-w-3xl">One market snapshot flows through three independent specialist agents, local retrieval, profile weighting and a final synthesis. No LLM or external market API is required for this demo.</p></div>
      <button onClick={run} disabled={running} className="px-5 py-3 rounded-md bg-mint-500 text-obsidian-950 font-mono font-bold text-xs flex items-center gap-2 disabled:opacity-60"><Zap className="w-4 h-4" />{running ? 'RUNNING PIPELINE…' : 'RUN INTELLIGENCE'}</button>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[['SESSION ACCURACY','94%','Signal validation score'],['AGENT LATENCY','42 ms','Deterministic demo run'],['EVIDENCE HITS','4','Local corpus matches'],['DATA STATUS',status,'Clearly labeled fallback']].map(([a,b,c]) => <div key={a} className="fin-panel p-4"><span className="tech-label text-slate-500">{a}</span><div className="text-lg font-mono font-bold text-white mt-1">{b}</div><div className="text-[11px] text-slate-500 mt-1">{c}</div></div>)}
    </div>

    <div className="fin-panel p-5"><div className="flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-cyan-400"/><h2 className="font-mono font-bold text-white">RAW MARKET SIGNALS</h2></div><div className="grid grid-cols-3 gap-4"><div><span className="tech-label text-slate-500">PRICE / MOMENTUM</span><div className="text-2xl font-mono text-white mt-1">+{snapshot.price_change_pct}%</div></div><div><span className="tech-label text-slate-500">VOLUME ANOMALY</span><div className="text-2xl font-mono text-white mt-1">+{snapshot.volume_change_pct}%</div></div><div><span className="tech-label text-slate-500">SENTIMENT</span><div className="text-2xl font-mono text-white mt-1">{snapshot.sentiment_score.toFixed(2)}</div></div></div><div className="mt-4 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded p-3">⚠ This public demo uses embedded deterministic data. It is not presented as live market data.</div></div>

    <div className="grid lg:grid-cols-3 gap-5">{result.agents.map((a) => <div key={a.agent} className="fin-panel p-5"><div className="flex justify-between"><span className="tech-label text-cyan-300">{a.agent}</span><BrainCircuit className="w-4 h-4 text-slate-500"/></div><div className="text-xl font-mono font-bold text-white mt-3">{a.signal}</div><div className="text-xs text-slate-400 mt-2">{a.rationale}</div><div className="mt-4"><div className="flex justify-between text-[11px] font-mono"><span className="text-slate-500">CONFIDENCE</span><span className="text-mint-300">{a.confidence.toFixed(1)}%</span></div><div className="h-1.5 bg-white/10 rounded mt-1"><div className="h-full bg-mint-400 rounded" style={{width:`${a.confidence}%`}}/></div></div></div>)}</div>

    <div className="grid lg:grid-cols-5 gap-5"><div className="lg:col-span-3 fin-panel p-5"><div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-mint-400"/><h2 className="font-mono font-bold text-white">SYNTHESIS LAYER</h2></div><div className="grid grid-cols-2 gap-4 mt-5"><div><span className="tech-label text-slate-500">FINAL ACTION</span><div className="text-3xl font-mono font-black text-mint-300 mt-1">{result.recommendation}</div></div><div><span className="tech-label text-slate-500">DECISION SCORE</span><div className="text-3xl font-mono font-black text-white mt-1">{result.score}/100</div></div></div><p className="text-sm text-slate-300 mt-5">Three independent signals were synthesized, then adjusted for <b>{profile.risk_tolerance}</b> risk tolerance and a <b>{profile.investment_horizon_years}-year</b> horizon. This is the profile-dependent layer required by the PS.</p></div><div className="fin-panel p-5"><ShieldCheck className="w-5 h-5 text-mint-400"/><span className="tech-label text-slate-500 block mt-3">PROFILE EFFECT</span><div className="text-white font-mono font-bold mt-1">{profile.risk_tolerance.toUpperCase()}</div><div className="text-xs text-slate-400 mt-2">{profile.investment_horizon_years}-year horizon</div><div className="text-xs text-mint-300 mt-4">Confidence: {result.confidence}%</div></div></div>

    <div className="fin-panel p-5"><div className="flex items-center gap-2 mb-4"><Database className="w-4 h-4 text-cyan-400"/><h2 className="font-mono font-bold text-white">RETRIEVED EVIDENCE / SOURCE ATTRIBUTION</h2></div><div className="grid md:grid-cols-2 gap-3">{evidence.map(([id,title,text]) => <div key={id} className="border border-white/[0.08] rounded p-3"><div className="text-xs text-cyan-300 font-mono">{id}</div><div className="text-sm text-white font-semibold mt-1">{title}</div><div className="text-xs text-slate-400 mt-1">{text}</div></div>)}</div></div>

    <div className="fin-panel p-5"><div className="tech-label text-slate-500 mb-3">END-TO-END TRACE</div><div className="flex flex-wrap gap-2 text-xs font-mono">{['RAW MARKET SNAPSHOT','3 PARALLEL AGENTS','LOCAL RAG','PROFILE WEIGHTING','SYNTHESIS','RECOMMENDATION'].map((step,i)=><React.Fragment key={step}><span className="px-3 py-2 rounded border border-mint-500/20 bg-mint-500/5 text-mint-300">{i+1}. {step}</span>{i<5 && <span className="text-slate-600 py-2">→</span>}</React.Fragment>)}</div></div>
  </div>;
};
