package nl.lukas.portfolio.repositories;
import nl.lukas.portfolio.models.Project;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findBySlug(String slug);

    @EntityGraph(attributePaths = {"skills", "images"})
    @Query("SELECT p FROM Project p")
    java.util.List<Project> findAllWithDetails();

    @EntityGraph(attributePaths = {"skills", "images"})
    @Query("SELECT DISTINCT p FROM Project p JOIN p.skills s WHERE LOWER(s.name) = LOWER(:skillName)")
    java.util.List<Project> findBySkillName(@Param("skillName") String skillName);

    @EntityGraph(attributePaths = {"skills", "images"})
    @Query("SELECT p FROM Project p WHERE p.category = :category")
    java.util.List<Project> findByCategory(@Param("category") String category);
}


