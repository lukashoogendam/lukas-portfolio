package nl.lukas.portfolio.social;

import org.springframework.stereotype.Component;

@Component
public class SocialMapper {

    public SocialDto toDto(Social social) {
        return SocialDto.builder()
                .id(social.getId())
                .platform(social.getPlatform())
                .url(social.getUrl())
                .icon(social.getIcon())
                .sortOrder(social.getSortOrder())
                .build();
    }
}
