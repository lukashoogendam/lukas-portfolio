package nl.lukas.portfolio.timeline;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/timeline")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTimelineController {

    private final TimelineEventService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TimelineEventDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Timeline events retrieved", service.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TimelineEventDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Timeline event retrieved", service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TimelineEventDto>> create(@Valid @RequestBody UpsertTimelineEventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Timeline event created successfully", service.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TimelineEventDto>> update(@PathVariable Long id, @Valid @RequestBody UpsertTimelineEventRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Timeline event updated successfully", service.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Timeline event deleted successfully", null));
    }
}
