package nl.lukas.portfolio.dto.request;

public record UpdateSocialRequest(String platform, String url, String icon, Integer sortOrder) {
}
