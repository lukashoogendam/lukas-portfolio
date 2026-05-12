package nl.lukas.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
public record CreateSocialRequest(String platform, String url, String icon, Integer sortOrder) {
}
