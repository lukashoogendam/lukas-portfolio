package nl.lukas.portfolio.featuredskill;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/featured-skills")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFeaturedSkillController {

    private final FeaturedSkillService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeaturedSkillDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Featured skills retrieved", service.getAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeaturedSkillDto>> create(@Valid @RequestBody UpsertFeaturedSkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Featured skill created", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FeaturedSkillDto>> update(@PathVariable Long id, @Valid @RequestBody UpsertFeaturedSkillRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Featured skill updated", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Featured skill deleted", null));
    }

    @PostMapping("/reorder")
    public ResponseEntity<ApiResponse<Void>> reorder(@RequestBody List<Long> ids) {
        service.reorder(ids);
        return ResponseEntity.ok(ApiResponse.success("Featured skills reordered", null));
    }
}
