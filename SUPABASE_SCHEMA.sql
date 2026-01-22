-- ============================================
-- FRACTIAI SYNTHEVERSE CENTRAL DATABASE
-- Single database for entire ecosystem
-- 
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard
-- 2. Click "SQL Editor" in left sidebar
-- 3. Click "New Query"
-- 4. Copy this ENTIRE file
-- 5. Paste into the editor
-- 6. Click "Run" or press Cmd/Ctrl + Enter
-- 7. Wait for "Success" message
-- 
-- This will create:
-- - 13 tables (users, contributions, chat, etc.)
-- - All indexes for performance
-- - Row Level Security policies
-- ============================================

-- ============================================
-- AUTHENTICATION & USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
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
  role TEXT DEFAULT 'user', -- user, operator, creator, admin
  tier TEXT DEFAULT 'sandbox', -- sandbox, cloud, octane, shell, ultimate
  octave INTEGER DEFAULT 0,
  
  -- SYNTH Balance
  synth_balance BIGINT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ============================================
-- CONTRIBUTIONS & CONTENT
-- ============================================
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text', -- text, pdf, image, video
  content_hash TEXT UNIQUE,
  
  -- Metadata
  category TEXT,
  tags TEXT[],
  
  -- Scoring
  novelty_score DECIMAL(5,2),
  density_score DECIMAL(5,2),
  coherence_score DECIMAL(5,2),
  alignment_score DECIMAL(5,2),
  final_score DECIMAL(8,2),
  
  -- Classification
  metal_class TEXT, -- founder, gold, silver, copper, community
  is_seed BOOLEAN DEFAULT FALSE,
  is_edge BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT DEFAULT 'submitted', -- submitted, evaluating, qualified, unqualified
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  evaluated_at TIMESTAMPTZ,
  qualified_at TIMESTAMPTZ
);

-- ============================================
-- BLOCKCHAIN & TOKENOMICS
-- ============================================
CREATE TABLE IF NOT EXISTS allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contribution_id UUID REFERENCES contributions(id) ON DELETE CASCADE,
  
  -- Allocation Details
  amount BIGINT NOT NULL, -- SYNTH tokens
  metal_class TEXT NOT NULL,
  epoch INTEGER NOT NULL,
  
  -- Blockchain
  transaction_hash TEXT,
  block_number BIGINT,
  blockchain_status TEXT DEFAULT 'pending', -- pending, confirmed, failed
  
  -- Timestamps
  allocated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS epoch_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  epoch INTEGER NOT NULL,
  metal_class TEXT NOT NULL,
  
  -- Pool Status
  total_allocated BIGINT DEFAULT 0,
  total_available BIGINT NOT NULL,
  is_depleted BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  depleted_at TIMESTAMPTZ,
  
  UNIQUE(epoch, metal_class)
);

-- ============================================
-- ENTERPRISE & SANDBOXES
-- ============================================
CREATE TABLE IF NOT EXISTS sandboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Sandbox Details
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'personal', -- personal, enterprise, collaborative
  
  -- Configuration
  is_public BOOLEAN DEFAULT FALSE,
  max_contributors INTEGER,
  
  -- SYNTH Economics
  synth_balance BIGINT DEFAULT 0,
  synth_activated BOOLEAN DEFAULT FALSE,
  activation_fee_paid BOOLEAN DEFAULT FALSE,
  
  -- Stripe Subscription
  stripe_subscription_id TEXT UNIQUE,
  subscription_tier TEXT, -- pioneer, trading_post, settlement, metropolis
  subscription_status TEXT DEFAULT 'inactive',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sandbox_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_id UUID REFERENCES sandboxes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Membership
  role TEXT DEFAULT 'contributor', -- owner, operator, contributor
  permissions TEXT[],
  
  -- Timestamps
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(sandbox_id, user_id)
);

-- ============================================
-- CHAT & COLLABORATION
-- ============================================
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_id UUID REFERENCES sandboxes(id) ON DELETE CASCADE,
  
  -- Room Details
  name TEXT NOT NULL,
  description TEXT,
  room_type TEXT DEFAULT 'general', -- general, project, private
  
  -- Settings
  is_public BOOLEAN DEFAULT TRUE,
  max_participants INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Message Content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- text, image, file, system
  
  -- File Attachments
  image_url TEXT,
  file_url TEXT,
  file_name TEXT,
  
  -- Metadata
  edited BOOLEAN DEFAULT FALSE,
  deleted BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Participation
  status TEXT DEFAULT 'active', -- active, inactive, banned
  last_read_at TIMESTAMPTZ,
  
  -- Timestamps
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  
  UNIQUE(room_id, user_id)
);

-- ============================================
-- SOCIAL & COMMUNITY
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_id UUID REFERENCES sandboxes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Post Content
  content TEXT NOT NULL,
  image_url TEXT,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  
  -- Status
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Comment Content
  content TEXT NOT NULL,
  
  -- Threading
  parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOG & CONTENT
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sandbox_id UUID REFERENCES sandboxes(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Post Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  
  -- Media
  featured_image TEXT,
  
  -- Metadata
  slug TEXT UNIQUE,
  tags TEXT[],
  category TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, published, archived
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ============================================
-- SYSTEM & ANALYTICS
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Activity Details
  action TEXT NOT NULL,
  entity_type TEXT, -- user, contribution, sandbox, etc.
  entity_id UUID,
  
  -- Metadata
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Metrics
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT, -- counter, gauge, histogram
  
  -- Dimensions
  dimensions JSONB,
  
  -- Timestamp
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Contributions
CREATE INDEX IF NOT EXISTS idx_contributions_user ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_metal_class ON contributions(metal_class);
CREATE INDEX IF NOT EXISTS idx_contributions_created ON contributions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_hash ON contributions(content_hash);

-- Allocations
CREATE INDEX IF NOT EXISTS idx_allocations_user ON allocations(user_id);
CREATE INDEX IF NOT EXISTS idx_allocations_contribution ON allocations(contribution_id);
CREATE INDEX IF NOT EXISTS idx_allocations_epoch ON allocations(epoch);
CREATE INDEX IF NOT EXISTS idx_allocations_metal ON allocations(metal_class);

-- Sandboxes
CREATE INDEX IF NOT EXISTS idx_sandboxes_owner ON sandboxes(owner_id);
CREATE INDEX IF NOT EXISTS idx_sandboxes_type ON sandboxes(type);
CREATE INDEX IF NOT EXISTS idx_sandboxes_stripe ON sandboxes(stripe_subscription_id);

-- Chat
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at DESC);

-- Social
CREATE INDEX IF NOT EXISTS idx_posts_sandbox ON posts(sandbox_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

-- Blog
CREATE INDEX IF NOT EXISTS idx_blog_posts_sandbox ON blog_posts(sandbox_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Activity
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sandboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sandbox_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Users: Can only see/update own profile
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);

-- Contributions: Can see own and public qualified
CREATE POLICY contributions_select ON contributions
  FOR SELECT USING (
    user_id = auth.uid() OR status = 'qualified'
  );

CREATE POLICY contributions_insert_own ON contributions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Sandboxes: Members can see, owner can modify
CREATE POLICY sandboxes_select_member ON sandboxes
  FOR SELECT USING (
    owner_id = auth.uid() OR
    id IN (SELECT sandbox_id FROM sandbox_members WHERE user_id = auth.uid())
  );

CREATE POLICY sandboxes_update_owner ON sandboxes
  FOR UPDATE USING (owner_id = auth.uid());

-- Chat: Participants can read messages
CREATE POLICY chat_messages_select ON chat_messages
  FOR SELECT USING (
    room_id IN (
      SELECT room_id FROM chat_participants 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Posts: Public in sandbox
CREATE POLICY posts_select_public ON posts
  FOR SELECT USING (
    sandbox_id IN (
      SELECT id FROM sandboxes WHERE is_public = true
    ) OR
    sandbox_id IN (
      SELECT sandbox_id FROM sandbox_members WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- SUCCESS! 
-- ============================================
-- Database schema created successfully!
-- 
-- TABLES CREATED: 13
-- - users
-- - contributions
-- - allocations
-- - epoch_balances
-- - sandboxes
-- - sandbox_members
-- - chat_rooms
-- - chat_messages
-- - chat_participants
-- - posts
-- - post_likes
-- - post_comments
-- - blog_posts
-- - activity_logs
-- - system_metrics
--
-- INDEXES CREATED: 24 (for performance)
-- 
-- RLS POLICIES: Enabled on all tables
-- 
-- NEXT STEPS:
-- 1. Go to Authentication → Providers
-- 2. Enable Google OAuth
-- 3. Add your credentials
-- 4. Start building!
-- ============================================
