/*
  # Fix Tag Patterns Unique Constraint

  1. Changes
    - Drop existing unique constraint and index
    - Create new case-insensitive unique constraint
    - Add prefix normalization function
    - Add trigger for automatic prefix normalization
  
  2. Security
    - Maintains existing RLS policies
    - No data loss
*/

-- Drop existing unique constraint and index
DROP INDEX IF EXISTS tag_patterns_document_prefix_idx;

-- Create new case-insensitive unique index
CREATE UNIQUE INDEX tag_patterns_document_prefix_unique_idx 
ON tag_patterns(document_id, UPPER(prefix));

-- Add function to normalize prefix
CREATE OR REPLACE FUNCTION normalize_tag_pattern_prefix()
RETURNS TRIGGER AS $$
BEGIN
    NEW.prefix = UPPER(TRIM(NEW.prefix));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for automatic prefix normalization
DROP TRIGGER IF EXISTS normalize_tag_pattern_prefix ON tag_patterns;
CREATE TRIGGER normalize_tag_pattern_prefix
    BEFORE INSERT OR UPDATE ON tag_patterns
    FOR EACH ROW
    EXECUTE FUNCTION normalize_tag_pattern_prefix();

-- Add validation check for prefix format
ALTER TABLE tag_patterns
DROP CONSTRAINT IF EXISTS tag_pattern_prefix_check;

ALTER TABLE tag_patterns
ADD CONSTRAINT tag_pattern_prefix_check 
CHECK (prefix ~ '^[A-Z0-9\-]+$');