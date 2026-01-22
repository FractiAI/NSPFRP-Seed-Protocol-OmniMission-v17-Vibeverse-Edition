-- ============================================
-- SUPER SIMPLE TEST
-- Just create ONE table to test if SQL works
-- ============================================

-- Drop if exists
DROP TABLE IF EXISTS users CASCADE;

-- Create simple users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test insert
INSERT INTO users (email, name) VALUES ('test@example.com', 'Test User');

-- Test select
SELECT * FROM users;

-- ============================================
-- If this works, your database is fine
-- If this fails, there's a permission issue
-- ============================================
