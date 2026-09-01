import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { ChatResponse } from '../types';
import {
  Cpu,
  Send,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Bot,
  RefreshCw,
  Terminal,
  Activity
} from 'lucide-react';

interface InquiryItem {
  id: string;
  question: string;
  response: ChatResponse;
  timestamp: string;
}

export const AdvisorPage: React.FC = () => {
  const { profile } = useFinancial();
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<string>('local');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('finarch_ai_key') || '');

  const quickQuestions = [
    'Should I invest ₹50,000 or repay my credit card?',
    'Can I afford a ₹3 lakh bike?',
    'Where should I put my next ₹20,000?',
    'How long will it take to build my emergency fund?',
    'Why are you recommending debt repayment over equity?',
  ];

  const [inquiries, setInquiries] = useState<InquiryItem[]>([
    {
      id: 'init-1',
      question: 'Initial Autonomous Twin Diagnostic & Capital Strategy',
      response: {
        recommendation_title: 'PRIMARY FOCUS: LIQUIDATE 38% CREDIT CARD DEBT',
        what: 'Allocate upcoming surplus capital toward 38% revolving credit card liabilities before expanding discretionary equities.',
        why: 'Debt at 38% APR compounds faster than equity markets (12–14% expected return). Paying it off yields an immediate risk-free 38% post-tax return.',
        alternatives_considered: [
          'Increasing Equity SIP by ₹10,000',
          'Locking in Fixed Deposits @ 7.2%',
          'Expanding Emergency Reserve buffer',
        ],
        assumptions: [
          'Emergency coverage of 2.3 months covers basic living expenses',
          'Monthly surplus of ₹55,000 remains steady',
        ],
        risks: [
          'Failure to clear revolving debt adds ~₹9,500 in monthly interest penalties',
        ],
        trade_offs: 'Foregoing short-term equity exposure for immediate guaranteed debt eradication.',
        suggested_followups: [
          'Can I afford a ₹3 lakh bike?',
          'Should I invest ₹50,000 or repay my credit card?',
          'Where should I put my next ₹20,000?',
        ],
        source: 'FINARCH Autonomous Decision Engine',
      },
      timestamp: 'Active Session',
    },
  ]);

  const handleSendQuestion = async (q: string) => {
    if (!q.trim()) return;

    setLoading(true);
    setInputQuestion('');

    try {
      const resp = await ApiService.askAdvisor(q, apiKey, provider);
      const newItem: InquiryItem = {
        id: Math.random().toString(),
        question: q,
        response: resp,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setInquiries((prev) => [newItem, ...prev]);
    } catch (e) {
      console.error('Advisor query failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
              EXPLAINABLE AI ADVISOR
            </span>
            <span className="tech-label text-slate-400">FINANCIAL INTELLIGENCE CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
            DECISION REASONING CONSOLE
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="tech-label text-slate-400">ENGINE:</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="bg-obsidian-900 border border-white/[0.12] rounded-md px-3 py-1.5 text-xs text-mint-400 font-mono focus:border-mint-400 focus:outline-none"
          >
            <option value="local">FINARCH Deterministic (Offline Ready)</option>
            <option value="gemini">Google Gemini 2.0</option>
            <option value="openai">OpenAI GPT-4o</option>
          </select>
        </div>
      </div>

      {/* QUICK INQUIRY CHIPS */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="tech-label text-slate-400 flex items-center gap-1 mr-1">
          <Terminal className="w-3.5 h-3.5 text-mint-400" />
          <span>INQUIRY PRESETS:</span>
        </span>
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSendQuestion(q)}
            disabled={loading}
            className="px-3 py-1 rounded bg-obsidian-900 hover:bg-obsidian-850 border border-white/[0.08] hover:border-mint-500/40 text-slate-300 hover:text-white text-xs font-mono transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* INPUT COMMAND BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuestion(inputQuestion);
        }}
        className="fin-panel p-2 flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Ask FINARCH Decision Engine (e.g. 'Can I afford a ₹3L bike?' or 'Should I invest ₹50k or pay debt?')..."
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2.5 text-white font-mono text-xs sm:text-sm focus:outline-none placeholder:text-slate-500"
        />

        <button
          type="submit"
          disabled={loading || !inputQuestion.trim()}
          className="px-5 py-2.5 rounded-md bg-mint-500 hover:bg-mint-400 disabled:opacity-50 text-obsidian-950 font-mono font-bold text-xs shadow-mint-glow transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>ANALYZE</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* INQUIRY CARDS STREAM: QUESTION → ANALYSIS → DATA → RECOMMENDATION → REASONING */}
      <div className="space-y-6">
        {inquiries.map((inq) => {
          const resp = inq.response;
          return (
            <div
              key={inq.id}
              className="fin-panel p-6 sm:p-8 space-y-6 border border-white/[0.1] relative overflow-hidden"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
                <div className="space-y-1">
                  <span className="tech-label text-mint-400">USER INQUIRY</span>
                  <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                    "{inq.question}"
                  </h3>
                </div>
                <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-400">
                  {inq.timestamp} • {resp.source}
                </span>
              </div>

              {/* FINARCH ANALYSIS & RELEVANT FINANCIAL DATA STRIP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/[0.06]">
                  <span className="tech-label text-slate-400 block">DEBT COST BURDEN</span>
                  <span className="text-base font-mono font-extrabold text-crimson-400 mt-0.5 block">
                    38.0% APR (Revolving)
                  </span>
                </div>
                <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/[0.06]">
                  <span className="tech-label text-slate-400 block">EQUITY MARKET BENCHMARK</span>
                  <span className="text-base font-mono font-extrabold text-cyan-400 mt-0.5 block">
                    13.5% Expected Return
                  </span>
                </div>
                <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/[0.06]">
                  <span className="tech-label text-slate-400 block">EMERGENCY COVERAGE</span>
                  <span className="text-base font-mono font-extrabold text-mint-400 mt-0.5 block">
                    2.3 Months Active Buffer
                  </span>
                </div>
              </div>

              {/* RECOMMENDATION BLOCK (WHAT) */}
              <div className="bg-obsidian-900 p-4 rounded-lg border border-mint-500/40 space-y-1 shadow-mint-glow">
                <span className="tech-label text-mint-400">FINARCH RECOMMENDATION (WHAT)</span>
                <p className="text-sm font-mono font-bold text-white leading-relaxed">{resp.what}</p>
              </div>

              {/* MATHEMATICAL JUSTIFICATION (WHY) */}
              <div className="bg-obsidian-900 p-4 rounded-lg border border-white/[0.08] space-y-1">
                <span className="tech-label text-cyan-400">MATHEMATICAL JUSTIFICATION (WHY)</span>
                <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">{resp.why}</p>
              </div>

              {/* 2-COL: ALTERNATIVES & RISKS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-obsidian-900 p-4 rounded-lg border border-white/[0.06] space-y-2 text-xs font-mono">
                  <span className="tech-label text-slate-400 block">ALTERNATIVES EVALUATED</span>
                  <ul className="space-y-1.5 text-slate-300">
                    {resp.alternatives_considered.map((alt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-slate-500 font-bold">•</span>
                        <span>{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-obsidian-900 p-4 rounded-lg border border-white/[0.06] space-y-2 text-xs font-mono">
                  <span className="tech-label text-crimson-400 block">KEY RISKS & TRADEOFFS</span>
                  <ul className="space-y-1.5 text-slate-300">
                    {resp.risks.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-crimson-400 shrink-0 mt-0.5" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
