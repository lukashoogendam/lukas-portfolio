package nl.lukas.portfolio.skill;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findAllByOrderBySortOrderAscCategoryAscNameAsc();

    java.util.Optional<Skill> findByName(String name);
}
