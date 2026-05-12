package nl.lukas.portfolio.controllers;

import nl.lukas.portfolio.services.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.dto.response.ApiResponse;
import nl.lukas.portfolio.dto.response.ProjectDetailDto;
import nl.lukas.portfolio.dto.response.ProjectListDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Portfolio projects and school assignments")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Get all projects", description = "Returns a list of all portfolio projects. Use ?lang=en for English.")
    public ResponseEntity<ApiResponse<List<ProjectListDto>>> getAllProjects(
            @RequestParam(defaultValue = "nl") String lang) {
        List<ProjectListDto> projects = projectService.getAllProjects(lang);
        return ResponseEntity.ok(ApiResponse.success("Projects loaded successfully", projects));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get project by slug", description = "Returns detailed information about a specific project. Use ?lang=en for English.")
    public ResponseEntity<ApiResponse<ProjectDetailDto>> getProjectBySlug(
            @PathVariable String slug,
            @RequestParam(defaultValue = "nl") String lang) {
        ProjectDetailDto project = projectService.getProjectBySlug(slug, lang);
        return ResponseEntity.ok(ApiResponse.success("Project loaded successfully", project));
    }
}
