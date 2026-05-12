-- ================================================
-- V5: Remove github and linkedin from Profile
-- Wordt nu beheerd in de socials tabel
-- ================================================

ALTER TABLE profiles DROP COLUMN IF EXISTS github;
ALTER TABLE profiles DROP COLUMN IF EXISTS linkedin;
