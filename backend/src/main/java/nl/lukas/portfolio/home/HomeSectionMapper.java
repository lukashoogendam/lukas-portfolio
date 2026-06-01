package nl.lukas.portfolio.home;

import org.springframework.stereotype.Component;

@Component
public class HomeSectionMapper {

    public HomeSectionDto toDto(HomeSection section) {
        return HomeSectionDto.builder()
                .id(section.getId())
                .identifier(section.getIdentifier())
                .title(section.getTitle())
                .titleEn(section.getTitleEn())
                .subtitle(section.getSubtitle())
                .subtitleEn(section.getSubtitleEn())
                .content(section.getContent())
                .contentEn(section.getContentEn())
                .sortOrder(section.getSortOrder())
                .type(section.getType())
                .visible(section.getVisible())
                .showTerminal(section.getShowTerminal())
                .build();
    }
}
