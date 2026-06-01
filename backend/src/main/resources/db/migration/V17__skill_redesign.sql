-- Remove level and highlighted from skills
ALTER TABLE skills DROP COLUMN level;
ALTER TABLE skills DROP COLUMN highlighted;

-- Convert category string values to enum names
UPDATE skills SET category = 'BACKEND' WHERE category = 'Backend';
UPDATE skills SET category = 'FRONTEND' WHERE category = 'Frontend';
UPDATE skills SET category = 'DATABASE' WHERE category = 'Database';
UPDATE skills SET category = 'DEVOPS' WHERE category = 'DevOps';
UPDATE skills SET category = 'TOOLS' WHERE category = 'Tools';

-- Create featured_skills table
CREATE TABLE featured_skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    name_en VARCHAR(150),
    description TEXT,
    description_en TEXT,
    category VARCHAR(50),
    sort_order INTEGER NOT NULL DEFAULT 0
);
