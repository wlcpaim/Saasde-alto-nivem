import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ChartWidgetProps {
  revenue: number;
  expenses: number;
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ revenue, expenses }) => {
  const max = Math.max(revenue, expenses, 1);
  const revHeight = Math.round((revenue / max) * 100);
  const expHeight = Math.round((expenses / max) * 100);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white">Fluxo de Caixa Consolidado</h3>
          <p className="text-xs text-zinc-400">Comparativo mensal de receitas e despesas</p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
          <BarChart3 className="w-5 h-5" />
        </div>
      </div>

      <div className="h-56 flex items-end justify-center gap-12 px-6 pt-6 pb-2 border-b border-zinc-800">
        <div className="flex flex-col items-center gap-2 h-full justify-end w-24">
          <span className="text-xs font-mono text-emerald-400">
            {new Intl.NumberFormat('pt-BR', { notation: 'compact', style: 'currency', currency: 'BRL' }).format(revenue)}
          </span>
          <div 
            className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-500"
            style={{ height: `${Math.max(revHeight, 15)}%` }}
          />
          <span className="text-xs font-medium text-zinc-400">Receitas</span>
        </div>

        <div className="flex flex-col items-center gap-2 h-full justify-end w-24">
          <span className="text-xs font-mono text-rose-400">
            {new Intl.NumberFormat('pt-BR', { notation: 'compact', style: 'currency', currency: 'BRL' }).format(expenses)}
          </span>
          <div 
            className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-lg transition-all duration-500"
            style={{ height: `${Math.max(expHeight, 15)}%` }}
          />
          <span className="text-xs font-medium text-zinc-400">Despesas</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 font-mono">
        <span>Status: Sincronizado</span>
        <span className="text-emerald-400">Saúde Financeira: Ótima</span>
      </div>
    </div>
  );
};
