package nl.lukas.portfolio.repositories;
import nl.lukas.portfolio.models.Project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findBySlug(String slug);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"skills", "images"})
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Project p")
    java.util.List<Project> findAllWithDetails();
}


