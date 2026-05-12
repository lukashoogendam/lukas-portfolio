package nl.lukas.portfolio.controllers;
import nl.lukas.portfolio.services.SocialService;
import nl.lukas.portfolio.models.Social;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.dto.response.ApiResponse;
import nl.lukas.portfolio.dto.response.SocialDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/socials")
@RequiredArgsConstructor
@Tag(name = "Socials", description = "Social media links")
public class SocialController {

    private final SocialService socialService;

    @GetMapping
    @Operation(summary = "Get all socials", description = "Returns a list of all social media links")
    public ResponseEntity<ApiResponse<List<SocialDto>>> getAllSocials() {
        List<SocialDto> socials = socialService.getAllSocials();
        return ResponseEntity.ok(ApiResponse.success("Socials loaded successfully", socials));
    }
}


