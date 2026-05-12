package nl.lukas.portfolio.repositories;
import nl.lukas.portfolio.models.Social;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SocialRepository extends JpaRepository<Social, Long> {

    List<Social> findAllByOrderBySortOrderAsc();
}


