import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  type: 'currency' | 'percent';
  trend: 'up' | 'down';
  trendValue: string;
  variant?: 'revenue' | 'expense' | 'profit' | 'roi';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  type,
  trend,
  trendValue,
  variant = 'revenue'
}) => {
  const formattedValue = type === 'currency'
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    : `${value.toFixed(2)}%`;

  const isPositive = trend === 'up';

  const getVariantStyles = () => {
    switch (variant) {
      case 'revenue':
        return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400';
      case 'expense':
        return 'border-rose-500/20 bg-rose-500/5 text-rose-400';
      case 'profit':
        return 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400';
      case 'roi':
        return 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400';
    }
  };

  return (
    <div className={`p-6 rounded-xl border bg-zinc-900/80 backdrop-blur-sm shadow-xl flex flex-col justify-between ${getVariantStyles()}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-white">
          {type === 'currency' ? <DollarSign className="w-5 h-5" /> : <Percent className="w-5 h-5" />}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-2xl lg:text-3xl font-bold font-mono text-white tracking-tight">
          {formattedValue}
        </h3>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium">
        <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {trendValue}
        </span>
        <span className="text-zinc-500">vs. mês anterior</span>
      </div>
    </div>
  );
};
