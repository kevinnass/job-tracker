-- =============================================
-- JobTracker — Database Schema
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query)

-- 1. Create the job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT DEFAULT '',
  company_name TEXT NOT NULL DEFAULT '',
  company_info TEXT DEFAULT '',
  job_profile TEXT DEFAULT '',
  main_missions TEXT DEFAULT '',
  primary_skills TEXT DEFAULT '',
  proposed_salary TEXT DEFAULT '',
  applied_at TIMESTAMPTZ,
  company_feedback TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'applied', 'interview', 'rejected', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index for performance
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);

-- 3. Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — users can only access their own data
CREATE POLICY "Users can view their own applications"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.job_applications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
  ON public.job_applications FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Auto-update updated_at on changes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_job_application_updated
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Create the ia_contents table for storing AI generation results
CREATE TABLE IF NOT EXISTS public.ia_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('cover_letter', 'follow_up', 'interview_prep')),
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, content_type)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_ia_contents_application_id ON public.ia_contents(application_id);
CREATE INDEX IF NOT EXISTS idx_ia_contents_user_id ON public.ia_contents(user_id);

-- Enable Row Level Security
ALTER TABLE public.ia_contents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own AI contents"
  ON public.ia_contents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI contents"
  ON public.ia_contents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI contents"
  ON public.ia_contents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI contents"
  ON public.ia_contents FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updating updated_at on changes
CREATE TRIGGER on_ia_content_updated
  BEFORE UPDATE ON public.ia_contents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. Create the ia_chat_messages table for persisting conversations
CREATE TABLE IF NOT EXISTS public.ia_chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE, -- NULL for General Chat
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries by user and application context
CREATE INDEX IF NOT EXISTS idx_ia_chat_messages_user_app ON public.ia_chat_messages(user_id, application_id);

-- Enable Row Level Security
ALTER TABLE public.ia_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own chat messages"
  ON public.ia_chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON public.ia_chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages"
  ON public.ia_chat_messages FOR DELETE
  USING (auth.uid() = user_id);


