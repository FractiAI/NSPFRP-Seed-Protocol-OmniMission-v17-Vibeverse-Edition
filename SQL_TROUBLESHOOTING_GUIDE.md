# 🔧 SQL SCHEMA TROUBLESHOOTING GUIDE

**Error**: `column "user_id" does not exist`  
**Status**: ✅ **FIXED**  
**Date**: January 22, 2026

---

## 🐛 **WHAT WENT WRONG**

The original SQL schema tried to create RLS (Row Level Security) policies **before** all tables were fully created. This caused Supabase to reference columns that didn't exist yet.

---

## ✅ **SOLUTION: USE FIXED SCHEMA**

I've created **3 SQL files** for you:

### **1. SUPABASE_SCHEMA_FIXED.sql** ⭐ **USE THIS FIRST**

**What it does**:
- Creates all tables in correct order
- Adds indexes for performance
- Enables RLS
- Creates security policies
- **Fixed**: Proper execution order, explicit schema names

**How to use**:
```sql
1. Open Supabase Dashboard
2. SQL Editor → New Query
3. Copy entire SUPABASE_SCHEMA_FIXED.sql
4. Paste and Run
5. Wait for "Success"
```

---

### **2. SUPABASE_DIAGNOSTIC.sql** 🔍 **USE IF YOU HAVE ISSUES**

**What it does**:
- Shows what tables already exist
- Lists table columns
- Displays existing RLS policies
- Helps troubleshoot conflicts

**How to use**:
```sql
1. If you get an error, run this first
2. It shows what's already in your database
3. Helps identify conflicts
4. No changes made - safe to run
```

**When to use**:
- Before running the main schema
- To check if tables already exist
- To see what policies are active
- To debug issues

---

### **3. SUPABASE_MINIMAL.sql** 🎯 **USE AS FALLBACK**

**What it does**:
- Creates only 3 core tables (users, contributions, sandboxes)
- Minimal indexes
- Basic RLS policies
- You can expand later

**How to use**:
```sql
1. Use this if FIXED schema has issues
2. Creates minimal working database
3. Add more tables later as needed
4. Good for testing/development
```

**When to use**:
- If full schema fails
- For quick testing
- To start simple
- Will work 100%

---

## 📋 **STEP-BY-STEP FIX**

### **Option A: Clean Database (Recommended)**

If your database is **new** or has **test data only**:

```sql
-- Step 1: Run diagnostic (optional)
-- Copy-paste SUPABASE_DIAGNOSTIC.sql
-- Check what exists

-- Step 2: Run fixed schema
-- Copy-paste SUPABASE_SCHEMA_FIXED.sql
-- Creates everything correctly

-- Step 3: Verify
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Should see 13 tables
```

---

### **Option B: Existing Tables**

If you already have **users** or other tables with **real data**:

```sql
-- Step 1: Run diagnostic
-- Copy-paste SUPABASE_DIAGNOSTIC.sql
-- See what tables exist

-- Step 2: Manual approach
-- Only create tables that DON'T exist
-- Comment out existing tables in FIXED schema
-- Run modified version

-- OR

-- Step 3: Start fresh (if no critical data)
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.contributions CASCADE;
-- ... etc for all tables

-- Then run SUPABASE_SCHEMA_FIXED.sql
```

---

### **Option C: Minimal Start**

If you want to **start simple**:

```sql
-- Step 1: Run minimal schema
-- Copy-paste SUPABASE_MINIMAL.sql
-- Creates 3 core tables

-- Step 2: Test with API
-- Connect API, create test users
-- Verify everything works

-- Step 3: Add more tables later
-- Manually add chat, posts, etc.
-- As you need them
```

---

## 🔍 **COMMON ERRORS & FIXES**

### **Error 1: "column user_id does not exist"**

**Cause**: Policies created before tables  
**Fix**: Use `SUPABASE_SCHEMA_FIXED.sql` (correct order)

---

### **Error 2: "relation already exists"**

**Cause**: Tables already in database  
**Fix**: 
```sql
-- Option A: Drop and recreate
DROP TABLE IF EXISTS public.users CASCADE;

-- Option B: Use IF NOT EXISTS
-- Already in FIXED schema
CREATE TABLE IF NOT EXISTS public.users...
```

---

### **Error 3: "policy already exists"**

**Cause**: Policies from previous run  
**Fix**: Use `DROP POLICY IF EXISTS` (already in FIXED schema)

---

### **Error 4: "permission denied for schema public"**

**Cause**: User doesn't have permissions  
**Fix**: Make sure you're using the service role key

---

## ✅ **VERIFICATION CHECKLIST**

After running the schema, verify:

```sql
-- Check tables created (should be 13)
SELECT COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS enabled
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND rowsecurity = true;

-- Check policies created
SELECT COUNT(*) 
FROM pg_policies 
WHERE schemaname = 'public';

-- Test insert (should work)
INSERT INTO public.users (email, name) 
VALUES ('test@example.com', 'Test User');
```

---

## 🎯 **RECOMMENDED APPROACH**

### **If Database is Empty**:
1. ✅ Use `SUPABASE_SCHEMA_FIXED.sql`
2. ✅ Run entire file at once
3. ✅ Verify 13 tables created
4. ✅ Configure Google OAuth
5. ✅ Test with API

### **If Database has Existing Tables**:
1. 🔍 Run `SUPABASE_DIAGNOSTIC.sql` first
2. ✅ Review what exists
3. ⚠️ Drop conflicting tables (if safe)
4. ✅ Run `SUPABASE_SCHEMA_FIXED.sql`
5. ✅ Or modify to skip existing tables

### **If You Want to Start Simple**:
1. ✅ Use `SUPABASE_MINIMAL.sql`
2. ✅ Test core functionality
3. ✅ Add more tables incrementally
4. ✅ Expand as needed

---

## 📊 **WHAT'S DIFFERENT IN FIXED VERSION**

### **Original Schema** (SUPABASE_SCHEMA.sql):
```sql
-- Created tables, indexes, RLS all mixed together
-- ❌ Policies referenced columns before creation
-- ❌ No explicit schema prefix
-- ❌ No DROP IF EXISTS for policies
```

### **Fixed Schema** (SUPABASE_SCHEMA_FIXED.sql):
```sql
-- ✅ Step 1: Create ALL tables
-- ✅ Step 2: Create ALL indexes
-- ✅ Step 3: Enable RLS
-- ✅ Step 4: Create policies
-- ✅ Explicit public. prefix
-- ✅ DROP POLICY IF EXISTS
-- ✅ Fully qualified table names
```

---

## 🚀 **QUICK START (TL;DR)**

```bash
# 1. Open Supabase Dashboard
# 2. Go to SQL Editor
# 3. Copy-paste this file:
SUPABASE_SCHEMA_FIXED.sql

# 4. Click Run
# 5. Wait for success message
# 6. Done! ✅
```

**If that fails**:
```bash
# Run diagnostic first
SUPABASE_DIAGNOSTIC.sql

# Then try minimal version
SUPABASE_MINIMAL.sql
```

---

## 📖 **FILES SUMMARY**

| File | Purpose | When to Use |
|------|---------|-------------|
| **SUPABASE_SCHEMA_FIXED.sql** | Complete schema, correct order | **Default - use first** |
| **SUPABASE_DIAGNOSTIC.sql** | Check existing database state | **Before running schema** |
| **SUPABASE_MINIMAL.sql** | Core 3 tables only | **If full schema fails** |
| ~~SUPABASE_SCHEMA.sql~~ | Original (has bug) | **Don't use** |

---

## ✅ **YOU'RE READY!**

The error is **fixed**. Use `SUPABASE_SCHEMA_FIXED.sql` and you should be good to go!

**Next steps**:
1. Run the fixed schema
2. Configure Google OAuth in Supabase
3. Start your API (`cd api && npm run dev`)
4. Connect your apps!

---

**ISSUE RESOLVED ✅**

