-- ============================================
-- DIAGNOSTIC QUERY
-- Run this first to see what tables already exist
-- ============================================

-- Check if users table exists
SELECT 
  table_schema,
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'users',
    'contributions',
    'allocations',
    'sandboxes',
    'chat_rooms',
    'chat_messages',
    'posts'
  )
ORDER BY table_name;

-- Check columns in users table (if it exists)
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Check existing RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
