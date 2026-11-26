import { TeamMember } from '../types/finance';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const AUTH_STORAGE_KEY = 'nexus_auth_session';

const INITIAL_ADMIN: TeamMember = {
  id: 'usr-admin-01',
  name: 'Executivo Master',
  email: 'admin@nexus.enterprise',
  role: 'admin',
  status: 'active'
};

export const authService = {
  async login(email: string, pass: string): Promise<{ success: boolean; user?: TeamMember; error?: string }> {
    if (!email || !pass) {
      return { success: false, error: 'Preencha todos os campos.' };
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single();
        if (error || !data) {
          return { success: false, error: 'Credenciais inválidas ou usuário não encontrado.' };
        }
        const user: TeamMember = {
          id: data.id,
          name: data.full_name,
          email: data.email,
          role: data.role,
          status: 'active'
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return { success: true, user };
      } catch (err) {
        console.error('Supabase auth error:', err);
      }
    }

    // Fallback local
    let users: TeamMember[] = [];
    const stored = localStorage.getItem('nexus_team_members');
    if (stored) {
      users = JSON.parse(stored);
    } else {
      users = [INITIAL_ADMIN];
      localStorage.setItem('nexus_team_members', JSON.stringify(users));
    }

    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      // First-Admin Bootstrap / Auto Register
      const newUser: TeamMember = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email,
        role: users.length === 0 ? 'admin' : 'user',
        status: 'active'
      };
      users.push(newUser);
      localStorage.setItem('nexus_team_members', JSON.stringify(users));
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      return { success: true, user: newUser };
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(found));
    return { success: true, user: found };
  },

  async register(name: string, email: string): Promise<{ success: boolean; user?: TeamMember; error?: string }> {
    let users: TeamMember[] = [];
    const stored = localStorage.getItem('nexus_team_members');
    if (stored) users = JSON.parse(stored);
    else users = [INITIAL_ADMIN];

    if (users.some(u => u.email === email)) {
      return { success: false, error: 'E-mail já cadastrado.' };
    }

    const newUser: TeamMember = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: users.length === 0 ? 'admin' : 'user',
      status: 'active'
    };
    users.push(newUser);
    localStorage.setItem('nexus_team_members', JSON.stringify(users));
    return { success: true, user: newUser };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  getCurrentUser(): TeamMember | null {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as TeamMember;
    } catch {
      return null;
    }
  }
};
