package nl.lukas.portfolio.project;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findBySlug(String slug);

    @EntityGraph(attributePaths = {"skills", "images"})
    @Query("SELECT p FROM Project p ORDER BY p.sortOrder ASC")
    List<Project> findAllWithDetails();

    @EntityGraph(attributePaths = {"skills", "images"})
    @Query("SELECT DISTINCT p FROM Project p JOIN p.skills s WHERE LOWER(s.name) = LOWER(:skillName)")
    List<Project> findBySkillName(@Param("skillName") String skillName);
}
