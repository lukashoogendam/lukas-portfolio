package nl.lukas.portfolio.repositories;
import nl.lukas.portfolio.models.Assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Optional<Assignment> findBySlug(String slug);
}


