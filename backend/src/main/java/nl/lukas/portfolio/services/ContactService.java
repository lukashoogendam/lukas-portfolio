package nl.lukas.portfolio.services;
import nl.lukas.portfolio.repositories.ContactRepository;
import nl.lukas.portfolio.models.ContactMessage;

import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.dto.request.ContactRequestDto;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public void saveMessage(ContactRequestDto request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.name())
                .email(request.email())
                .message(request.message())
                .build();
        contactRepository.save(message);
    }
}


