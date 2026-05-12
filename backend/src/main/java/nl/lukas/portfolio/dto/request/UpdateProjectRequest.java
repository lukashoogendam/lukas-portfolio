package nl.lukas.portfolio.dto.request;

import java.time.LocalDate;
import java.util.List;

public record UpdateProjectRequest(
    String title, 
    String shortDescription, 
    String description, 
    String role, 
    String highlights, 
    String category, 
    String status, 
    LocalDate startDate, 
    LocalDate endDate, 
    String repositoryUrl, 
    List<String> features, 
    List<Long> skillIds,
    List<CreateProjectRequest.ProjectImageRequest> images,
    List<CreateProjectRequest.ShowcaseRequest> showcases,
    List<CreateProjectRequest.DocumentRequest> documents,
    String courseName,
    String documentUrl
) {
}
