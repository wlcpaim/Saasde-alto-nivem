import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { financeService } from '../services/finance';
import { Transaction } from '../types/finance';
import { TransactionModal } from '../components/TransactionModal';

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTxs = async () => {
    setLoading(true);
    try {
      const data = await financeService.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTxs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      await financeService.deleteTransaction(id);
      loadTxs();
    }
  };

  const filtered = transactions.filter(tx => {
    const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase()) || tx.category.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || tx.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Transações</h1>
          <p className="text-sm text-zinc-400">CRUD completo de receitas, despesas e transferências</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova Transação
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar por descrição ou categoria..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-xs font-medium ${
              filterType === 'all' ? 'bg-cyan-500 text-black font-semibold' : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-4 py-2 rounded-lg text-xs font-medium ${
              filterType === 'income' ? 'bg-emerald-500 text-black font-semibold' : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            Receitas
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-4 py-2 rounded-lg text-xs font-medium ${
              filterType === 'expense' ? 'bg-rose-500 text-black font-semibold' : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            Despesas
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-xs font-medium text-zinc-400 uppercase">
                <th className="py-4 px-6">Descrição</th>
                <th className="py-4 px-6">Categoria</th>
                <th className="py-4 px-6">Data</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Valor</th>
                <th className="py-4 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm font-mono">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-4 px-6 font-sans font-medium text-white">{tx.description}</td>
                  <td className="py-4 px-6 text-zinc-400 font-sans text-xs">{tx.category}</td>
                  <td className="py-4 px-6 text-zinc-400 text-xs">{tx.date}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans ${
                      tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {tx.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {tx.status === 'completed' ? 'Concluído' : 'Pendente'}
                    </span>
                  </td>
                  <td className={`py-4 px-6 text-right font-bold ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Excluir Transação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadTxs()}
      />
    </div>
  );
};
