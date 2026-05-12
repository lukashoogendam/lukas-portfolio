package nl.lukas.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
public record CreateAssignmentRequest(String title, String courseName, String description, String projectSlug, String documentUrl) {
}
