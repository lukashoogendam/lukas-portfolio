package nl.lukas.portfolio.home;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HomeSectionRepository extends JpaRepository<HomeSection, Long> {
    List<HomeSection> findAllByOrderBySortOrderAsc();
    Optional<HomeSection> findByIdentifier(String identifier);
}
