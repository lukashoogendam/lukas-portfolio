package nl.lukas.portfolio.project;

import java.time.LocalDate;
import java.util.List;

public record UpdateProjectRequest(
    String title,
    String shortDescription,
    String description,
    String role,
    String highlights,
    ProjectCategory category,
    ProjectStatus status,
    LocalDate startDate,
    LocalDate endDate,
    String repositoryUrl,
    List<String> features,
    List<Long> skillIds,
    List<CreateProjectRequest.ProjectImageRequest> images,
    List<CreateProjectRequest.ShowcaseRequest> showcases,
    List<CreateProjectRequest.DocumentRequest> documents,
    String courseName,
    String documentUrl,
    Boolean highlighted
) {
}
