package nl.lukas.portfolio.featuredskill;

import org.springframework.stereotype.Component;

@Component
public class FeaturedSkillMapper {

    public FeaturedSkillDto toDto(FeaturedSkill entity) {
        return FeaturedSkillDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .nameEn(entity.getNameEn())
                .description(entity.getDescription())
                .descriptionEn(entity.getDescriptionEn())
                .category(entity.getCategory())
                .icon(entity.getIcon())
                .sortOrder(entity.getSortOrder())
                .build();
    }
}
