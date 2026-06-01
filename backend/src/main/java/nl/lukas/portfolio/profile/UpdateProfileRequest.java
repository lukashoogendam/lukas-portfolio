package nl.lukas.portfolio.profile;

public record UpdateProfileRequest(
    String name,
    String role,
    String focus,
    String location,
    String summary,
    String email
) {}
