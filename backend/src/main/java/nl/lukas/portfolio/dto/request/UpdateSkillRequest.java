package nl.lukas.portfolio.dto.request;

public record UpdateSkillRequest(String name, String category, String level, String description, Boolean highlighted) {
}
