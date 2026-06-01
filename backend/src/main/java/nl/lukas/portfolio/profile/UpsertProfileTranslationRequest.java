package nl.lukas.portfolio.profile;

public record UpsertProfileTranslationRequest(
    String role,
    String focus,
    String summary
) {}
