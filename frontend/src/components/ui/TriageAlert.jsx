import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, Info, ExternalLink } from 'lucide-react';

const TriageAlert = ({ 
  isEmergency = false, 
  confidenceScore = 0.92, 
  matchedKeywords = [],
  compact = false,
  className = '' 
}) => {
  if (!isEmergency && (!matchedKeywords || matchedKeywords.length === 0)) {
    return null;
  }

  const confidencePercent = Math.round((confidenceScore || 0.9) * 100);

  if (compact) {
    return (
      <div className={`p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-2 ${className}`}>
        <div className="flex items-center space-x-2 min-w-0">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 animate-bounce" />
          <span className="font-bold truncate">Critical AI Safety Flag</span>
        </div>
        <span className="font-mono text-[10px] bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 text-rose-200">
          {confidencePercent}% Risk
        </span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-red-950/40 to-slate-900 border border-rose-500/50 shadow-xl shadow-rose-950/40 space-y-3 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h4 className="font-extrabold text-sm text-white tracking-tight">
                Emergency Medical Safety Alert
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                AI Confidence: {confidencePercent}%
              </span>
            </div>
            <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
              Symptoms or language indicate a potential medical emergency. ByteMed is an educational and non-urgent consultation platform. <strong>Do not delay emergency medical treatment!</strong>
            </p>
          </div>
        </div>
      </div>

      {matchedKeywords && matchedKeywords.length > 0 && (
        <div className="flex items-center space-x-2 text-[11px] text-rose-300/80 pl-11">
          <span className="font-semibold">Flagged indicators:</span>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.map((kw, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 font-mono text-rose-200 text-[10px]">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Immediate Action Bar */}
      <div className="pt-2 pl-11 flex flex-wrap items-center gap-2.5">
        <a
          href="tel:911"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 911 / 112 (Emergency)</span>
        </a>
        <a
          href="https://www.google.com/maps/search/nearest+hospital+emergency+room"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>Locate Nearest ER</span>
        </a>
      </div>
    </div>
  );
};

export default TriageAlert;

