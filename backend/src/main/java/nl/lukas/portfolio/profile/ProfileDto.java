package nl.lukas.portfolio.profile;

import lombok.Builder;
@Builder
public record ProfileDto(String name, String role, String focus, String location, String summary, String email) {
}
