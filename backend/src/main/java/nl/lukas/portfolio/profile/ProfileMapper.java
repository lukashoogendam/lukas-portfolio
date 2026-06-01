package nl.lukas.portfolio.profile;

import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class ProfileMapper {

    public ProfileDto toDto(Profile profile, Optional<ProfileTranslation> translation) {
        return toDto(profile, translation, true);
    }

    public ProfileDto toDto(Profile profile, Optional<ProfileTranslation> translation, boolean useFallback) {
        String role = resolveField(
                translation.map(ProfileTranslation::getRole),
                profile.getRole(), useFallback);

        String focus = resolveField(
                translation.map(ProfileTranslation::getFocus),
                profile.getFocus(), useFallback);

        String summary = resolveField(
                translation.map(ProfileTranslation::getSummary),
                profile.getSummary(), useFallback);

        return ProfileDto.builder()
                .name(profile.getName())
                .role(role)
                .focus(focus)
                .location(profile.getLocation())
                .summary(summary)
                .email(profile.getEmail())
                .build();
    }

    private String resolveField(Optional<String> translatedValue, String fallback, boolean useFallback) {
        if (useFallback) {
            return translatedValue.filter(s -> s != null && !s.isBlank()).orElse(fallback);
        }
        return translatedValue.orElse("");
    }
}
