package nl.lukas.portfolio.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileTranslationRepository extends JpaRepository<ProfileTranslation, Long> {
    Optional<ProfileTranslation> findByProfileIdAndLanguageCode(Long profileId, String languageCode);
}
