package nl.lukas.portfolio.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.dto.request.CreateProjectRequest;
import nl.lukas.portfolio.dto.request.UpdateProjectRequest;
import nl.lukas.portfolio.dto.request.UpsertProjectTranslationRequest;
import nl.lukas.portfolio.dto.response.ApiResponse;
import nl.lukas.portfolio.services.ProjectService;
import nl.lukas.portfolio.dto.response.ProjectDetailDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/projects")
@RequiredArgsConstructor
@Tag(name = "Admin - Projects", description = "Admin CRUD operations for projects (JWT required)")
public class AdminProjectController {

    private final ProjectService projectService;

    @PostMapping
    @Operation(summary = "Create project", description = "Create a new portfolio project")
    public ResponseEntity<ApiResponse<ProjectDetailDto>> createProject(@Valid @RequestBody CreateProjectRequest request) {
        ProjectDetailDto project = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", project));
    }

    @PutMapping("/{slug}")
    @Operation(summary = "Update project", description = "Update an existing project by slug")
    public ResponseEntity<ApiResponse<ProjectDetailDto>> updateProject(
            @PathVariable String slug, @Valid @RequestBody UpdateProjectRequest request) {
        ProjectDetailDto project = projectService.updateProject(slug, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", project));
    }

    @DeleteMapping("/{slug}")
    @Operation(summary = "Delete project", description = "Delete a project by slug")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable String slug) {
        projectService.deleteProject(slug);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Project deleted successfully")
                .build());
    }

    @GetMapping("/{slug}/translations/{lang}")
    @Operation(summary = "Get project translation", description = "Returns the project data in a specific language (with NL fallback)")
    public ResponseEntity<ApiResponse<ProjectDetailDto>> getTranslation(
            @PathVariable String slug,
            @PathVariable String lang) {
        ProjectDetailDto project = projectService.getTranslationForAdmin(slug, lang);
        return ResponseEntity.ok(ApiResponse.success("Translation loaded", project));
    }

    @PutMapping("/{slug}/translations/{lang}")
    @Operation(summary = "Upsert project translation", description = "Create or update a translation for a project")
    public ResponseEntity<ApiResponse<ProjectDetailDto>> upsertTranslation(
            @PathVariable String slug,
            @PathVariable String lang,
            @Valid @RequestBody UpsertProjectTranslationRequest request) {
        ProjectDetailDto project = projectService.upsertTranslation(slug, lang, request);
        return ResponseEntity.ok(ApiResponse.success("Translation saved successfully", project));
    }
}
