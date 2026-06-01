ALTER TABLE home_sections
ADD COLUMN show_terminal BOOLEAN DEFAULT false NOT NULL;

-- Enable terminal for specific sections as requested
UPDATE home_sections SET show_terminal = true WHERE identifier IN ('projects', 'skills');
