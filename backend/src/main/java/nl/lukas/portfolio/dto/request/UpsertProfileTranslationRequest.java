package nl.lukas.portfolio.dto.request;

public record UpsertProfileTranslationRequest(
    String role,
    String focus,
    String summary
) {}
