CREATE TABLE assignment_skills (
    assignment_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (assignment_id, skill_id),
    CONSTRAINT fk_assignment_skills_assignment FOREIGN KEY (assignment_id) REFERENCES assignments (id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_skills_skill FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
);
