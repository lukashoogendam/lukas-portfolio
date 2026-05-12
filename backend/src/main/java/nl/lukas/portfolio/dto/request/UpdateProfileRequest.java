package nl.lukas.portfolio.dto.request;

public record UpdateProfileRequest(
    String name,
    String role,
    String focus,
    String location,
    String summary,
    String email
) {}
