import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp, DollarSign, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { ChartWidget } from '../components/ChartWidget';
import { TransactionModal } from '../components/TransactionModal';
import { financeService } from '../services/finance';
import { FinancialMetrics, Transaction } from '../types/finance';

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<FinancialMetrics>({ totalRevenue: 0, totalExpenses: 0, netProfit: 0, roiPercentage: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, txs] = await Promise.all([
        financeService.getMetrics(),
        financeService.getTransactions()
      ]);
      setMetrics(m);
      setTransactions(txs.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Painel Executivo</h1>
          <p className="text-sm text-zinc-400">Visão consolidada de caixa, receitas e KPIs financeiros</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Transação
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Receita Bruta"
          value={metrics.totalRevenue}
          type="currency"
          trend="up"
          trendValue="+14.2%"
          variant="revenue"
        />
        <MetricCard
          title="Despesas Totais"
          value={metrics.totalExpenses}
          type="currency"
          trend="down"
          trendValue="+5.1%"
          variant="expense"
        />
        <MetricCard
          title="Lucro Líquido"
          value={metrics.netProfit}
          type="currency"
          trend="up"
          trendValue="+22.4%"
          variant="profit"
        />
        <MetricCard
          title="ROI Operacional"
          value={metrics.roiPercentage}
          type="percent"
          trend="up"
          trendValue="+8.3%"
          variant="roi"
        />
      </div>

      {/* Charts & Cost Centers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartWidget revenue={metrics.totalRevenue} expenses={metrics.totalExpenses} />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Centros de Custo</h3>
            <p className="text-xs text-zinc-400 mb-6">Alocação de orçamento corporativo</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-white">Infraestrutura Cloud & IA</span>
                  <span className="text-cyan-400 font-mono">R$ 34.200 / 50.000</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-white">Expansão Comercial Global</span>
                  <span className="text-emerald-400 font-mono">R$ 62.150 / 80.000</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '77%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs text-zinc-400">Orçamento dentro dos limites de alçada aprovados pelo Conselho.</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-base font-bold text-white mb-4">Transações Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-xs font-medium text-zinc-400 uppercase">
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm font-mono">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-white">{tx.description}</td>
                  <td className="py-3 px-4 text-zinc-400 font-sans text-xs">{tx.category}</td>
                  <td className="py-3 px-4 text-zinc-400 text-xs">{tx.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-sans ${
                      tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {tx.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-bold ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};
