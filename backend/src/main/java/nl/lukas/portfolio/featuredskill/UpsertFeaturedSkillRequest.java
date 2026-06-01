package nl.lukas.portfolio.featuredskill;

import jakarta.validation.constraints.NotBlank;
import nl.lukas.portfolio.skill.SkillCategory;

public record UpsertFeaturedSkillRequest(
    @NotBlank String name,
    String nameEn,
    String description,
    String descriptionEn,
    SkillCategory category,
    String icon,
    Integer sortOrder
) {}
