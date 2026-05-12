package nl.lukas.portfolio.controllers;
import nl.lukas.portfolio.services.ProfileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.dto.response.ApiResponse;
import nl.lukas.portfolio.dto.response.ProfileDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "Personal profile information")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    @Operation(summary = "Get profile", description = "Returns the main portfolio profile info. Use ?lang=en for English.")
    public ResponseEntity<ApiResponse<ProfileDto>> getProfile(
            @RequestParam(defaultValue = "nl") String lang) {
        ProfileDto profile = profileService.getProfile(lang);
        return ResponseEntity.ok(ApiResponse.success("Profile loaded successfully", profile));
    }
}
