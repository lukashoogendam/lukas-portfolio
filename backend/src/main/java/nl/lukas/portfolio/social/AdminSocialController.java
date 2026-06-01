package nl.lukas.portfolio.social;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/socials")
@RequiredArgsConstructor
@Tag(name = "Admin - Socials", description = "Admin CRUD operations for social links (JWT required)")
public class AdminSocialController {

    private final SocialService socialService;

    @PostMapping
    @Operation(summary = "Create social", description = "Add a new social media link")
    public ResponseEntity<ApiResponse<SocialDto>> createSocial(@Valid @RequestBody CreateSocialRequest request) {
        SocialDto social = socialService.createSocial(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Social created successfully", social));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update social", description = "Update an existing social link by ID")
    public ResponseEntity<ApiResponse<SocialDto>> updateSocial(
            @PathVariable Long id, @Valid @RequestBody UpdateSocialRequest request) {
        SocialDto social = socialService.updateSocial(id, request);
        return ResponseEntity.ok(ApiResponse.success("Social updated successfully", social));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete social", description = "Delete a social link by ID")
    public ResponseEntity<ApiResponse<Void>> deleteSocial(@PathVariable Long id) {
        socialService.deleteSocial(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(200)
                .message("Social deleted successfully")
                .build());
    }
}
