import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="py-2.5 px-4 bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-center gap-2 text-center">
      <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      <span>
        <strong className="text-slate-300">Disclaimer:</strong> FINARCH AI is a decision-support prototype for educational and demonstration purposes. It does not constitute financial, investment, tax or legal advice. Market returns are uncertain and simulated results are not guarantees.
      </span>
    </div>
  );
};
