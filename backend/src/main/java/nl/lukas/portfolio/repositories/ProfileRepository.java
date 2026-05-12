package nl.lukas.portfolio.repositories;

import nl.lukas.portfolio.models.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
