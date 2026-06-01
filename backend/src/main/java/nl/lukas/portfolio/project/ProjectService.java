package nl.lukas.portfolio.project;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.lukas.portfolio.common.LanguageHelper;
import nl.lukas.portfolio.common.ResourceNotFoundException;
import nl.lukas.portfolio.file.FileStorageService;
import nl.lukas.portfolio.skill.Skill;
import nl.lukas.portfolio.skill.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ProjectMapper projectMapper;
    private final ObjectMapper objectMapper;
    private final FileStorageService fileStorageService;
    private final ProjectTranslationRepository translationRepository;

    @Transactional(readOnly = true)
    public List<ProjectListDto> getAllProjects(String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        return projectRepository.findAllWithDetails().stream()
                .map(project -> projectMapper.toListDto(project, resolvedLang, getTranslation(project.getId(), resolvedLang)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectListDto> getProjectsBySkillName(String skillName, String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        return projectRepository.findBySkillName(skillName).stream()
                .map(project -> projectMapper.toListDto(project, resolvedLang, getTranslation(project.getId(), resolvedLang)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDetailDto getProjectBySlug(String slug, String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Project not found with slug: " + slug));
        Optional<ProjectTranslation> translation = getTranslation(project.getId(), resolvedLang);
        return projectMapper.toDetailDto(project, resolvedLang, translation);
    }

    @Transactional
    public ProjectDetailDto createProject(CreateProjectRequest request) {
        Project project = Project.builder()
                .slug(request.slug())
                .title(request.title())
                .shortDescription(request.shortDescription())
                .description(request.description())
                .role(request.role())
                .highlights(request.highlights())
                .category(request.category())
                .status(request.status())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .repositoryUrl(request.repositoryUrl())
                .features(serializeFeatures(request.features()))
                .courseName(request.courseName())
                .documentUrl(request.documentUrl())
                .highlighted(request.highlighted() != null ? request.highlighted() : false)
                .build();

        assignSkills(project, request.skillIds());
        assignImages(project, request.images());
        assignShowcases(project, request.showcases());
        assignDocuments(project, request.documents());

        Project saved = projectRepository.save(project);
        return projectMapper.toDetailDto(saved, LanguageHelper.DEFAULT_LANG, Optional.empty());
    }

    @Transactional
    public ProjectDetailDto updateProject(String slug, UpdateProjectRequest request) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Project not found with slug: " + slug));

        updateSimpleFields(project, request);
        assignSkills(project, request.skillIds());

        boolean hasNewImages = request.images() != null;
        if (hasNewImages) {
            updateImages(project, request.images());
        }

        boolean hasNewShowcases = request.showcases() != null;
        if (hasNewShowcases) {
            updateShowcases(project, request.showcases());
        }

        boolean hasNewDocuments = request.documents() != null;
        if (hasNewDocuments) {
            updateDocuments(project, request.documents());
        }

        Project saved = projectRepository.save(project);
        return projectMapper.toDetailDto(saved, LanguageHelper.DEFAULT_LANG, Optional.empty());
    }

    private void updateImages(Project project, List<CreateProjectRequest.ProjectImageRequest> newImages) {
        List<String> oldUrls = project.getImages().stream().map(ProjectImage::getImageUrl).toList();
        List<String> newUrls = newImages.stream().map(CreateProjectRequest.ProjectImageRequest::imageUrl).toList();
        deleteRemovedFiles(oldUrls, newUrls);
        project.getImages().clear();
        assignImages(project, newImages);
    }

    private void updateShowcases(Project project, List<CreateProjectRequest.ShowcaseRequest> newShowcases) {
        List<String> oldUrls = project.getShowcases().stream().map(ProjectShowcase::getUrl).toList();
        List<String> newUrls = newShowcases.stream().map(CreateProjectRequest.ShowcaseRequest::url).toList();
        deleteRemovedFiles(oldUrls, newUrls);
        project.getShowcases().clear();
        assignShowcases(project, newShowcases);
    }

    private void updateDocuments(Project project, List<CreateProjectRequest.DocumentRequest> newDocuments) {
        List<String> oldUrls = project.getDocuments().stream().map(ProjectDocument::getUrl).toList();
        List<String> newUrls = newDocuments.stream().map(CreateProjectRequest.DocumentRequest::url).toList();
        deleteRemovedFiles(oldUrls, newUrls);
        project.getDocuments().clear();
        assignDocuments(project, newDocuments);
    }

    private void deleteRemovedFiles(List<String> oldUrls, List<String> newUrls) {
        for (String oldUrl : oldUrls) {
            boolean isRemoved = oldUrl != null && !newUrls.contains(oldUrl);
            if (isRemoved) {
                fileStorageService.deleteFileFromUrl(oldUrl);
            }
        }
    }

    @Transactional
    public void deleteProject(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Project not found with slug: " + slug));

        project.getImages().forEach(img -> fileStorageService.deleteFileFromUrl(img.getImageUrl()));
        project.getShowcases().forEach(sc -> fileStorageService.deleteFileFromUrl(sc.getUrl()));
        project.getDocuments().forEach(doc -> fileStorageService.deleteFileFromUrl(doc.getUrl()));

        projectRepository.delete(project);
    }

    @Transactional
    public ProjectDetailDto upsertTranslation(String slug, String lang, UpsertProjectTranslationRequest request) {
        String resolvedLang = LanguageHelper.resolveLang(lang);

        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with slug: " + slug));

        ProjectTranslation translation = translationRepository
                .findByProjectIdAndLanguageCode(project.getId(), resolvedLang)
                .orElse(ProjectTranslation.builder()
                        .project(project)
                        .languageCode(resolvedLang)
                        .build());

        translation.setTitle(request.title());
        translation.setShortDescription(request.shortDescription());
        translation.setDescription(request.description());
        translation.setRole(request.role());
        translation.setHighlights(request.highlights());
        translation.setFeatures(serializeFeatures(request.features()));
        translation.setCourseName(request.courseName());

        translationRepository.save(translation);

        return projectMapper.toDetailDto(project, resolvedLang, Optional.of(translation));
    }

    @Transactional(readOnly = true)
    public ProjectDetailDto getTranslationForAdmin(String slug, String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with slug: " + slug));
        Optional<ProjectTranslation> translation = getTranslation(project.getId(), resolvedLang);
        return projectMapper.toDetailDto(project, resolvedLang, translation, false);
    }

    private Optional<ProjectTranslation> getTranslation(Long projectId, String lang) {
        if (LanguageHelper.DEFAULT_LANG.equals(lang)) return Optional.empty();
        return translationRepository.findByProjectIdAndLanguageCode(projectId, lang);
    }

    private void updateSimpleFields(Project project, UpdateProjectRequest request) {
        if (request.title() != null) project.setTitle(request.title());
        if (request.shortDescription() != null) project.setShortDescription(request.shortDescription());
        if (request.description() != null) project.setDescription(request.description());
        if (request.role() != null) project.setRole(request.role());
        if (request.highlights() != null) project.setHighlights(request.highlights());
        if (request.category() != null) project.setCategory(request.category());
        if (request.status() != null) project.setStatus(request.status());
        if (request.startDate() != null) project.setStartDate(request.startDate());
        if (request.endDate() != null) project.setEndDate(request.endDate());
        if (request.repositoryUrl() != null) project.setRepositoryUrl(request.repositoryUrl());
        if (request.features() != null) project.setFeatures(serializeFeatures(request.features()));
        if (request.courseName() != null) project.setCourseName(request.courseName());
        if (request.documentUrl() != null) project.setDocumentUrl(request.documentUrl());
        if (request.highlighted() != null) project.setHighlighted(request.highlighted());
    }

    @Transactional
    public void reorderProjects(List<String> slugs) {
        for (int i = 0; i < slugs.size(); i++) {
            String slug = slugs.get(i);
            int finalI = i;
            projectRepository.findBySlug(slug).ifPresent(project -> {
                project.setSortOrder(finalI);
                projectRepository.save(project);
            });
        }
    }

    private void assignSkills(Project project, List<Long> skillIds) {
        if (skillIds != null) {
            List<Skill> skills = skillRepository.findAllById(skillIds);
            project.setSkills(new HashSet<>(skills));
        }
    }

    private void assignImages(Project project, List<CreateProjectRequest.ProjectImageRequest> images) {
        boolean hasImagesToAssign = images != null && !images.isEmpty();
        if (hasImagesToAssign) {
            for (CreateProjectRequest.ProjectImageRequest imgReq : images) {
                ProjectImage image = ProjectImage.builder()
                        .project(project)
                        .title(imgReq.title())
                        .imageUrl(imgReq.imageUrl())
                        .sortOrder(imgReq.sortOrder())
                        .build();
                project.getImages().add(image);
            }
        }
    }

    private void assignShowcases(Project project, List<CreateProjectRequest.ShowcaseRequest> showcases) {
        boolean hasShowcasesToAssign = showcases != null && !showcases.isEmpty();
        if (hasShowcasesToAssign) {
            for (CreateProjectRequest.ShowcaseRequest req : showcases) {
                ProjectShowcase showcase = ProjectShowcase.builder()
                        .project(project)
                        .type(req.type())
                        .title(req.title())
                        .url(req.url())
                        .embedCode(req.embedCode())
                        .sortOrder(req.sortOrder())
                        .build();
                project.getShowcases().add(showcase);
            }
        }
    }

    private void assignDocuments(Project project, List<CreateProjectRequest.DocumentRequest> documents) {
        boolean hasDocumentsToAssign = documents != null && !documents.isEmpty();
        if (hasDocumentsToAssign) {
            for (CreateProjectRequest.DocumentRequest docReq : documents) {
                ProjectDocument document = ProjectDocument.builder()
                        .project(project)
                        .title(docReq.title())
                        .url(docReq.url())
                        .sortOrder(docReq.sortOrder())
                        .build();
                project.getDocuments().add(document);
            }
        }
    }

    private String serializeFeatures(List<String> features) {
        if (features == null || features.isEmpty()) return null;
        try {
            return objectMapper.writeValueAsString(features);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize features: {}", e.getMessage());
            return null;
        }
    }
}
