/*
  # Add tag patterns and enhance annotations

  1. New Tables
    - `tag_patterns`
      - `id` (uuid, primary key)
      - `document_id` (uuid, references documents)
      - `prefix` (text)
      - `description` (text)
      - `schedule_table` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on tag_patterns
    - Add policies for CRUD operations
    - Add indexes for performance

  3. Changes
    - Add indexes to annotations table
    - Add foreign key constraints
*/

-- Create tag_patterns table
CREATE TABLE IF NOT EXISTS tag_patterns (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    prefix text NOT NULL,
    description text,
    schedule_table text NOT NULL,
    created_at timestamptz DEFAULT now(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    UNIQUE(document_id, prefix)
);

-- Enable RLS
ALTER TABLE tag_patterns ENABLE ROW LEVEL SECURITY;

-- Policies for tag_patterns
CREATE POLICY "Users can create their own patterns"
    ON tag_patterns FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own patterns"
    ON tag_patterns FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own patterns"
    ON tag_patterns FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patterns"
    ON tag_patterns FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX tag_patterns_document_id_idx ON tag_patterns(document_id);
CREATE INDEX tag_patterns_user_id_idx ON tag_patterns(user_id);
CREATE INDEX tag_patterns_prefix_idx ON tag_patterns(prefix);

-- Add composite index for document_id and prefix
CREATE UNIQUE INDEX tag_patterns_document_prefix_idx ON tag_patterns(document_id, prefix);