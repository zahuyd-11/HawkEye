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
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'Free' CHECK (subscription_tier IN ('Free', 'Pro')),
  subscription_expiry TIMESTAMPTZ,
  -- Onboarding data
  risk_appetite TEXT CHECK (risk_appetite IN ('safe', 'balanced', 'aggressive')),
  capital_range TEXT CHECK (capital_range IN ('<100tr', '100tr-1ty', '>1ty')),
  investment_goal TEXT CHECK (investment_goal IN ('accumulate', 'swing', 'dividend')),
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
-- 3. SAVED DEALS TABLE
-- ============================================
-- Stores bookmarks/saves for DealDigest reports
CREATE TABLE IF NOT EXISTS saved_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_digest_id TEXT NOT NULL, -- Reference to DealDigest report ID
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, deal_digest_id)
);

-- Enable RLS
ALTER TABLE saved_deals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own saved deals
CREATE POLICY "Users can view own saved deals"
  ON saved_deals FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own saved deals
CREATE POLICY "Users can insert own saved deals"
  ON saved_deals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own saved deals
CREATE POLICY "Users can delete own saved deals"
  ON saved_deals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_trade_plans_user_id ON trade_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_plans_status ON trade_plans(status);
CREATE INDEX IF NOT EXISTS idx_trade_plans_created_at ON trade_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_deals_user_id ON saved_deals(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_deals_deal_digest_id ON saved_deals(deal_digest_id);

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
  INSERT INTO public.profiles (id, email, full_name, avatar_url, subscription_tier, risk_appetite, capital_range, investment_goal)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.avatar_url, NULL),
    'Free',
    NULL,
    NULL,
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
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
-- SELECT * FROM saved_deals;

-- ============================================
-- NOTES:
-- ============================================
-- 1. All tables have Row Level Security (RLS) enabled
-- 2. Users can only access their own data
-- 3. Profiles are auto-created when users sign up
-- 4. All timestamps are automatically updated
-- 5. Foreign keys ensure data integrity
-- 6. subscription_tier: 'Free' or 'Pro' (as per requirements)
-- ============================================

