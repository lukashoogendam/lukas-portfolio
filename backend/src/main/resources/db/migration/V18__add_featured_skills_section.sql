-- Add FEATURED_SKILLS as a home section (before SKILLS)
INSERT INTO home_sections (identifier, title, title_en, subtitle, subtitle_en, content, content_en, sort_order, type, visible, show_terminal)
SELECT 'featured-skills', 'Expertise', 'Expertise', NULL, NULL, '', '', 
       (SELECT sort_order FROM home_sections WHERE identifier = 'skills') - 1,
       'FEATURED_SKILLS', TRUE, FALSE
WHERE NOT EXISTS (SELECT 1 FROM home_sections WHERE identifier = 'featured-skills');

-- Shift sort orders to make room if needed
UPDATE home_sections 
SET sort_order = sort_order + 1 
WHERE sort_order >= (SELECT sort_order FROM home_sections WHERE identifier = 'featured-skills')
AND identifier != 'featured-skills';
