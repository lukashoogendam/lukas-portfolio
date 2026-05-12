package nl.lukas.portfolio.repositories;

import nl.lukas.portfolio.models.ProfileTranslation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileTranslationRepository extends JpaRepository<ProfileTranslation, Long> {

    Optional<ProfileTranslation> findByProfileIdAndLanguageCode(Long profileId, String languageCode);
}
