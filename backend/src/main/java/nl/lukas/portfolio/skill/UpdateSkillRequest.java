package nl.lukas.portfolio.skill;

public record UpdateSkillRequest(String name, SkillCategory category, String description) {
}
