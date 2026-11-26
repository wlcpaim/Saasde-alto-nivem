import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Download, FileText, PieChart } from 'lucide-react';
import { financeService } from '../services/finance';
import { FinancialMetrics, CostCenter } from '../types/finance';
import { ChartWidget } from '../components/ChartWidget';

export const Reports: React.FC = () => {
  const [metrics, setMetrics] = useState<FinancialMetrics>({ totalRevenue: 0, totalExpenses: 0, netProfit: 0, roiPercentage: 0 });
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [m, cc] = await Promise.all([
          financeService.getMetrics(),
          financeService.getCostCenters()
        ]);
        setMetrics(m);
        setCostCenters(cc);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Metrica,Valor\n" +
      `Receita Total,${metrics.totalRevenue}\n` +
      `Despesas Totais,${metrics.totalExpenses}\n` +
      `Lucro Líquido,${metrics.netProfit}\n` +
      `ROI (%),${metrics.roiPercentage}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "nexus_relatorio_financeiro.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Relatórios Avançados & ROI</h1>
          <p className="text-sm text-zinc-400">Análise profunda de desempenho fiscal, centros de custo e retorno corporativo.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Download className="w-4 h-4" />
          Exportar Relatório CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget revenue={metrics.totalRevenue} expenses={metrics.totalExpenses} />
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Simulação de ROI e Retorno</h3>
              <p className="text-xs text-zinc-400">Eficiência operacional sobre o capital investido</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-zinc-400">Índice de Retorno sobre o Investimento</span>
                <span className="text-lg font-bold text-indigo-400">{metrics.roiPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(metrics.roiPercentage, 0), 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <p className="text-xs text-zinc-400 mb-1">Margem Líquida</p>
                <p className="text-xl font-bold text-white">
                  {metrics.totalRevenue > 0 ? ((metrics.netProfit / metrics.totalRevenue) * 100).toFixed(1) : '0'}%
                </p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <p className="text-xs text-zinc-400 mb-1">Liquidez Corrente</p>
                <p className="text-xl font-bold text-emerald-400">2.48x</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Alocação por Centros de Custo</h3>
        {loading ? (
          <div className="py-12 text-center text-zinc-500">Carregando centros de custo...</div>
        ) : costCenters.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">Nenhum centro de custo cadastrado.</div>
        ) : (
          <div className="space-y-6">
            {costCenters.map(cc => {
              const percentage = cc.budget > 0 ? (cc.spent / cc.budget) * 100 : 0;
              return (
                <div key={cc.id} className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">{cc.name}</span>
                    <span className="text-xs font-mono text-zinc-400">
                      Gasto: R$ {cc.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / Orçamento: R$ {cc.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${percentage > 90 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default Reports;
