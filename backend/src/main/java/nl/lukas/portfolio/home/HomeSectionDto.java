package nl.lukas.portfolio.home;

import lombok.Builder;

@Builder
public record HomeSectionDto(
    Long id,
    String identifier,
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
