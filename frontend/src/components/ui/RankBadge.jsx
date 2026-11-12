import React from 'react';
import { Award, Sparkles } from 'lucide-react';

const RANK_METADATA = {
  1: { level: 1, label: 'Plus 1', symbol: '+', title: 'Entry Contributor', class: 'badge-rank-plus-1' },
  2: { level: 2, label: 'Plus 2', symbol: '++', title: 'Early Sustained', class: 'badge-rank-plus-2' },
  3: { level: 3, label: 'Plus 3', symbol: '+++', title: 'Established', class: 'badge-rank-plus-3' },
  4: { level: 4, label: 'Plus 4', symbol: '++++', title: 'Trusted Contributor', class: 'badge-rank-plus-4' },
  5: { level: 5, label: 'Plus 5', symbol: '+++++', title: 'Senior Contributor', class: 'badge-rank-plus-5' },
  6: { level: 6, label: 'Plus 6', symbol: '++++++', title: 'Expert Contributor', class: 'badge-rank-plus-6' },
  7: { level: 7, label: 'Plus 7', symbol: '+++++++', title: 'Distinguished', class: 'badge-rank-plus-7' },
  8: { level: 8, label: 'Plus 8', symbol: '++++++++', title: 'Master Contributor', class: 'badge-rank-plus-8' },
};

export const parseRankLevel = (rankString) => {
  if (!rankString) return 1;
  if (typeof rankString === 'number') return Math.max(1, Math.min(8, rankString));
  
  // Extract number from "Plus 3" or count '+' symbols
  const match = rankString.match(/plus\s*(\d)/i);
  if (match) return parseInt(match[1], 10);
  
  const plusCount = (rankString.match(/\+/g) || []).length;
  if (plusCount > 0) return Math.min(8, plusCount);

  return 1;
};

const RankBadge = ({ rank = 'Plus 1 (+)', size = 'sm', showTitle = false, className = '' }) => {
  const level = parseRankLevel(rank);
  const data = RANK_METADATA[level] || RANK_METADATA[1];

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  };

  return (
    <span
      title={`ByteMed ${data.label} (${data.title}) — Peer contribution rank, not clinical credential`}
      className={`inline-flex items-center font-mono font-bold rounded-lg transition-all duration-200 select-none ${data.class} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {level === 8 ? (
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
      ) : (
        <Award className="w-3.5 h-3.5 opacity-80" />
      )}
      <span>{data.label}</span>
      <span className="opacity-70 font-semibold">({data.symbol})</span>
      {showTitle && (
        <span className="text-[10px] opacity-75 font-sans font-normal border-l border-current pl-1.5 ml-0.5 hidden sm:inline">
          {data.title}
        </span>
      )}
    </span>
  );
};

export default RankBadge;

