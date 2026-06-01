package nl.lukas.portfolio.skill;

import lombok.Builder;
@Builder
public record SkillDto(Long id, String name, SkillCategory category, String description, Integer sortOrder) {
}
