import { Transaction, FinancialMetrics, CostCenter } from '../types/finance';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_TRANSACTIONS = 'nexus_transactions_v1';
const STORAGE_COST_CENTERS = 'nexus_cost_centers_v1';

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', userId: 'usr-admin-01', description: 'Licenciamento Enterprise SaaS - Cloud Corp', amount: 45000.00, type: 'income', category: 'Receita Recorrente', status: 'completed', date: '2025-05-01' },
  { id: 'tx-2', userId: 'usr-admin-01', description: 'Servidores AWS Global Cluster', amount: 12500.00, type: 'expense', category: 'Infraestrutura', status: 'completed', date: '2025-05-03' },
  { id: 'tx-3', userId: 'usr-admin-01', description: 'Campanha de Performance B2B Q2', amount: 8900.00, type: 'expense', category: 'Marketing', status: 'completed', date: '2025-05-05' },
  { id: 'tx-4', userId: 'usr-admin-01', description: 'Contrato Consultoria DevOps Advanced', amount: 28000.00, type: 'income', category: 'Serviços', status: 'completed', date: '2025-05-10' },
  { id: 'tx-5', userId: 'usr-admin-01', description: 'Folha de Pagamento Engenharia Core', amount: 34000.00, type: 'expense', category: 'Pessoal', status: 'pending', date: '2025-05-15' },
  { id: 'tx-6', userId: 'usr-admin-01', description: 'Renovação DataCenter SÃO PAULO', amount: 15000.00, type: 'expense', category: 'Infraestrutura', status: 'completed', date: '2025-05-18' }
];

const SEED_COST_CENTERS: CostCenter[] = [
  { id: 'cc-1', name: 'Infraestrutura Cloud & IA', budget: 50000.00, spent: 34200.00 },
  { id: 'cc-2', name: 'Expansão Comercial Global', budget: 80000.00, spent: 62150.00 }
];

function getLocalTransactions(): Transaction[] {
  const data = localStorage.getItem(STORAGE_TRANSACTIONS);
  if (!data) {
    localStorage.setItem(STORAGE_TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS));
    return SEED_TRANSACTIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return SEED_TRANSACTIONS;
  }
}

function saveLocalTransactions(txs: Transaction[]) {
  localStorage.setItem(STORAGE_TRANSACTIONS, JSON.stringify(txs));
}

export const financeService = {
  async getTransactions(): Promise<Transaction[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
        if (!error && data) {
          return data.map((item: Record<string, unknown>) => ({
            id: String(item.id),
            userId: String(item.user_id || 'usr-admin-01'),
            description: String(item.description),
            amount: Number(item.amount),
            type: item.type as 'income' | 'expense',
            category: String(item.category),
            status: item.status as 'completed' | 'pending',
            date: String(item.date)
          }));
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
      }
    }
    return getLocalTransactions();
  },

  async createTransaction(tx: Omit<Transaction, 'id' | 'userId'>): Promise<Transaction> {
    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      userId: 'usr-admin-01',
      ...tx
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('transactions').insert([{
          id: newTx.id,
          user_id: newTx.userId,
          description: newTx.description,
          amount: newTx.amount,
          type: newTx.type,
          category: newTx.category,
          status: newTx.status,
          date: newTx.date
        }]);
      } catch (err) {
        console.error('Supabase insert error:', err);
      }
    }

    const current = getLocalTransactions();
    const updated = [newTx, ...current];
    saveLocalTransactions(updated);
    return newTx;
  },

  async updateTransaction(id: string, txData: Partial<Transaction>): Promise<Transaction> {
    const current = getLocalTransactions();
    let updatedTx: Transaction = current[0];
    const updated = current.map(item => {
      if (item.id === id) {
        updatedTx = { ...item, ...txData };
        return updatedTx;
      }
      return item;
    });
    saveLocalTransactions(updated);
    return updatedTx;
  },

  async deleteTransaction(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('transactions').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete error:', err);
      }
    }
    const current = getLocalTransactions();
    const filtered = current.filter(item => item.id !== id);
    saveLocalTransactions(filtered);
    return true;
  },

  async getMetrics(): Promise<FinancialMetrics> {
    const txs = await this.getTransactions();
    let totalRevenue = 0;
    let totalExpenses = 0;

    txs.forEach(t => {
      if (t.status === 'completed') {
        if (t.type === 'income') totalRevenue += t.amount;
        else totalExpenses += t.amount;
      }
    });

    const netProfit = totalRevenue - totalExpenses;
    const roiPercentage = totalExpenses > 0 ? Number(((netProfit / totalExpenses) * 100).toFixed(2)) : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      roiPercentage
    };
  },

  async getCostCenters(): Promise<CostCenter[]> {
    const data = localStorage.getItem(STORAGE_COST_CENTERS);
    if (!data) {
      localStorage.setItem(STORAGE_COST_CENTERS, JSON.stringify(SEED_COST_CENTERS));
      return SEED_COST_CENTERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return SEED_COST_CENTERS;
    }
  }
};
