import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { ChatResponse } from '../types';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface ChatItem {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  response?: ChatResponse;
  timestamp: string;
}

export const AdvisorPage: React.FC = () => {
  const { profile } = useFinancial();
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<string>('local');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('finarch_ai_key') || '');

  const quickQuestions = [
    'Where should I put my next ₹20,000?',
    'Should I invest or repay my loan?',
    'Can I afford a ₹3 lakh bike?',
    'How long will it take to build my emergency fund?',
    'Why are you recommending debt repayment?',
    'How risky is my portfolio?',
    'How much should I invest every month?'
  ];

  // Initial welcome message with pre-populated diagnostics
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: "Hello! I am FINARCH AI, your Explainable Financial Reasoning Agent. I have full real-time access to your Financial Digital Twin. Ask me anything about capital allocation, debt management, goal affordability, or risk optimization.",
      response: {
        recommendation_title: 'SYSTEM READY: DIGITAL TWIN INTEGRATED',
        what: 'Real-time financial profile loaded (Income ₹1.2L, Expenses ₹65k, Net Worth ₹7.45L).',
        why: 'I evaluate all inquiries using mathematical multi-objective utility scoring, debt cost comparisons, and tax optimization.',
        alternatives_considered: ['Ask for next ₹20k allocation', 'Test ₹3L bike affordability', 'Analyze loan repayment trade-offs'],
        assumptions: ['Current profile values accurately reflect your finances'],
        risks: ['Market fluctuations and unforeseen emergencies require prudent safety buffers'],
        trade_offs: 'Balancing short-term debt liquidation with long-term compounding.',
        suggested_followups: [
          'Where should I put my next ₹20,000?',
          'Should I invest or repay my loan?',
          'Can I afford a ₹3 lakh bike?'
        ],
        source: 'FINARCH Autonomous Decision Engine'
      },
      timestamp: 'Just now'
    }
  ]);

  const handleSendMessage = async (msgToSend: string) => {
    if (!msgToSend.trim()) return;

    const userItem: ChatItem = {
      id: Math.random().toString(),
      sender: 'user',
      text: msgToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userItem]);
    setInputMessage('');
    setLoading(true);

    try {
      const aiResponse = await ApiService.askAdvisor(msgToSend, apiKey, provider);
      const aiItem: ChatItem = {
        id: Math.random().toString(),
        sender: 'ai',
        response: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiItem]);
    } catch (e) {
      console.error('Advisor error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              EXPLAINABLE <span className="text-cyan-400">AI ADVISOR</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Zero-Blackbox Reasoning
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transparent, data-backed financial reasoning providing WHAT, WHY, ALTERNATIVES, ASSUMPTIONS, and RISKS.
          </p>
        </div>

        {/* Engine Provider Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Engine:</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-cyan-400 font-mono focus:border-cyan-400 focus:outline-none"
          >
            <option value="local">FINARCH Deterministic (Offline Ready)</option>
            <option value="gemini">Google Gemini 2.0 / 1.5</option>
            <option value="openai">OpenAI GPT-4o</option>
          </select>
        </div>
      </div>

      {/* Popular Quick Questions Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Inquiries:</span>
        </span>
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSendMessage(q)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-300 text-xs transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-800 min-h-[500px] max-h-[680px] overflow-y-auto space-y-6">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 p-4 rounded-2xl rounded-tr-none font-medium text-xs sm:text-sm shadow-glow-cyan">
                  <p>{msg.text}</p>
                  <span className="text-[10px] text-slate-900 font-mono block text-right mt-1 opacity-75">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          const resp = msg.response;
          return (
            <div key={msg.id} className="flex items-start gap-3 max-w-4xl">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shrink-0 shadow-glow-cyan">
                <Bot className="w-5 h-5 text-slate-950" />
              </div>

              <div className="flex-1 space-y-4">
                {msg.text && (
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {msg.text}
                  </div>
                )}

                {resp && (
                  <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-cyan-500/30 space-y-5 shadow-card-elevated">
                    {/* Title & Engine Source */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <h4 className="text-base sm:text-lg font-extrabold text-cyan-400 font-mono">
                        {resp.recommendation_title}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-900 text-slate-400 border border-slate-800">
                        {resp.source}
                      </span>
                    </div>

                    {/* WHAT */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                        1. Action Recommendation (WHAT)
                      </span>
                      <p className="text-sm font-semibold text-slate-100 leading-relaxed">{resp.what}</p>
                    </div>

                    {/* WHY */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                        2. Mathematical Justification (WHY)
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{resp.why}</p>
                    </div>

                    {/* ALTERNATIVES & RISKS 2-col */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* ALTERNATIVES */}
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-2">
                          3. Alternatives Considered
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {resp.alternatives_considered.map((alt, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-400 font-bold">•</span>
                              <span>{alt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* RISKS */}
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 block mb-2">
                          4. Key Risks & Caveats
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {resp.risks.map((risk, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* ASSUMPTIONS & TRADEOFFS */}
                    <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-slate-300 block mb-1">Key Assumptions:</span>
                        <p className="text-slate-400">{resp.assumptions.join(' • ')}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="font-semibold text-amber-300 block mb-1">Expected Trade-Off:</span>
                        <p className="text-slate-300">{resp.trade_offs}</p>
                      </div>
                    </div>

                    {/* Follow-up Chips */}
                    {resp.suggested_followups && resp.suggested_followups.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">Suggested follow-ups:</span>
                        {resp.suggested_followups.map((f) => (
                          <button
                            key={f}
                            onClick={() => handleSendMessage(f)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-300 transition-colors"
                          >
                            {f} →
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 max-w-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span className="text-xs text-slate-400 font-mono">Synthesizing explainable decision...</span>
          </div>
        )}
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputMessage);
        }}
        className="flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Ask FINARCH AI anything (e.g. 'Can I afford a ₹3L bike?' or 'Where should my next ₹50,000 go?')..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-5 py-3.5 text-slate-100 text-sm focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
        />

        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all flex items-center gap-2 shrink-0"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
