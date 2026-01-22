-- ============================================
-- STEP-BY-STEP TABLE CREATION
-- Run each section separately to find the issue
-- ============================================

-- ============================================
-- SECTION 1: CREATE USERS TABLE ONLY
-- Copy and run THIS SECTION FIRST
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  google_id TEXT UNIQUE,
  google_picture TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  role TEXT DEFAULT 'user',
  tier TEXT DEFAULT 'sandbox',
  octave INTEGER DEFAULT 0,
  synth_balance BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Test: Run this to verify table was created
SELECT * FROM users LIMIT 1;

-- ============================================
-- SECTION 2: CREATE CONTRIBUTIONS TABLE
-- Run THIS SECTION SECOND (after Section 1 works)
-- ============================================

CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text',
  content_hash TEXT UNIQUE,
  category TEXT,
  tags TEXT[],
  novelty_score DECIMAL(5,2),
  density_score DECIMAL(5,2),
  coherence_score DECIMAL(5,2),
  alignment_score DECIMAL(5,2),
  final_score DECIMAL(8,2),
  metal_class TEXT,
  is_seed BOOLEAN DEFAULT FALSE,
  is_edge BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  evaluated_at TIMESTAMPTZ,
  qualified_at TIMESTAMPTZ
);

-- Test: Run this to verify table was created
SELECT * FROM contributions LIMIT 1;

-- ============================================
-- SECTION 3: CREATE SANDBOXES TABLE
-- Run THIS SECTION THIRD
-- ============================================

CREATE TABLE IF NOT EXISTS sandboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'personal',
  is_public BOOLEAN DEFAULT FALSE,
  max_contributors INTEGER,
  synth_balance BIGINT DEFAULT 0,
  synth_activated BOOLEAN DEFAULT FALSE,
  activation_fee_paid BOOLEAN DEFAULT FALSE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_tier TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ
);

-- Test: Run this to verify table was created
SELECT * FROM sandboxes LIMIT 1;

-- ============================================
-- SECTION 4: VERIFY ALL TABLES
-- Run this to see what tables exist
-- ============================================

SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- INSTRUCTIONS:
-- ============================================
-- 1. Run SECTION 1 only
-- 2. If it works, run SECTION 2
-- 3. If it works, run SECTION 3
-- 4. Then run SECTION 4 to verify
--
-- If any section fails, STOP and tell me which one
-- ============================================
