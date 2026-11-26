import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, TrendingUp, Cpu, Lock, CheckCircle2, DollarSign } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(50000);
  const [revenueGen, setRevenueGen] = useState(140000);

  const estimatedRoi = investment > 0 ? (((revenueGen - investment) / investment) * 100).toFixed(0) : '0';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <span className="font-bold text-xl tracking-wider text-white">NEXUS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/login"
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            Acessar Portal <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 py-24 lg:py-36 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-8">
          <Cpu className="w-4 h-4" /> Nexus Enterprise Financial SaaS 1.9.9
        </div>
        <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          Gestão Financeira & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">ROI de Alta Performance</span>
        </h1>
        <p className="max-w-2xl mx-auto text-zinc-400 text-base lg:text-xl mb-10">
          Painel executivo com relatórios em tempo real, multi-contas e conciliação bancária simulada para empresas líderes de mercado.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/admin/login')}
            className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20"
          >
            Iniciar Acesso Executivo <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Interactive ROI Calculator Section */}
      <section className="py-20 border-t border-zinc-800 bg-zinc-900/30 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 lg:p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Calculadora Interativa de ROI</h2>
            <p className="text-zinc-400 text-sm">Simule o retorno financeiro da sua operação enterprise com a tecnologia Nexus.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Investimento Mensal (R$): <span className="text-white font-mono">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(investment)}</span>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={investment}
                  onChange={e => setInvestment(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Retorno Bruto Estimado (R$): <span className="text-white font-mono">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(revenueGen)}</span>
                </label>
                <input
                  type="range"
                  min="20000"
                  max="600000"
                  step="10000"
                  value={revenueGen}
                  onChange={e => setRevenueGen(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center flex flex-col justify-center items-center">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">ROI Projetado</span>
              <div className="text-5xl lg:text-6xl font-extrabold font-mono text-emerald-400 mb-4">
                +{estimatedRoi}%
              </div>
              <p className="text-xs text-zinc-500">Calculado com base no fluxo de caixa líquido e eficiência de alocação.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Relatórios em Tempo Real</h3>
            <p className="text-zinc-400 text-sm">Métricas consolidadas atualizadas instantaneamente a cada transação.</p>
          </div>

          <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Contas & Centros</h3>
            <p className="text-zinc-400 text-sm">Gestão avançada de centros de custo e alçadas de aprovação.</p>
          </div>

          <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Segurança Enterprise</h3>
            <p className="text-zinc-400 text-sm">Criptografia ponta a ponta e compliance rigoroso com auditoria.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 py-12 px-6 lg:px-12 text-center text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between">
        <p>© 2025 Nexus Enterprise Financial SaaS. Todos os direitos reservados.</p>
        <div className="mt-4 sm:mt-0 flex items-center gap-6">
          <Link to="/admin/login" className="text-zinc-400 hover:text-white transition-colors">
            Acesso Administrativo
          </Link>
        </div>
      </footer>
    </div>
  );
};
