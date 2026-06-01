package nl.lukas.portfolio.skill;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillTranslationRepository extends JpaRepository<SkillTranslation, Long> {

    Optional<SkillTranslation> findBySkillIdAndLanguageCode(Long skillId, String languageCode);
}
