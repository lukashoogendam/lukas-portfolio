package nl.lukas.portfolio.skill;

import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SkillMapper {

    public SkillDto toDto(Skill skill) {
        return toDto(skill, Optional.empty(), true);
    }

    public SkillDto toDto(Skill skill, Optional<SkillTranslation> translation) {
        return toDto(skill, translation, true);
    }

    public SkillDto toDto(Skill skill, Optional<SkillTranslation> translation, boolean useFallback) {
        String description = useFallback
                ? translation.map(SkillTranslation::getDescription).filter(s -> s != null && !s.isBlank()).orElse(skill.getDescription())
                : translation.map(SkillTranslation::getDescription).orElse("");

        return SkillDto.builder()
                .id(skill.getId())
                .name(skill.getName())
                .category(skill.getCategory())
                .description(description)
                .sortOrder(skill.getSortOrder())
                .build();
    }
}
