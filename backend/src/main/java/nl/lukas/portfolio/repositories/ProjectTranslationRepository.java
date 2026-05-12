package nl.lukas.portfolio.repositories;

import nl.lukas.portfolio.models.ProjectTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectTranslationRepository extends JpaRepository<ProjectTranslation, Long> {

    Optional<ProjectTranslation> findByProjectIdAndLanguageCode(Long projectId, String languageCode);
}
