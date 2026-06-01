package nl.lukas.portfolio.contact;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    @Transactional
    public void saveMessage(ContactRequestDto request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.name())
                .email(request.email())
                .message(request.message())
                .build();
        contactRepository.save(message);
    }
}
