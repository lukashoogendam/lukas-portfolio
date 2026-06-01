CREATE TABLE timeline_events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(150),
    type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    current BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE home_sections (
    id BIGSERIAL PRIMARY KEY,
    identifier VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(150),
    content TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE projects ADD COLUMN highlighted BOOLEAN NOT NULL DEFAULT FALSE;
