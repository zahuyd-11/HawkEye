-- ============================================
-- Add Onboarding Columns to Profiles Table
-- ============================================
-- Run this SQL in Supabase SQL Editor AFTER running SUPABASE_SCHEMA_FINAL.sql
-- This adds the onboarding survey columns

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS risk_appetite TEXT CHECK (risk_appetite IN ('safe', 'balanced', 'aggressive')),
ADD COLUMN IF NOT EXISTS capital_range TEXT CHECK (capital_range IN ('<100tr', '100tr-1ty', '>1ty')),
ADD COLUMN IF NOT EXISTS investment_goal TEXT CHECK (investment_goal IN ('accumulate', 'swing', 'dividend'));

-- Verify columns were added
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'profiles' AND column_name IN ('risk_appetite', 'capital_range', 'investment_goal');

