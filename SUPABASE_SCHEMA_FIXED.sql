-- ============================================
-- FRACTIAI SYNTHEVERSE CENTRAL DATABASE
-- Fixed version - runs in correct order
-- 
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard
-- 2. Click "SQL Editor" in left sidebar
-- 3. Click "New Query"
-- 4. Copy this ENTIRE file
-- 5. Paste into the editor
-- 6. Click "Run" or press Cmd/Ctrl + Enter
-- ============================================

-- ============================================
-- STEP 1: CREATE ALL TABLES
-- ============================================

-- AUTHENTICATION & USERS
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  
  -- OAuth Integration
  google_id TEXT UNIQUE,
  google_picture TEXT,
  
  -- Stripe Integration
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  
  -- User Metadata
  role TEXT DEFAULT 'user',
  tier TEXT DEFAULT 'sandbox',
  octave INTEGER DEFAULT 0,
  
  -- SYNTH Balance
  synth_balance BIGINT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- CONTRIBUTIONS & CONTENT
CREATE TABLE IF NOT EXISTS public.contributions (
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

-- BLOCKCHAIN & TOKENOMICS
CREATE TABLE IF NOT EXISTS public.allocations (
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

CREATE TABLE IF NOT EXISTS public.epoch_balances (
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

-- ENTERPRISE & SANDBOXES
CREATE TABLE IF NOT EXISTS public.sandboxes (
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

CREATE TABLE IF NOT EXISTS public.sandbox_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_id UUID REFERENCES public.sandboxes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  role TEXT DEFAULT 'contributor',
  permissions TEXT[],
  
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(sandbox_id, user_id)
);

-- CHAT & COLLABORATION
CREATE TABLE IF NOT EXISTS public.chat_rooms (
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

CREATE TABLE IF NOT EXISTS public.chat_messages (
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

CREATE TABLE IF NOT EXISTS public.chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  status TEXT DEFAULT 'active',
  last_read_at TIMESTAMPTZ,
  
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  
  UNIQUE(room_id, user_id)
);

-- SOCIAL & COMMUNITY
CREATE TABLE IF NOT EXISTS public.posts (
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

CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLOG & CONTENT
CREATE TABLE IF NOT EXISTS public.blog_posts (
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

-- SYSTEM & ANALYTICS
CREATE TABLE IF NOT EXISTS public.activity_logs (
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

CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT,
  
  dimensions JSONB,
  
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON public.users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON public.users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

CREATE INDEX IF NOT EXISTS idx_contributions_user ON public.contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON public.contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_metal_class ON public.contributions(metal_class);
CREATE INDEX IF NOT EXISTS idx_contributions_created ON public.contributions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_hash ON public.contributions(content_hash);

CREATE INDEX IF NOT EXISTS idx_allocations_user ON public.allocations(user_id);
CREATE INDEX IF NOT EXISTS idx_allocations_contribution ON public.allocations(contribution_id);
CREATE INDEX IF NOT EXISTS idx_allocations_epoch ON public.allocations(epoch);
CREATE INDEX IF NOT EXISTS idx_allocations_metal ON public.allocations(metal_class);

CREATE INDEX IF NOT EXISTS idx_sandboxes_owner ON public.sandboxes(owner_id);
CREATE INDEX IF NOT EXISTS idx_sandboxes_type ON public.sandboxes(type);
CREATE INDEX IF NOT EXISTS idx_sandboxes_stripe ON public.sandboxes(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_sandbox ON public.posts(sandbox_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_sandbox ON public.blog_posts(sandbox_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.activity_logs(created_at DESC);

-- ============================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sandboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sandbox_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: CREATE RLS POLICIES
-- ============================================

-- Users: Can only see/update own profile
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Contributions: Can see own and public qualified
DROP POLICY IF EXISTS contributions_select ON public.contributions;
CREATE POLICY contributions_select ON public.contributions
  FOR SELECT USING (
    user_id = auth.uid() OR status = 'qualified'
  );

DROP POLICY IF EXISTS contributions_insert_own ON public.contributions;
CREATE POLICY contributions_insert_own ON public.contributions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Sandboxes: Members can see, owner can modify
DROP POLICY IF EXISTS sandboxes_select_member ON public.sandboxes;
CREATE POLICY sandboxes_select_member ON public.sandboxes
  FOR SELECT USING (
    owner_id = auth.uid() OR
    id IN (SELECT sandbox_id FROM public.sandbox_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS sandboxes_update_owner ON public.sandboxes;
CREATE POLICY sandboxes_update_owner ON public.sandboxes
  FOR UPDATE USING (owner_id = auth.uid());

-- Chat: Participants can read messages
DROP POLICY IF EXISTS chat_messages_select ON public.chat_messages;
CREATE POLICY chat_messages_select ON public.chat_messages
  FOR SELECT USING (
    room_id IN (
      SELECT room_id FROM public.chat_participants 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Posts: Public in sandbox
DROP POLICY IF EXISTS posts_select_public ON public.posts;
CREATE POLICY posts_select_public ON public.posts
  FOR SELECT USING (
    sandbox_id IN (
      SELECT id FROM public.sandboxes WHERE is_public = true
    ) OR
    sandbox_id IN (
      SELECT sandbox_id FROM public.sandbox_members WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- SUCCESS!
-- ============================================
-- All tables, indexes, and policies created successfully!
-- 
-- Next steps:
-- 1. Go to Authentication → Providers
-- 2. Enable Google OAuth
-- 3. Add your credentials
-- 4. Start using the API!
-- ============================================
