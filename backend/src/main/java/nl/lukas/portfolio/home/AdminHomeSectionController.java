package nl.lukas.portfolio.home;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/home-sections")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminHomeSectionController {

    private final HomeSectionService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<HomeSectionDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Home sections retrieved", service.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeSectionDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Home section retrieved", service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HomeSectionDto>> create(@Valid @RequestBody UpsertHomeSectionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Home section created successfully", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeSectionDto>> update(@PathVariable Long id, @Valid @RequestBody UpsertHomeSectionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Home section updated successfully", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Home section deleted successfully", null));
    }

    @PostMapping("/reorder")
    public ResponseEntity<ApiResponse<Void>> reorder(@RequestBody List<Long> ids) {
        service.reorderSections(ids);
        return ResponseEntity.ok(ApiResponse.success("Home sections reordered successfully", null));
    }
}
