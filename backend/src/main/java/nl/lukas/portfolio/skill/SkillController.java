package nl.lukas.portfolio.skill;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@Tag(name = "Skills", description = "Technical skills and competencies")
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    @Operation(summary = "Get all skills", description = "Returns a list of all technical skills grouped by category. Use ?lang=en for English.")
    public ResponseEntity<ApiResponse<List<SkillDto>>> getAllSkills(
            @RequestParam(defaultValue = "nl") String lang) {
        List<SkillDto> skills = skillService.getAllSkills(lang);
        return ResponseEntity.ok(ApiResponse.success("Skills loaded successfully", skills));
    }
}
