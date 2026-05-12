-- ================================================
-- V4: Add empty profile — Lukas.dev Portfolio
-- Zorgt ervoor dat er altijd een leeg profiel is
-- ================================================

INSERT INTO profiles (id, name, role, focus, location, summary, email, github, linkedin)
VALUES (1, '', '', '', '', '', '', '', '')
ON CONFLICT (id) DO NOTHING;
