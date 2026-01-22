-- ============================================
-- MINIMAL SCHEMA - CORE TABLES ONLY
-- Use this if the full schema has issues
-- ============================================

-- Drop existing tables if they have issues
-- (Uncomment if you need to start fresh)
-- DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================
-- CORE TABLES (MINIMAL VERSION)
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  
  google_id TEXT UNIQUE,
  google_picture TEXT,
  
  stripe_customer_id TEXT UNIQUE,
  
  role TEXT DEFAULT 'user',
  tier TEXT DEFAULT 'sandbox',
  synth_balance BIGINT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contributions table
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text',
  
  status TEXT DEFAULT 'submitted',
  final_score DECIMAL(8,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sandboxes table
CREATE TABLE IF NOT EXISTS public.sandboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES (MINIMAL)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_contributions_user ON public.contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_sandboxes_owner ON public.sandboxes(owner_id);

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sandboxes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- BASIC RLS POLICIES
-- ============================================

-- Users can see their own profile
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can see their own contributions
DROP POLICY IF EXISTS contributions_select_own ON public.contributions;
CREATE POLICY contributions_select_own ON public.contributions
  FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own contributions
DROP POLICY IF EXISTS contributions_insert_own ON public.contributions;
CREATE POLICY contributions_insert_own ON public.contributions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can see their own sandboxes
DROP POLICY IF EXISTS sandboxes_select_own ON public.sandboxes;
CREATE POLICY sandboxes_select_own ON public.sandboxes
  FOR SELECT USING (owner_id = auth.uid());

-- ============================================
-- SUCCESS - MINIMAL SCHEMA COMPLETE
-- ============================================
-- You can now expand with additional tables as needed
