-- Nexus Enterprise Financial SaaS Schema
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    category TEXT NOT NULL,
    status TEXT CHECK (status IN ('completed', 'pending')) DEFAULT 'completed',
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS cost_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    budget NUMERIC(12, 2) NOT NULL,
    spent NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial admin and transactions
INSERT INTO profiles (email, full_name, role) 
VALUES ('admin@nexus.enterprise', 'Executivo Master', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO cost_centers (name, budget, spent) VALUES 
('Infraestrutura Cloud & IA', 50000.00, 34200.00),
('Expansão Comercial Global', 80000.00, 62150.00)
ON CONFLICT DO NOTHING;
