-- ============================================
-- HawkEye Platform - Supabase Database Schema
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- Make sure to enable Row Level Security (RLS) on all tables

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Stores user profile information and subscription details
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'Free' CHECK (subscription_tier IN ('Free', 'Plus', 'Pro')),
  subscription_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. TRADE PLANS TABLE
-- ============================================
-- Stores user trading plans/journals
CREATE TABLE IF NOT EXISTS trade_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ticker TEXT,
  strategy TEXT,
  strategy_type TEXT,
  market TEXT,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  entry_price DECIMAL(18, 2),
  exit_price DECIMAL(18, 2),
  target_price DECIMAL(18, 2),
  stop_loss DECIMAL(18, 2),
  position_size DECIMAL(18, 2),
  risk_reward_ratio DECIMAL(10, 2),
  thesis TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  flagged BOOLEAN DEFAULT FALSE,
  flagged_reason TEXT,
  flagged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trade_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own trade plans
CREATE POLICY "Users can view own trade plans"
  ON trade_plans FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own trade plans
CREATE POLICY "Users can insert own trade plans"
  ON trade_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own trade plans
CREATE POLICY "Users can update own trade plans"
  ON trade_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own trade plans
CREATE POLICY "Users can delete own trade plans"
  ON trade_plans FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 3. DEAL DIGEST SAVES TABLE
-- ============================================
-- Stores bookmarks/saves for DealDigest reports
CREATE TABLE IF NOT EXISTS deal_digest_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_digest_id TEXT NOT NULL, -- Reference to DealDigest report ID
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, deal_digest_id)
);

-- Enable RLS
ALTER TABLE deal_digest_saves ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own saves
CREATE POLICY "Users can view own saves"
  ON deal_digest_saves FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own saves
CREATE POLICY "Users can insert own saves"
  ON deal_digest_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own saves
CREATE POLICY "Users can delete own saves"
  ON deal_digest_saves FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_trade_plans_user_id ON trade_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_plans_status ON trade_plans(status);
CREATE INDEX IF NOT EXISTS idx_trade_plans_created_at ON trade_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_digest_saves_user_id ON deal_digest_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_digest_saves_deal_digest_id ON deal_digest_saves(deal_digest_id);

-- ============================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for trade_plans table
CREATE TRIGGER update_trade_plans_updated_at
  BEFORE UPDATE ON trade_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. FUNCTION TO AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
-- This function automatically creates a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, subscription_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    'Free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your tables were created:

-- SELECT * FROM profiles;
-- SELECT * FROM trade_plans;
-- SELECT * FROM deal_digest_saves;

-- ============================================
-- NOTES:
-- ============================================
-- 1. All tables have Row Level Security (RLS) enabled
-- 2. Users can only access their own data
-- 3. Profiles are auto-created when users sign up
-- 4. All timestamps are automatically updated
-- 5. Foreign keys ensure data integrity
-- ============================================

