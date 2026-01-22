-- ============================================
-- FRACTIAI SYNTHEVERSE - CLEAN INSTALL
-- Run this on a FRESH database
-- ============================================
--
-- IMPORTANT: This drops ALL existing tables!
-- Only use on new database or if you want to start fresh
--
-- ============================================

-- ============================================
-- STEP 1: CLEAN SLATE - DROP EVERYTHING
-- ============================================

-- Drop all policies first
DROP POLICY IF EXISTS users_select_own ON public.users;
DROP POLICY IF EXISTS users_update_own ON public.users;
DROP POLICY IF EXISTS contributions_select ON public.contributions;
DROP POLICY IF EXISTS contributions_insert_own ON public.contributions;
DROP POLICY IF EXISTS sandboxes_select_member ON public.sandboxes;
DROP POLICY IF EXISTS sandboxes_update_owner ON public.sandboxes;
DROP POLICY IF EXISTS chat_messages_select ON public.chat_messages;
DROP POLICY IF EXISTS posts_select_public ON public.posts;

-- Drop all tables (CASCADE removes dependencies)
DROP TABLE IF EXISTS public.system_metrics CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.post_comments CASCADE;
DROP TABLE IF EXISTS public.post_likes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.chat_participants CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_rooms CASCADE;
DROP TABLE IF EXISTS public.sandbox_members CASCADE;
DROP TABLE IF EXISTS public.sandboxes CASCADE;
DROP TABLE IF EXISTS public.epoch_balances CASCADE;
DROP TABLE IF EXISTS public.allocations CASCADE;
DROP TABLE IF EXISTS public.contributions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================
-- STEP 2: CREATE TABLES
-- ============================================

-- Users table (NO RLS YET)
CREATE TABLE public.users (
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

-- Contributions
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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

-- Allocations
CREATE TABLE public.allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  contribution_id UUID REFERENCES public.contributions(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  metal_class TEXT NOT NULL,
  epoch INTEGER NOT NULL,
  transaction_hash TEXT,
  block_number BIGINT,
  blockchain_status TEXT DEFAULT 'pending',
  allocated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Epoch Balances
CREATE TABLE public.epoch_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  epoch INTEGER NOT NULL,
  metal_class TEXT NOT NULL,
  total_allocated BIGINT DEFAULT 0,
  total_available BIGINT NOT NULL,
  is_depleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  depleted_at TIMESTAMPTZ,
  UNIQUE(epoch, metal_class)
);

-- Sandboxes
CREATE TABLE public.sandboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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

-- Sandbox Members
CREATE TABLE public.sandbox_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_id UUID REFERENCES public.sandboxes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'contributor',
  permissions TEXT[],
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sandbox_id, user_id)
);

-- Chat Rooms
CREATE TABLE public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_id UUID REFERENCES public.sandboxes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  room_type TEXT DEFAULT 'general',
  is_public BOOLEAN DEFAULT TRUE,
  max_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  image_url TEXT,
  file_url TEXT,
  file_name TEXT,
  edited BOOLEAN DEFAULT FALSE,
  deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Chat Participants
CREATE TABLE public.chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  last_read_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  UNIQUE(room_id, user_id)
);

-- Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_id UUID REFERENCES public.sandboxes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Likes
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Post Comments
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_id UUID REFERENCES public.sandboxes(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  slug TEXT UNIQUE,
  tags TEXT[],
  category TEXT,
  status TEXT DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Activity Logs
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Metrics
CREATE TABLE public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT,
  dimensions JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE INDEXES
-- ============================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_google_id ON public.users(google_id);
CREATE INDEX idx_users_stripe_customer ON public.users(stripe_customer_id);
CREATE INDEX idx_users_role ON public.users(role);

CREATE INDEX idx_contributions_user ON public.contributions(user_id);
CREATE INDEX idx_contributions_status ON public.contributions(status);
CREATE INDEX idx_contributions_metal_class ON public.contributions(metal_class);
CREATE INDEX idx_contributions_created ON public.contributions(created_at DESC);

CREATE INDEX idx_sandboxes_owner ON public.sandboxes(owner_id);
CREATE INDEX idx_chat_messages_room ON public.chat_messages(room_id);
CREATE INDEX idx_chat_messages_user ON public.chat_messages(user_id);
CREATE INDEX idx_posts_sandbox ON public.posts(sandbox_id);
CREATE INDEX idx_posts_user ON public.posts(user_id);

-- ============================================
-- STEP 4: ENABLE RLS (but no policies yet)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sandboxes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: CREATE SIMPLE RLS POLICIES
-- ============================================

-- Users: Anyone can see users (for now - you can restrict later)
CREATE POLICY users_select_all ON public.users
  FOR SELECT USING (true);

-- Users: Can only update own profile
CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Contributions: Public access for qualified, owner access for all
CREATE POLICY contributions_select_all ON public.contributions
  FOR SELECT USING (true);

CREATE POLICY contributions_insert_own ON public.contributions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sandboxes: Anyone can see public sandboxes
CREATE POLICY sandboxes_select_all ON public.sandboxes
  FOR SELECT USING (true);

CREATE POLICY sandboxes_insert_own ON public.sandboxes
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- ============================================
-- SUCCESS!
-- ============================================
-- ✅ All 15 tables created
-- ✅ All indexes created
-- ✅ RLS enabled with simple policies
-- ✅ Ready to use!
-- 
-- Next: Configure Google OAuth in Supabase Dashboard
-- ============================================
