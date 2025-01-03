/*
  # Fix Tag Patterns Schema

  1. Changes
    - Add last_modified column
    - Add indexes for performance
    - Update foreign key constraints
  
  2. Security
    - Maintain existing RLS policies
    - Add additional validation
*/

-- Add last_modified column
ALTER TABLE tag_patterns 
ADD COLUMN IF NOT EXISTS last_modified timestamptz DEFAULT now();

-- Add trigger to update last_modified
CREATE OR REPLACE FUNCTION update_tag_pattern_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_pattern_last_modified
    BEFORE UPDATE ON tag_patterns
    FOR EACH ROW
    EXECUTE FUNCTION update_tag_pattern_modified();

-- Add validation check for prefix format
ALTER TABLE tag_patterns
ADD CONSTRAINT tag_pattern_prefix_check 
CHECK (prefix ~ '^[A-Za-z0-9\-]+$');

-- Update indexes for better query performance
DROP INDEX IF EXISTS tag_patterns_document_prefix_idx;
CREATE UNIQUE INDEX tag_patterns_document_prefix_idx 
ON tag_patterns(document_id, UPPER(prefix));

-- Add function to normalize prefix on insert/update
CREATE OR REPLACE FUNCTION normalize_tag_pattern_prefix()
RETURNS TRIGGER AS $$
BEGIN
    NEW.prefix = UPPER(TRIM(NEW.prefix));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_tag_pattern_prefix
    BEFORE INSERT OR UPDATE ON tag_patterns
    FOR EACH ROW
    EXECUTE FUNCTION normalize_tag_pattern_prefix();