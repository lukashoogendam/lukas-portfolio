package nl.lukas.portfolio.dto.response;

import lombok.Builder;

@Builder
public record ProjectListDto(String slug, String title, String shortDescription, String category, String status, String courseName) {
}
