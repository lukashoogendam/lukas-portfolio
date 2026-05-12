package nl.lukas.portfolio.repositories;
import nl.lukas.portfolio.models.ContactMessage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<ContactMessage, Long> {
}


