package nl.lukas.portfolio.featuredskill;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeaturedSkillRepository extends JpaRepository<FeaturedSkill, Long> {
    List<FeaturedSkill> findAllByOrderBySortOrderAsc();
}
