package nl.lukas.portfolio.repositories;

import nl.lukas.portfolio.models.AssignmentTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssignmentTranslationRepository extends JpaRepository<AssignmentTranslation, Long> {

    Optional<AssignmentTranslation> findByAssignmentIdAndLanguageCode(Long assignmentId, String languageCode);
}
