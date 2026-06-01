-- Convert category values to enum names
UPDATE projects SET category = 'SCHOOL_PROJECT' WHERE category = 'Schoolproject';
UPDATE projects SET category = 'PERSONAL_PROJECT' WHERE category = 'Eigen project';

-- Convert status values to enum names
UPDATE projects SET status = 'COMPLETED' WHERE status = 'Afgerond';
UPDATE projects SET status = 'IN_PROGRESS' WHERE status = 'In ontwikkeling';
