package nl.lukas.portfolio.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.dto.request.CreateAssignmentRequest;
import nl.lukas.portfolio.dto.request.UpdateAssignmentRequest;
import nl.lukas.portfolio.dto.request.UpsertAssignmentTranslationRequest;
import nl.lukas.portfolio.services.AssignmentService;
import nl.lukas.portfolio.dto.response.AssignmentDto;
import nl.lukas.portfolio.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/assignments")
@RequiredArgsConstructor
@Tag(name = "Admin - Assignments", description = "Admin CRUD operations for assignments (JWT required)")
public class AdminAssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    @Operation(summary = "Create assignment", description = "Add a new school assignment")
    public ResponseEntity<ApiResponse<AssignmentDto>> createAssignment(@Valid @RequestBody CreateAssignmentRequest request) {
        AssignmentDto assignment = assignmentService.createAssignment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment created successfully", assignment));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update assignment", description = "Update an existing assignment by ID")
    public ResponseEntity<ApiResponse<AssignmentDto>> updateAssignment(
            @PathVariable Long id, @Valid @RequestBody UpdateAssignmentRequest request) {
        AssignmentDto assignment = assignmentService.updateAssignment(id, request);
        return ResponseEntity.ok(ApiResponse.success("Assignment updated successfully", assignment));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete assignment", description = "Delete an assignment by ID")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Assignment deleted successfully")
                .build());
    }

    @GetMapping("/{id}/translations/{lang}")
    @Operation(summary = "Get assignment translation", description = "Returns the assignment data in a specific language without fallback")
    public ResponseEntity<ApiResponse<AssignmentDto>> getTranslation(
            @PathVariable Long id,
            @PathVariable String lang) {
        AssignmentDto assignment = assignmentService.getTranslationForAdmin(id, lang);
        return ResponseEntity.ok(ApiResponse.success("Translation loaded", assignment));
    }

    @PutMapping("/{id}/translations/{lang}")
    @Operation(summary = "Upsert assignment translation", description = "Create or update a translation for an assignment")
    public ResponseEntity<ApiResponse<AssignmentDto>> upsertTranslation(
            @PathVariable Long id,
            @PathVariable String lang,
            @Valid @RequestBody UpsertAssignmentTranslationRequest request) {
        AssignmentDto assignment = assignmentService.upsertTranslation(id, lang, request);
        return ResponseEntity.ok(ApiResponse.success("Translation saved successfully", assignment));
    }
}
