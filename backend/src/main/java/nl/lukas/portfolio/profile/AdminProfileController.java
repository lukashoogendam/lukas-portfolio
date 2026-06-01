package nl.lukas.portfolio.profile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
@Tag(name = "Admin - Profile", description = "Admin operations for profile (JWT required)")
public class AdminProfileController {

    private final ProfileService profileService;

    @PutMapping
    @Operation(summary = "Update profile", description = "Update the main profile information")
    public ResponseEntity<ApiResponse<ProfileDto>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        ProfileDto profile = profileService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @GetMapping("/translations/{lang}")
    @Operation(summary = "Get profile translation", description = "Returns the profile data in a specific language without fallback")
    public ResponseEntity<ApiResponse<ProfileDto>> getTranslation(
            @PathVariable String lang) {
        ProfileDto profile = profileService.getTranslationForAdmin(lang);
        return ResponseEntity.ok(ApiResponse.success("Translation loaded", profile));
    }

    @PutMapping("/translations/{lang}")
    @Operation(summary = "Upsert profile translation", description = "Create or update a translation for the profile")
    public ResponseEntity<ApiResponse<ProfileDto>> upsertTranslation(
            @PathVariable String lang,
            @Valid @RequestBody UpsertProfileTranslationRequest request) {
        ProfileDto profile = profileService.upsertTranslation(lang, request);
        return ResponseEntity.ok(ApiResponse.success("Translation saved successfully", profile));
    }
}
