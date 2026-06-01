-- Convert remaining skill categories that weren't caught by V17
UPDATE skills SET category = 'TOOLS' WHERE category = 'Documentatie';

-- Catch-all: convert any other unconverted categories to TOOLS
UPDATE skills SET category = 'TOOLS' WHERE category NOT IN ('BACKEND', 'FRONTEND', 'DATABASE', 'DEVOPS', 'TOOLS', 'MOBILE', 'CLOUD');

-- Catch-all for projects: convert any unconverted values
UPDATE projects SET category = 'PERSONAL_PROJECT' WHERE category NOT IN ('SCHOOL_PROJECT', 'PERSONAL_PROJECT');
UPDATE projects SET status = 'COMPLETED' WHERE status NOT IN ('COMPLETED', 'IN_PROGRESS');
