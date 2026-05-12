-- ================================================
-- V3: Profile translations — Lukas.dev Portfolio
-- Verplaatst profile van hardcoded naar database
-- ================================================

-- === Profiles ===
CREATE TABLE profiles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    role        VARCHAR(150),
    focus       VARCHAR(255),
    location    VARCHAR(100),
    summary     TEXT,
    email       VARCHAR(255),
    github      TEXT,
    linkedin    TEXT
);

-- === Profile Translations ===
CREATE TABLE profile_translations (
    id              BIGSERIAL PRIMARY KEY,
    profile_id      BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    language_code   VARCHAR(10) NOT NULL,
    role            VARCHAR(150),
    focus           VARCHAR(255),
    summary         TEXT,
    UNIQUE (profile_id, language_code)
);

-- === Indexes ===
CREATE INDEX idx_profile_translations_pid  ON profile_translations(profile_id);
CREATE INDEX idx_profile_translations_lang ON profile_translations(language_code);
