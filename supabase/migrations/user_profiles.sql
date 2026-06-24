-- =============================================
-- JobTracker — User Profile Migration
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query)

-- 1. Create the user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT DEFAULT '',
  job_title TEXT DEFAULT '',
  professional_summary TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  experience_json JSONB DEFAULT '[]',
  education_json JSONB DEFAULT '[]',
  linkedin_url TEXT DEFAULT '',
  portfolio_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- 3. Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — users can only read/write their own profile
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON public.user_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Auto-update updated_at trigger
CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- Storage: cv-uploads bucket
-- =============================================
-- Run this in Supabase SQL Editor as well

-- Create the private cv-uploads bucket (if not already created via dashboard)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-uploads',
  'cv-uploads',
  false,
  5242880, -- 5 MB
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: users can only manage files in their own folder
CREATE POLICY "Users can upload their own CV"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cv-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own CV"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cv-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own CV"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cv-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own CV"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'cv-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
