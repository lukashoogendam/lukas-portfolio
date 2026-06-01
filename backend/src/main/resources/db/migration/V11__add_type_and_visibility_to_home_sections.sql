-- Add type column to home_sections to identify what kind of section it represents
ALTER TABLE home_sections ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'CUSTOM_TEXT';
ALTER TABLE home_sections ADD COLUMN visible BOOLEAN NOT NULL DEFAULT TRUE;

-- Seed the 5 native sections if they don't already exist
INSERT INTO home_sections (identifier, title, content, sort_order, type, visible)
VALUES
  ('hero', 'Hero', '', 0, 'HERO', TRUE),
  ('about', 'Over mij', '', 1, 'ABOUT', TRUE),
  ('skills', 'Skills', '', 2, 'SKILLS', TRUE),
  ('projects', 'Projecten', '', 3, 'PROJECTS', TRUE),
  ('timeline', 'Tijdlijn', '', 4, 'TIMELINE', TRUE),
  ('contact', 'Contact', '', 5, 'CONTACT', TRUE)
ON CONFLICT (identifier) DO NOTHING;
