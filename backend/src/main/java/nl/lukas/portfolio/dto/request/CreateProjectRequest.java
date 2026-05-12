package nl.lukas.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;

public record CreateProjectRequest(
    @NotBlank String slug,
    @NotBlank String title,
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
    List<ProjectImageRequest> images,
    List<ShowcaseRequest> showcases,
    List<DocumentRequest> documents
) {
    public record ProjectImageRequest(
        String title,
        String imageUrl,
        Integer sortOrder
    ) {}

    public record ShowcaseRequest(
        String type,
        String title,
        String url,
        String embedCode,
        Integer sortOrder
    ) {}

    public record DocumentRequest(
        String title,
        String url,
        Integer sortOrder
    ) {}
}
