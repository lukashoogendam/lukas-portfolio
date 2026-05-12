package nl.lukas.portfolio.dto.response;

import lombok.Builder;
@Builder
public record SkillDto(Long id, String name, String category, String level, String description, boolean highlighted) {
}
