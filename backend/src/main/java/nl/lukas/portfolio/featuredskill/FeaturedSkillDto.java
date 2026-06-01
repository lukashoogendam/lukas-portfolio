package nl.lukas.portfolio.featuredskill;

import lombok.Builder;
import nl.lukas.portfolio.skill.SkillCategory;

@Builder
public record FeaturedSkillDto(
    Long id,
    String name,
    String nameEn,
    String description,
    String descriptionEn,
    SkillCategory category,
    String icon,
    Integer sortOrder
) {}
