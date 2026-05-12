package nl.lukas.portfolio.services;

import nl.lukas.portfolio.dto.mapper.AssignmentMapper;
import nl.lukas.portfolio.dto.request.CreateAssignmentRequest;
import nl.lukas.portfolio.dto.request.UpdateAssignmentRequest;
import nl.lukas.portfolio.dto.request.UpsertAssignmentTranslationRequest;
import nl.lukas.portfolio.dto.response.AssignmentDto;
import nl.lukas.portfolio.exceptions.ResourceNotFoundException;
import nl.lukas.portfolio.models.Assignment;
import nl.lukas.portfolio.models.AssignmentTranslation;
import nl.lukas.portfolio.models.Project;
import nl.lukas.portfolio.repositories.AssignmentRepository;
import nl.lukas.portfolio.repositories.AssignmentTranslationRepository;
import nl.lukas.portfolio.repositories.ProjectRepository;
import nl.lukas.portfolio.utils.LanguageHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final ProjectRepository projectRepository;
    private final AssignmentMapper assignmentMapper;
    private final AssignmentTranslationRepository translationRepository;



    @Transactional(readOnly = true)
    public List<AssignmentDto> getAllAssignments(String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        return assignmentRepository.findAll().stream()
                .map(assignment -> assignmentMapper.toDto(assignment, resolvedLang, getTranslation(assignment.getId(), resolvedLang)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssignmentDto getAssignmentBySlug(String slug, String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        Assignment assignment = assignmentRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment with slug " + slug + " not found"));
        Optional<AssignmentTranslation> translation = getTranslation(assignment.getId(), resolvedLang);
        return assignmentMapper.toDto(assignment, resolvedLang, translation);
    }

    @Transactional
    public AssignmentDto createAssignment(CreateAssignmentRequest request) {
        Assignment assignment = Assignment.builder()
                .title(request.title())
                .courseName(request.courseName())
                .description(request.description())
                .documentUrl(request.documentUrl())
                .build();

        assignProjectToAssignment(assignment, request.projectSlug());

        return assignmentMapper.toDto(assignmentRepository.save(assignment), LanguageHelper.DEFAULT_LANG, Optional.empty());
    }

    @Transactional
    public AssignmentDto updateAssignment(Long id, UpdateAssignmentRequest request) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        if (request.title() != null) assignment.setTitle(request.title());
        if (request.courseName() != null) assignment.setCourseName(request.courseName());
        if (request.description() != null) assignment.setDescription(request.description());
        if (request.documentUrl() != null) assignment.setDocumentUrl(request.documentUrl());

        assignProjectToAssignment(assignment, request.projectSlug());

        return assignmentMapper.toDto(assignmentRepository.save(assignment), LanguageHelper.DEFAULT_LANG, Optional.empty());
    }

    @Transactional
    public void deleteAssignment(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        assignmentRepository.delete(assignment);
    }

    @Transactional
    public AssignmentDto upsertTranslation(Long id, String lang, UpsertAssignmentTranslationRequest request) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        AssignmentTranslation translation = translationRepository
                .findByAssignmentIdAndLanguageCode(id, resolvedLang)
                .orElse(AssignmentTranslation.builder()
                        .assignment(assignment)
                        .languageCode(resolvedLang)
                        .build());

        translation.setTitle(request.title());
        translation.setDescription(request.description());

        translationRepository.save(translation);
        return assignmentMapper.toDto(assignment, resolvedLang, Optional.of(translation));
    }

    @Transactional(readOnly = true)
    public AssignmentDto getTranslationForAdmin(Long id, String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        Optional<AssignmentTranslation> translation = getTranslation(id, resolvedLang);
        return assignmentMapper.toDto(assignment, resolvedLang, translation, false);
    }

    private Optional<AssignmentTranslation> getTranslation(Long assignmentId, String lang) {
        if (LanguageHelper.DEFAULT_LANG.equals(lang)) return Optional.empty();
        return translationRepository.findByAssignmentIdAndLanguageCode(assignmentId, lang);
    }


    private void assignProjectToAssignment(Assignment assignment, String projectSlug) {
        boolean hasProject = projectSlug != null;
        if (hasProject) {
            Project project = projectRepository.findBySlug(projectSlug)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Project not found with slug: " + projectSlug));
            assignment.setProject(project);
        }
    }
}
