package nl.lukas.portfolio.dto.mapper;

import nl.lukas.portfolio.dto.response.AssignmentDto;
import nl.lukas.portfolio.models.Assignment;
import nl.lukas.portfolio.models.AssignmentTranslation;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AssignmentMapper {

    public AssignmentDto toDto(Assignment assignment, String lang, Optional<AssignmentTranslation> translation) {
        return toDto(assignment, lang, translation, true);
    }

    public AssignmentDto toDto(Assignment assignment, String lang, Optional<AssignmentTranslation> translation, boolean useFallback) {
        String projectSlug = assignment.getProject() != null ? assignment.getProject().getSlug() : null;
        String projectTitle = assignment.getProject() != null ? assignment.getProject().getTitle() : null;

        String title = useFallback
                ? translation.map(AssignmentTranslation::getTitle).filter(s -> s != null && !s.isBlank()).orElse(assignment.getTitle())
                : translation.map(AssignmentTranslation::getTitle).orElse("");

        String description = useFallback
                ? translation.map(AssignmentTranslation::getDescription).filter(s -> s != null && !s.isBlank()).orElse(assignment.getDescription())
                : translation.map(AssignmentTranslation::getDescription).orElse("");

        return AssignmentDto.builder()
                .id(assignment.getId())
                .slug(assignment.getSlug())
                .title(title)
                .courseName(assignment.getCourseName())
                .description(description)
                .projectSlug(projectSlug)
                .projectTitle(projectTitle)
                .documentUrl(assignment.getDocumentUrl())
                .build();
    }
}
