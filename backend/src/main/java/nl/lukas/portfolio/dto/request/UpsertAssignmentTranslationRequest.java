package nl.lukas.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpsertAssignmentTranslationRequest(
    @NotBlank String title,
    String description
) {}
