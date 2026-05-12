package nl.lukas.portfolio.dto.mapper;

import nl.lukas.portfolio.dto.response.SocialDto;
import nl.lukas.portfolio.models.Social;
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
