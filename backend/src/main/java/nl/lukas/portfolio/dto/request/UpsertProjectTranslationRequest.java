package nl.lukas.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record UpsertProjectTranslationRequest(
    @NotBlank String title,
    String shortDescription,
    String description,
    String role,
    String highlights,
    List<String> features
) {}
