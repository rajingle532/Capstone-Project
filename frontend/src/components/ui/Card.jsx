import React from 'react';

const Card = ({
  children,
  variant = 'default', // 'default' | 'elevated' | 'interactive' | 'emergency'
  className = '',
  ...props
}) => {
  const variants = {
    default: 'glass-panel rounded-2xl p-6 border border-slate-800/80',
    elevated: 'glass-panel-elevated rounded-2xl p-6 sm:p-8 border border-slate-800',
    interactive: 'glass-card rounded-2xl p-6 cursor-pointer',
    emergency: 'glass-panel rounded-2xl p-6 border border-rose-500/60 bg-rose-950/20 shadow-lg shadow-rose-950/30',
  };

  return (
    <div className={`${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;

