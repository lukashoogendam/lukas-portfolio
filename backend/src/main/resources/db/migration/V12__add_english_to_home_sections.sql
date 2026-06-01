ALTER TABLE home_sections
ADD COLUMN title_en VARCHAR(150),
ADD COLUMN content_en TEXT;

-- Update existing records with default English values based on the Dutch values
UPDATE home_sections SET title_en = title, content_en = content;
