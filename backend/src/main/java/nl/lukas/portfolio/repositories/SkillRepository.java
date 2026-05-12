package nl.lukas.portfolio.repositories;
import nl.lukas.portfolio.models.Skill;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findAllByOrderByCategoryAscNameAsc();

    java.util.Optional<Skill> findByName(String name);
}


