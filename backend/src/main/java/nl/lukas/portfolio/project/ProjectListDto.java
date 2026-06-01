package nl.lukas.portfolio.project;

import lombok.Builder;

@Builder
public record ProjectListDto(String slug, String title, String shortDescription, ProjectCategory category, ProjectStatus status, String courseName, boolean highlighted, Integer sortOrder) {
}
