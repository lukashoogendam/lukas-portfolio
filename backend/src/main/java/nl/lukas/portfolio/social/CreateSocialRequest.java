package nl.lukas.portfolio.social;

import jakarta.validation.constraints.NotBlank;
public record CreateSocialRequest(String platform, String url, String icon, Integer sortOrder) {
}
