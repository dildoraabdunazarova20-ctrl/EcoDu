/*
  # Initial EcoDu Database Schema

  ## Overview
  This migration sets up the complete database structure for the EcoDu educational platform,
  including user profiles, video content, engagement features, and quiz system.

  ## New Tables

  ### 1. `profiles`
  - `id` (uuid, primary key) - References auth.users
  - `name` (text) - User's full name
  - `bio` (text) - Short biography
  - `avatar_url` (text) - Profile photo URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `videos`
  - `id` (uuid, primary key) - Unique video identifier
  - `title` (text) - Video title
  - `description` (text) - Video description
  - `video_url` (text) - YouTube embed URL
  - `slug` (text, unique) - URL-friendly identifier
  - `thumbnail_url` (text) - Video thumbnail image
  - `created_at` (timestamptz) - Upload timestamp
  - `likes_count` (integer) - Cached like count

  ### 3. `video_likes`
  - `id` (uuid, primary key) - Unique like identifier
  - `user_id` (uuid, foreign key) - User who liked
  - `video_id` (uuid, foreign key) - Video that was liked
  - `created_at` (timestamptz) - Like timestamp
  - Unique constraint on (user_id, video_id)

  ### 4. `comments`
  - `id` (uuid, primary key) - Unique comment identifier
  - `user_id` (uuid, foreign key) - Comment author
  - `video_id` (uuid, foreign key) - Associated video
  - `content` (text) - Comment text
  - `created_at` (timestamptz) - Comment timestamp
  - `updated_at` (timestamptz) - Last edit timestamp

  ### 5. `quizzes`
  - `id` (uuid, primary key) - Unique quiz identifier
  - `video_id` (uuid, foreign key) - Associated video
  - `title` (text) - Quiz title
  - `description` (text) - Quiz description
  - `created_at` (timestamptz) - Creation timestamp

  ### 6. `quiz_questions`
  - `id` (uuid, primary key) - Unique question identifier
  - `quiz_id` (uuid, foreign key) - Associated quiz
  - `question_text` (text) - Question content
  - `correct_answer` (text) - Correct answer identifier
  - `order_index` (integer) - Question order
  - `created_at` (timestamptz) - Creation timestamp

  ### 7. `quiz_options`
  - `id` (uuid, primary key) - Unique option identifier
  - `question_id` (uuid, foreign key) - Associated question
  - `option_text` (text) - Option content
  - `option_key` (text) - Option identifier (A, B, C, D)
  - `order_index` (integer) - Option order

  ### 8. `quiz_attempts`
  - `id` (uuid, primary key) - Unique attempt identifier
  - `user_id` (uuid, foreign key) - User who took quiz
  - `quiz_id` (uuid, foreign key) - Quiz taken
  - `score` (integer) - Score achieved
  - `total_questions` (integer) - Total questions in quiz
  - `completed_at` (timestamptz) - Completion timestamp

  ## Security
  - RLS enabled on all tables
  - Users can read all public content
  - Users can only modify their own data
  - Authenticated users can create comments, likes, and take quizzes
  - Public users can view videos and profiles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  video_url text NOT NULL,
  slug text UNIQUE NOT NULL,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  likes_count integer DEFAULT 0
);

-- Create video_likes table
CREATE TABLE IF NOT EXISTS video_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  correct_answer text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_options table
CREATE TABLE IF NOT EXISTS quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text text NOT NULL,
  option_key text NOT NULL,
  order_index integer DEFAULT 0
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Videos policies
CREATE POLICY "Videos are viewable by everyone"
  ON videos FOR SELECT
  USING (true);

-- Video likes policies
CREATE POLICY "Video likes are viewable by everyone"
  ON video_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like videos"
  ON video_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
  ON video_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Quizzes policies
CREATE POLICY "Quizzes are viewable by everyone"
  ON quizzes FOR SELECT
  USING (true);

-- Quiz questions policies
CREATE POLICY "Quiz questions are viewable by everyone"
  ON quiz_questions FOR SELECT
  USING (true);

-- Quiz options policies
CREATE POLICY "Quiz options are viewable by everyone"
  ON quiz_options FOR SELECT
  USING (true);

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_likes_user_id ON video_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id ON quiz_options(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
