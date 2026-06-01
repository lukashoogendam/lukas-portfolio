package nl.lukas.portfolio.skill;

import jakarta.validation.constraints.NotBlank;
public record CreateSkillRequest(String name, SkillCategory category, String description) {
}
