-- ================================================
-- V1: Complete Database Schema — Lukas.dev Portfolio
-- Data wordt beheerd door DataSeeder.java
-- ================================================

-- === Projects ===
CREATE TABLE projects (
    id          BIGSERIAL PRIMARY KEY,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    title       VARCHAR(150) NOT NULL,
    short_description TEXT,
    description TEXT,
    category    VARCHAR(100),
    status      VARCHAR(50),
    start_date  DATE,
    end_date    DATE,
    repository_url TEXT,
    role        TEXT,
    highlights  TEXT,
    features    TEXT
);

-- === Project Images ===
CREATE TABLE project_images (
    id          BIGSERIAL PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title       VARCHAR(150),
    image_url   TEXT NOT NULL,
    sort_order  INT DEFAULT 0
);

-- === Project Showcases ===
CREATE TABLE project_showcases (
    id          BIGSERIAL PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,
    title       VARCHAR(150),
    url         TEXT,
    embed_code  TEXT,
    sort_order  INT DEFAULT 0
);

-- === Project Documents ===
CREATE TABLE project_documents (
    id          BIGSERIAL PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title       VARCHAR(150) NOT NULL,
    url         TEXT NOT NULL,
    sort_order  INT DEFAULT 0
);

-- === Skills ===
CREATE TABLE skills (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    category    VARCHAR(100),
    level       VARCHAR(50),
    description TEXT
);

-- === Project Skills (koppeltabel) ===
CREATE TABLE project_skills (
    project_id  BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    skill_id    BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

-- === Assignments ===
CREATE TABLE assignments (
    id           BIGSERIAL PRIMARY KEY,
    slug         VARCHAR(150) UNIQUE NOT NULL,
    title        VARCHAR(150) NOT NULL,
    course_name  VARCHAR(150),
    description  TEXT,
    project_id   BIGINT REFERENCES projects(id) ON DELETE SET NULL,
    document_url TEXT
);

-- === Contact Messages ===
CREATE TABLE contact_messages (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    message     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === Socials ===
CREATE TABLE socials (
    id          BIGSERIAL PRIMARY KEY,
    platform    VARCHAR(50) NOT NULL,
    url         TEXT NOT NULL,
    icon        VARCHAR(50),
    sort_order  INT DEFAULT 0
);

-- === Users (admin) ===
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    first_name  VARCHAR(255),
    last_name   VARCHAR(255),
    role        VARCHAR(50) NOT NULL DEFAULT 'USER'
);

-- Admin account (wachtwoord: admin123, BCrypt hashed)
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('admin@lukas.dev', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Lukas', 'Admin', 'ADMIN');

-- === Indexes ===
CREATE INDEX idx_projects_slug          ON projects(slug);
CREATE INDEX idx_project_images_pid     ON project_images(project_id);
CREATE INDEX idx_project_showcases_pid  ON project_showcases(project_id);
CREATE INDEX idx_project_documents_pid  ON project_documents(project_id);
CREATE INDEX idx_project_skills_pid     ON project_skills(project_id);
CREATE INDEX idx_project_skills_sid     ON project_skills(skill_id);
CREATE INDEX idx_assignments_slug       ON assignments(slug);
CREATE INDEX idx_assignments_pid        ON assignments(project_id);
