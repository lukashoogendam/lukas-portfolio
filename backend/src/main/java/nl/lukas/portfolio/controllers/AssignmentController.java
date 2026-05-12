package nl.lukas.portfolio.controllers;

import nl.lukas.portfolio.services.AssignmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.dto.response.AssignmentDto;
import nl.lukas.portfolio.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
@Tag(name = "Assignments", description = "School assignments and coursework")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping
    @Operation(summary = "Get all assignments", description = "Returns a list of all school assignments. Use ?lang=en for English.")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getAllAssignments(
            @RequestParam(defaultValue = "nl") String lang) {
        List<AssignmentDto> assignments = assignmentService.getAllAssignments(lang);
        return ResponseEntity.ok(ApiResponse.success("Assignments loaded successfully", assignments));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get assignment by slug", description = "Returns detailed information about a specific assignment. Use ?lang=en for English.")
    public ResponseEntity<ApiResponse<AssignmentDto>> getAssignmentBySlug(
            @PathVariable String slug,
            @RequestParam(defaultValue = "nl") String lang) {
        AssignmentDto assignment = assignmentService.getAssignmentBySlug(slug, lang);
        return ResponseEntity.ok(ApiResponse.success("Assignment loaded successfully", assignment));
    }
}
