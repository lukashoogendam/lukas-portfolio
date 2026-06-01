package nl.lukas.portfolio.skill;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/skills")
@RequiredArgsConstructor
@Tag(name = "Admin - Skills", description = "Admin CRUD operations for skills (JWT required)")
public class AdminSkillController {

    private final SkillService skillService;

    @PostMapping
    @Operation(summary = "Create skill", description = "Add a new skill")
    public ResponseEntity<ApiResponse<SkillDto>> createSkill(@Valid @RequestBody CreateSkillRequest request) {
        SkillDto skill = skillService.createSkill(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Skill created successfully", skill));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update skill", description = "Update an existing skill by ID")
    public ResponseEntity<ApiResponse<SkillDto>> updateSkill(
            @PathVariable Long id, @Valid @RequestBody UpdateSkillRequest request) {
        SkillDto skill = skillService.updateSkill(id, request);
        return ResponseEntity.ok(ApiResponse.success("Skill updated successfully", skill));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete skill", description = "Delete a skill by ID")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Skill deleted successfully")
                .build());
    }

    @GetMapping("/{id}/translations/{lang}")
    @Operation(summary = "Get skill translation", description = "Returns the skill data in a specific language without fallback")
    public ResponseEntity<ApiResponse<SkillDto>> getTranslation(
            @PathVariable Long id,
            @PathVariable String lang) {
        SkillDto skill = skillService.getTranslationForAdmin(id, lang);
        return ResponseEntity.ok(ApiResponse.success("Translation loaded", skill));
    }

    @PutMapping("/{id}/translations/{lang}")
    @Operation(summary = "Upsert skill translation", description = "Create or update a translation for a skill")
    public ResponseEntity<ApiResponse<SkillDto>> upsertTranslation(
            @PathVariable Long id,
            @PathVariable String lang,
            @Valid @RequestBody UpsertSkillTranslationRequest request) {
        SkillDto skill = skillService.upsertTranslation(id, lang, request);
        return ResponseEntity.ok(ApiResponse.success("Translation saved successfully", skill));
    }

    @PostMapping("/reorder")
    @Operation(summary = "Reorder skills", description = "Update the sort order of skills")
    public ResponseEntity<ApiResponse<Void>> reorderSkills(@RequestBody List<Long> ids) {
        skillService.reorderSkills(ids);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Skills reordered successfully")
                .build());
    }
}
