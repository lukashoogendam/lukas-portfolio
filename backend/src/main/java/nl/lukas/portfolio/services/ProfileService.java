package nl.lukas.portfolio.services;

import nl.lukas.portfolio.dto.mapper.ProfileMapper;
import nl.lukas.portfolio.dto.request.UpdateProfileRequest;
import nl.lukas.portfolio.dto.request.UpsertProfileTranslationRequest;
import nl.lukas.portfolio.dto.response.ProfileDto;
import nl.lukas.portfolio.exceptions.ResourceNotFoundException;
import nl.lukas.portfolio.models.Profile;
import nl.lukas.portfolio.models.ProfileTranslation;
import nl.lukas.portfolio.repositories.ProfileRepository;
import nl.lukas.portfolio.repositories.ProfileTranslationRepository;
import nl.lukas.portfolio.utils.LanguageHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileTranslationRepository translationRepository;
    private final ProfileMapper profileMapper;

    @Transactional(readOnly = true)
    public ProfileDto getProfile(String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        Profile profile = getFirstProfile();
        Optional<ProfileTranslation> translation = getTranslation(profile.getId(), resolvedLang);
        return profileMapper.toDto(profile, translation);
    }

    @Transactional
    public ProfileDto updateProfile(UpdateProfileRequest request) {
        Profile profile = getFirstProfile();

        if (request.name() != null) profile.setName(request.name());
        if (request.role() != null) profile.setRole(request.role());
        if (request.focus() != null) profile.setFocus(request.focus());
        if (request.location() != null) profile.setLocation(request.location());
        if (request.summary() != null) profile.setSummary(request.summary());
        if (request.email() != null) profile.setEmail(request.email());
        if (request.github() != null) profile.setGithub(request.github());
        if (request.linkedin() != null) profile.setLinkedin(request.linkedin());

        return profileMapper.toDto(profileRepository.save(profile), Optional.empty());
    }

    @Transactional
    public ProfileDto upsertTranslation(String lang, UpsertProfileTranslationRequest request) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        Profile profile = getFirstProfile();

        ProfileTranslation translation = translationRepository
                .findByProfileIdAndLanguageCode(profile.getId(), resolvedLang)
                .orElse(ProfileTranslation.builder()
                        .profile(profile)
                        .languageCode(resolvedLang)
                        .build());

        translation.setRole(request.role());
        translation.setFocus(request.focus());
        translation.setSummary(request.summary());

        translationRepository.save(translation);
        return profileMapper.toDto(profile, Optional.of(translation));
    }

    @Transactional(readOnly = true)
    public ProfileDto getTranslationForAdmin(String lang) {
        String resolvedLang = LanguageHelper.resolveLang(lang);
        Profile profile = getFirstProfile();
        Optional<ProfileTranslation> translation = getTranslation(profile.getId(), resolvedLang);
        return profileMapper.toDto(profile, translation, false);
    }

    private Profile getFirstProfile() {
        return profileRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
    }

    private Optional<ProfileTranslation> getTranslation(Long profileId, String lang) {
        if (LanguageHelper.DEFAULT_LANG.equals(lang)) return Optional.empty();
        return translationRepository.findByProfileIdAndLanguageCode(profileId, lang);
    }
}
