package nl.lukas.portfolio.home;

import jakarta.validation.constraints.NotBlank;

public record UpsertHomeSectionRequest(
    @NotBlank String identifier,
    String title,
    String titleEn,
    String subtitle,
    String subtitleEn,
    String content,
    String contentEn,
    Integer sortOrder,
    String type,
    Boolean visible,
    Boolean showTerminal
) {}
