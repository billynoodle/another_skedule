/*
  # Create annotations table

  1. New Tables
    - `annotations`
      - `id` (uuid, primary key)
      - `document_id` (uuid, foreign key)
      - `type` (text)
      - `position` (jsonb)
      - `tag_pattern_id` (uuid, foreign key, nullable)
      - `extracted_text` (text, nullable)
      - `confidence` (float, nullable)
      - `created_at` (timestamptz)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on `annotations` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('box', 'measurement', 'text')),
  position jsonb NOT NULL,
  tag_pattern_id uuid REFERENCES tag_patterns(id) ON DELETE SET NULL,
  extracted_text text,
  confidence float,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own annotations"
  ON annotations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own annotations"
  ON annotations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own annotations"
  ON annotations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own annotations"
  ON annotations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX annotations_document_id_idx ON annotations(document_id);
CREATE INDEX annotations_tag_pattern_id_idx ON annotations(tag_pattern_id);
CREATE INDEX annotations_user_id_idx ON annotations(user_id);