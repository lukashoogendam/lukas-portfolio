-- ================================================
-- V2: Translation tables — Lukas.dev Portfolio
-- Voegt meertaligheid toe via aparte vertaaltabellen (NL/EN)
-- Fallback: als vertaling ontbreekt, gebruik NL uit hoofdtabel
-- ================================================

-- === Project Translations ===
CREATE TABLE project_translations (
    id                BIGSERIAL PRIMARY KEY,
    project_id        BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    language_code     VARCHAR(10) NOT NULL,
    title             VARCHAR(150) NOT NULL,
    short_description TEXT,
    description       TEXT,
    role              TEXT,
    highlights        TEXT,
    features          TEXT,
    UNIQUE (project_id, language_code)
);

-- === Assignment Translations ===
CREATE TABLE assignment_translations (
    id              BIGSERIAL PRIMARY KEY,
    assignment_id   BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    language_code   VARCHAR(10) NOT NULL,
    title           VARCHAR(150) NOT NULL,
    description     TEXT,
    UNIQUE (assignment_id, language_code)
);

-- === Skill Translations ===
CREATE TABLE skill_translations (
    id              BIGSERIAL PRIMARY KEY,
    skill_id        BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    language_code   VARCHAR(10) NOT NULL,
    description     TEXT,
    UNIQUE (skill_id, language_code)
);

-- === Indexes ===
CREATE INDEX idx_project_translations_pid  ON project_translations(project_id);
CREATE INDEX idx_project_translations_lang ON project_translations(language_code);
CREATE INDEX idx_assignment_translations_aid  ON assignment_translations(assignment_id);
CREATE INDEX idx_assignment_translations_lang ON assignment_translations(language_code);
CREATE INDEX idx_skill_translations_sid   ON skill_translations(skill_id);
CREATE INDEX idx_skill_translations_lang  ON skill_translations(language_code);
