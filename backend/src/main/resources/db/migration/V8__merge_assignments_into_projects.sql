-- ================================================
-- V8: Merge assignments into projects
-- Assignments worden samengevoegd met projects.
-- course_name en document_url worden nullable velden op projects.
-- ================================================

-- Nieuwe kolommen op projects
ALTER TABLE projects ADD COLUMN course_name VARCHAR(150);
ALTER TABLE projects ADD COLUMN document_url TEXT;

-- course_name ook op project_translations (voor i18n)
ALTER TABLE project_translations ADD COLUMN course_name VARCHAR(150);

-- Assignment tabellen verwijderen (in volgorde vanwege FK's)
DROP TABLE IF EXISTS assignment_skills CASCADE;
DROP TABLE IF EXISTS assignment_translations CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
