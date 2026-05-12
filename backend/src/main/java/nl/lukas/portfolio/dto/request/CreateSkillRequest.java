package nl.lukas.portfolio.dto.request;

import jakarta.validation.constraints.NotBlank;
public record CreateSkillRequest(String name, String category, String level, String description) {
}
