package nl.lukas.portfolio.dto.request;

public record UpdateAssignmentRequest(String title, String courseName, String description, String projectSlug, String documentUrl) {
}
