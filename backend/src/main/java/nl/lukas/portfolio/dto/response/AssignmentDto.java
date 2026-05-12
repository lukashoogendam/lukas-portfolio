package nl.lukas.portfolio.dto.response;

import lombok.Builder;
@Builder
public record AssignmentDto(Long id, String slug, String title, String courseName, String description, String projectSlug, String projectTitle, String documentUrl) {
}
