export type MarketSnapshot = {
  symbol: string;
  price_change_pct: number;
  volume_change_pct: number;
  sentiment_score: number;
  degraded: boolean;
};

type Agent = {
  agent: string;
  signal: string;
  score: number;
  confidence: number;
  rationale: string;
  evidence_ids: string[];
};

const CORPUS = [
  { id: 'rbi-liquidity', title: 'RBI monetary-policy reference', text: 'Liquidity and emergency reserves should be preserved before taking material market risk. Policy-rate and inflation context can change the opportunity cost of cash.' },
  { id: 'sebi-investor-protection', title: 'SEBI investor-protection reference', text: 'Suitability, diversification, risk disclosure and investor protection are central considerations when evaluating market-linked investments.' },
  { id: 'finarch-debt', title: 'FINARCH debt-priority rule', text: 'High-interest revolving debt creates a guaranteed savings opportunity. When expensive debt is outstanding, repayment can outrank volatile investments.' },
  { id: 'finarch-risk', title: 'FINARCH risk-alignment rule', text: 'Recommended exposure should reflect stated risk tolerance, investment horizon, liquidity needs and existing portfolio concentration.' },
];

function tokenize(value: string) { return value.toLowerCase().match(/[a-z0-9]+/g) ?? []; }

function retrieve(query: string) {
  const terms = new Set(tokenize(query));
  return [...CORPUS].sort((a, b) => {
    const score = (doc: typeof a) => tokenize(doc.title + ' ' + doc.text).filter((w) => terms.has(w)).length;
    return score(b) - score(a);
  }).slice(0, 3);
}

export function runMarketIntelligence(snapshot: MarketSnapshot, profile: { risk_tolerance: string; investment_horizon_years: number }) {
  const price = snapshot.price_change_pct;
  const volume = snapshot.volume_change_pct;
  const sentiment = snapshot.sentiment_score;
  const evidence = retrieve('market momentum volume sentiment risk diversification debt liquidity');
  const evidenceIds = evidence.map((doc) => doc.id);
  const agents: Agent[] = [
    { agent: 'momentum_agent', signal: price > 2 ? 'BULLISH' : price < -2 ? 'BEARISH' : 'NEUTRAL', score: price, confidence: Math.min(98, 55 + Math.abs(price) * 8), rationale: `Price change is ${price >= 0 ? '+' : ''}${price.toFixed(1)}% over the supplied window.`, evidence_ids: evidenceIds },
    { agent: 'volume_anomaly_agent', signal: volume > 15 && price > 0 ? 'ACCUMULATION' : volume > 15 && price < 0 ? 'DISTRIBUTION' : 'NORMAL', score: volume, confidence: Math.min(97, 60 + Math.abs(volume) * 1.2), rationale: `Volume change is ${volume >= 0 ? '+' : ''}${volume.toFixed(1)}%; anomaly threshold is 15%.`, evidence_ids: evidenceIds },
    { agent: 'sentiment_agent', signal: sentiment > 0.25 ? 'POSITIVE' : sentiment < -0.25 ? 'NEGATIVE' : 'MIXED', score: sentiment, confidence: Math.min(96, 60 + Math.abs(sentiment) * 30), rationale: `Sentiment score is ${sentiment >= 0 ? '+' : ''}${sentiment.toFixed(2)} on a -1 to +1 scale.`, evidence_ids: evidenceIds },
  ];
  const rawScore = price * 0.35 + Math.max(Math.min(volume, 100), -100) * 0.15 + sentiment * 10;
  const profileBias = profile.risk_tolerance === 'conservative' ? -12 : profile.risk_tolerance === 'aggressive' ? 12 : 0;
  const horizonBias = profile.investment_horizon_years >= 10 ? 5 : profile.investment_horizon_years < 5 ? -5 : 0;
  const decisionScore = Math.max(0, Math.min(100, 50 + rawScore + profileBias + horizonBias));
  let recommendation = decisionScore >= 62 ? 'INCREASE' : decisionScore <= 38 ? 'REDUCE' : 'HOLD';
  if (profile.risk_tolerance === 'conservative' && recommendation === 'INCREASE') recommendation = 'HOLD';
  if (profile.risk_tolerance === 'aggressive' && recommendation === 'REDUCE' && profile.investment_horizon_years >= 10) recommendation = 'HOLD';
  return {
    market_snapshot: snapshot,
    agents,
    retrieved_evidence: evidence,
    synthesis: { recommendation, decision_score: Number(decisionScore.toFixed(1)), confidence: Number((agents.reduce((s, a) => s + a.confidence, 0) / agents.length).toFixed(1)), reasoning: `Three independent signals were synthesized and adjusted for a ${profile.risk_tolerance} risk profile and ${profile.investment_horizon_years}-year horizon.`, profile_effect: `Risk tolerance=${profile.risk_tolerance}; horizon=${profile.investment_horizon_years} years changed the final suitability weighting.` },
    degraded_mode: snapshot.degraded,
    pipeline: ['raw_market_snapshot', 'parallel_agents', 'local_rag', 'profile_weighting', 'synthesis'],
  };
}
