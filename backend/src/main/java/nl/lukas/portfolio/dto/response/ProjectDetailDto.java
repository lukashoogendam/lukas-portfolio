package nl.lukas.portfolio.dto.response;

import lombok.Builder;
import java.time.LocalDate;
import java.util.List;

@Builder
public record ProjectDetailDto(
    Long id,
    String slug,
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
    List<String> techStack,
    List<String> features,
    List<ProjectImageDto> images,
    List<ShowcaseDto> showcases,
    List<DocumentDto> documents,
    LinksDto links
) {
    @Builder
    public record ProjectImageDto(Long id, String title, String imageUrl, Integer sortOrder) {}

    @Builder
    public record ShowcaseDto(Long id, String type, String title, String url, String embedCode, Integer sortOrder) {}

    @Builder
    public record DocumentDto(Long id, String title, String url, Integer sortOrder) {}

    @Builder
    public record LinksDto(String github) {}
}
