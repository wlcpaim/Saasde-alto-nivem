import React from 'react';
import { Menu, Shield } from 'lucide-react';
import { authService } from '../services/auth';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar }) => {
  const user = authService.getCurrentUser();

  return (
    <header className="h-20 bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
          aria-label="Abrir Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">Painel Executivo</h2>
          <p className="text-xs text-zinc-400 hidden sm:block">Monitoramento financeiro em tempo real</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400">SaaS Online</span>
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
          <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold font-mono">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'EX'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-white leading-tight">{user?.name || 'Executivo'}</p>
            <p className="text-xs text-cyan-400 flex items-center gap-1 font-mono">
              <Shield className="w-3 h-3" /> {user?.role || 'admin'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
