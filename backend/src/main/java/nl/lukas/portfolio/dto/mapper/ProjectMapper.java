package nl.lukas.portfolio.dto.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import nl.lukas.portfolio.dto.response.ProjectDetailDto;
import nl.lukas.portfolio.dto.response.ProjectListDto;
import nl.lukas.portfolio.models.Project;
import nl.lukas.portfolio.models.ProjectImage;
import nl.lukas.portfolio.models.ProjectTranslation;
import nl.lukas.portfolio.models.Skill;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProjectMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProjectListDto toListDto(Project project, String lang, Optional<ProjectTranslation> translation) {
        String title = translation.map(ProjectTranslation::getTitle)
                .filter(s -> s != null && !s.isBlank())
                .orElse(project.getTitle());

        String shortDescription = translation.map(ProjectTranslation::getShortDescription)
                .filter(s -> s != null && !s.isBlank())
                .orElse(project.getShortDescription());

        return ProjectListDto.builder()
                .slug(project.getSlug())
                .title(title)
                .shortDescription(shortDescription)
                .category(project.getCategory())
                .status(project.getStatus())
                .build();
    }

    public ProjectDetailDto toDetailDto(Project project, String lang, Optional<ProjectTranslation> translation) {
        return toDetailDto(project, lang, translation, true);
    }

    public ProjectDetailDto toDetailDto(Project project, String lang, Optional<ProjectTranslation> translation, boolean useFallback) {
        String title = useFallback 
                ? translation.map(ProjectTranslation::getTitle).filter(s -> s != null && !s.isBlank()).orElse(project.getTitle())
                : translation.map(ProjectTranslation::getTitle).orElse("");

        String shortDescription = useFallback
                ? translation.map(ProjectTranslation::getShortDescription).filter(s -> s != null && !s.isBlank()).orElse(project.getShortDescription())
                : translation.map(ProjectTranslation::getShortDescription).orElse("");

        String description = useFallback
                ? translation.map(ProjectTranslation::getDescription).filter(s -> s != null && !s.isBlank()).orElse(project.getDescription())
                : translation.map(ProjectTranslation::getDescription).orElse("");

        String role = useFallback
                ? translation.map(ProjectTranslation::getRole).filter(s -> s != null && !s.isBlank()).orElse(project.getRole())
                : translation.map(ProjectTranslation::getRole).orElse("");

        String highlights = useFallback
                ? translation.map(ProjectTranslation::getHighlights).filter(s -> s != null && !s.isBlank()).orElse(project.getHighlights())
                : translation.map(ProjectTranslation::getHighlights).orElse("");

        String featuresJson = useFallback
                ? translation.map(ProjectTranslation::getFeatures).filter(s -> s != null && !s.isBlank()).orElse(project.getFeatures())
                : translation.map(ProjectTranslation::getFeatures).orElse("");

        List<String> techStack = project.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toList());

        List<ProjectDetailDto.ProjectImageDto> images = project.getImages().stream()
                .map(this::toImageDto)
                .collect(Collectors.toList());

        List<String> features = parseFeatures(featuresJson);

        List<ProjectDetailDto.ShowcaseDto> showcases = project.getShowcases().stream()
                .map(this::toShowcaseDto)
                .collect(Collectors.toList());

        List<ProjectDetailDto.DocumentDto> documents = project.getDocuments().stream()
                .map(this::toDocumentDto)
                .collect(Collectors.toList());

        ProjectDetailDto.LinksDto links = ProjectDetailDto.LinksDto.builder()
                .github(project.getRepositoryUrl())
                .build();

        return ProjectDetailDto.builder()
                .id(project.getId())
                .slug(project.getSlug())
                .title(title)
                .shortDescription(shortDescription)
                .description(description)
                .role(role)
                .highlights(highlights)
                .category(project.getCategory())
                .status(project.getStatus())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .repositoryUrl(project.getRepositoryUrl())
                .techStack(techStack)
                .features(features)
                .images(images)
                .showcases(showcases)
                .documents(documents)
                .links(links)
                .build();
    }

    private ProjectDetailDto.ProjectImageDto toImageDto(ProjectImage img) {
        return ProjectDetailDto.ProjectImageDto.builder()
                .id(img.getId())
                .title(img.getTitle())
                .imageUrl(img.getImageUrl())
                .sortOrder(img.getSortOrder())
                .build();
    }

    private List<String> parseFeatures(String featuresJson) {
        if (featuresJson == null || featuresJson.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(featuresJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }

    private ProjectDetailDto.ShowcaseDto toShowcaseDto(nl.lukas.portfolio.models.ProjectShowcase sc) {
        return ProjectDetailDto.ShowcaseDto.builder()
                .id(sc.getId())
                .type(sc.getType())
                .title(sc.getTitle())
                .url(sc.getUrl())
                .embedCode(sc.getEmbedCode())
                .sortOrder(sc.getSortOrder())
                .build();
    }

    private ProjectDetailDto.DocumentDto toDocumentDto(nl.lukas.portfolio.models.ProjectDocument doc) {
        return ProjectDetailDto.DocumentDto.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .url(doc.getUrl())
                .sortOrder(doc.getSortOrder())
                .build();
    }
}
