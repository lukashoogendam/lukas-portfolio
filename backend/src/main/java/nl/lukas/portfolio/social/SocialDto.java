package nl.lukas.portfolio.social;

import lombok.Builder;
@Builder
public record SocialDto(Long id, String platform, String url, String icon, Integer sortOrder) {
}
