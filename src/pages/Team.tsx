import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { TeamMember } from '../types/finance';
import { authService } from '../services/auth';

export const Team: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: 'usr-admin-01',
      name: 'Executivo Master',
      email: 'admin@nexus.enterprise',
      role: 'admin',
      status: 'active'
    },
    {
      id: 'usr-analyst-02',
      name: 'Mariana Costa',
      email: 'mariana.costa@nexus.enterprise',
      role: 'user',
      status: 'active'
    },
    {
      id: 'usr-analyst-03',
      name: 'Carlos Eduardo',
      email: 'carlos.eduardo@nexus.enterprise',
      role: 'user',
      status: 'active'
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      status: 'active'
    };

    setTeam([...team, newMember]);
    setName('');
    setEmail('');
    setIsModalOpen(false);
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este membro da equipe?')) {
      setTeam(team.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Equipe & Permissões</h1>
          <p className="text-sm text-zinc-400">Controle de acessos corporativos e cargos de governança.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-lg shadow-emerald-500/20"
        >
          <UserPlus className="w-4 h-4" />
          Adicionar Membro
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/80 text-xs uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Membro</th>
                <th className="px-6 py-4">E-mail Corporativo</th>
                <th className="px-6 py-4">Cargo / Permissão</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {team.map(member => (
                <tr key={member.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 text-black font-bold flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{member.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      member.role === 'admin' 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {member.role === 'admin' ? 'Administrador Master' : 'Analista Financeiro'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="p-2 text-zinc-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10"
                      title="Remover membro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-4">Convidar Novo Membro</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Ana Souza"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ana.souza@nexus.enterprise"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Cargo e Permissão</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as 'admin' | 'user')}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="user">Analista Financeiro</option>
                  <option value="admin">Administrador Master</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500 font-medium"
                >
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Team;
