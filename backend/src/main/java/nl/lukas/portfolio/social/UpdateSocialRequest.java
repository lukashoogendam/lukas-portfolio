package nl.lukas.portfolio.social;

public record UpdateSocialRequest(String platform, String url, String icon, Integer sortOrder) {
}
