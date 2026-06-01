package nl.lukas.portfolio.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectTranslationRepository extends JpaRepository<ProjectTranslation, Long> {

    Optional<ProjectTranslation> findByProjectIdAndLanguageCode(Long projectId, String languageCode);
}
