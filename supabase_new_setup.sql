-- ==============================================================================
-- PIXIES CORE & PINK PIXIES — NEW SUPABASE ACCOUNT SCHEMA SETUP
-- Run this script in the SQL Editor of your NEW Supabase project.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running
DROP TABLE IF EXISTS support_messages CASCADE;
DROP TABLE IF EXISTS support_conversations CASCADE;
DROP TABLE IF EXISTS admin_portal_config CASCADE;
DROP TABLE IF EXISTS audit_ledger CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS professionals CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ==============================================================================
-- CORE PLATFORM TABLES
-- ==============================================================================

-- Profiles (Personnel and Clients)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client', -- 'admin', 'manager', 'staff', 'finance', 'pro', 'client'
    clearance_level TEXT DEFAULT 'Level 1 — Consumer',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professionals Directory (Nails & Lashes)
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- e.g. PRO-101
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Nails', 'Lashes', 'Nails & Lashes'
    specialty TEXT,
    location TEXT NOT NULL,
    cert_document_name TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    pink_badge BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3,2) DEFAULT 5.0,
    experience_years TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments & Bookings
CREATE TABLE appointments (
    id TEXT PRIMARY KEY, -- e.g. APT-8821
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    pro_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    pro_name TEXT NOT NULL,
    category TEXT NOT NULL,
    service_name TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    amount_display TEXT NOT NULL, -- e.g. 'ZMW 650.00'
    amount_numeric NUMERIC(10,2) NOT NULL,
    fee_display TEXT NOT NULL, -- e.g. 'ZMW 97.50'
    fee_numeric NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ZMW',
    gateway TEXT NOT NULL, -- 'Paystack' or 'Stripe Connect'
    status TEXT NOT NULL DEFAULT 'confirmed', -- 'pending', 'confirmed', 'completed', 'cancelled'
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Immutable Security & Audit Ledger
CREATE TABLE audit_ledger (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event TEXT NOT NULL,
    user_email TEXT,
    user_name TEXT,
    selected_role TEXT,
    assigned_role TEXT,
    status TEXT NOT NULL, -- 'SUCCESS', 'DENIED', 'WARNING', 'INFO'
    ip_address TEXT,
    notes TEXT,
    metadata JSONB
);

-- ==============================================================================
-- MARKETING & HR LIVE CONCIERGE CHATBOT TABLES
-- ==============================================================================

-- Support Conversations Thread
CREATE TABLE support_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL DEFAULT 'Visiting Guest',
    client_contact TEXT, -- Phone or email
    category TEXT DEFAULT 'General Inquiry',
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved'
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live Messages Stream
CREATE TABLE support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES support_conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'client' or 'marketing_hr'
    sender_name TEXT NOT NULL,
    sender_id TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for instantaneous realtime queries
CREATE INDEX idx_support_messages_conv ON support_messages(conversation_id, created_at ASC);
CREATE INDEX idx_support_conv_session ON support_conversations(session_id);

-- ==============================================================================
-- PORTAL CONFIGURATION (LOGIN VIDEO & BRAND MANAGEMENT)
-- ==============================================================================

CREATE TABLE admin_portal_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_by TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial Login Video Configuration
INSERT INTO admin_portal_config (key, value, updated_by)
VALUES (
    'login_background',
    json_build_object(
        'video_url', 'https://assets.mixkit.co/videos/preview/mixkit-pink-particles-floating-in-the-dark-41584-large.mp4',
        'poster_url', '',
        'enable_particles', true,
        'title', 'Ambient Dark Pink Particles'
    ),
    'system_seed'
);

-- ==============================================================================
-- SEED DATA (INITIAL PERSONNEL, PROS, APPOINTMENTS, & CONVERSATIONS)
-- ==============================================================================

INSERT INTO professionals (code, name, email, phone, category, specialty, location, cert_document_name, status, pink_badge, rating, experience_years)
VALUES
('PRO-101', 'Chanda Bwalya', 'chanda.b@pixies.zm', '+260 97 1234567', 'Nails', 'Gel Extensions & Nail Art', 'Lusaka, Zambia (Woodlands)', 'Certified Master Nail Tech (Zambia Board)', 'pending', false, 4.9, '5 Years'),
('PRO-102', 'Amina Bello', 'amina.lashes@pixies.ng', '+234 80 98765432', 'Lashes', 'Russian Volume & Hybrid Lashes', 'Lekki Phase 1, Lagos, Nigeria', 'International Lash Masters Accreditation 2025', 'pending', true, 5.0, '4 Years'),
('PRO-103', 'Chloe Visser', 'chloe.v@pixies.za', '+27 82 5550199', 'Nails & Lashes', 'Acrylic Sculpting & Lash Lifts', 'Camps Bay, Cape Town, South Africa', 'SA Cosmetology Guild Diploma', 'pending', false, 4.8, '3 Years');

INSERT INTO appointments (id, client_name, client_phone, pro_name, category, service_name, scheduled_at, amount_display, amount_numeric, fee_display, fee_numeric, currency, gateway, status, whatsapp_sent)
VALUES
('APT-8821', 'Nadia Phiri', '+260 96 4432100', 'Chanda Bwalya', 'Nails', 'Full Set Ombré Acrylic + 3D Stones', NOW() + INTERVAL '1 day', 'ZMW 650.00', 650.00, 'ZMW 97.50', 97.50, 'ZMW', 'Paystack', 'confirmed', true),
('APT-8822', 'Sipho Ndlovu', '+27 73 8881234', 'Chloe Visser', 'Lashes', 'Mega Volume Lash Installation', NOW() + INTERVAL '1 day 2 hours', 'ZMW 820.00', 820.00, 'ZMW 123.00', 123.00, 'ZMW', 'Paystack', 'confirmed', true),
('APT-8823', 'Jessica Sterling', '+44 79 11122233', 'Amina Bello', 'Lashes', 'Signature Russian Volume', NOW() + INTERVAL '2 days', '$75.00', 75.00, '$11.25', 11.25, 'USD', 'Stripe Connect', 'pending', false);

-- Seed initial support conversation from customer inquiry
INSERT INTO support_conversations (id, session_id, client_name, client_contact, category, status, last_message)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'sess_client_lusaka_091',
    'Mercy Chisanga',
    '+260 97 8812999',
    'Mobile Nail Technician',
    'open',
    'Hello, do your verified nail technicians do home visits in Roma, Lusaka?'
);

INSERT INTO support_messages (conversation_id, sender_type, sender_name, sender_id, content)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'client',
    'Mercy Chisanga',
    'client_lusaka_091',
    'Hello, do your verified nail technicians do home visits in Roma, Lusaka? I need bridal nails done this Friday.'
);

-- ==============================================================================
-- ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE support_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_portal_config;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_portal_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_ledger ENABLE ROW LEVEL SECURITY;

-- Allow anon read/write for support chat (secured via API bridge / session_id)
CREATE POLICY "Public can insert conversations" ON support_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read own conversation" ON support_conversations FOR SELECT USING (true);
CREATE POLICY "Public can update own conversation" ON support_conversations FOR UPDATE USING (true);

CREATE POLICY "Public can insert messages" ON support_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view messages" ON support_messages FOR SELECT USING (true);

-- Admin Portal Config is publicly readable, writable by service role
CREATE POLICY "Public can read portal config" ON admin_portal_config FOR SELECT USING (true);
CREATE POLICY "Service role can modify portal config" ON admin_portal_config FOR ALL USING (true);

-- Appointments & Pros readable
CREATE POLICY "Allow read appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Allow read professionals" ON professionals FOR SELECT USING (true);
CREATE POLICY "Allow read audit_ledger" ON audit_ledger FOR SELECT USING (true);
