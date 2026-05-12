package nl.lukas.portfolio.controllers;
import nl.lukas.portfolio.services.ContactService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.lukas.portfolio.dto.response.ApiResponse;
import nl.lukas.portfolio.dto.request.ContactRequestDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Contact form submission")
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    @Operation(summary = "Send contact message", description = "Submit a contact form message")
    public ResponseEntity<ApiResponse<Void>> sendMessage(@Valid @RequestBody ContactRequestDto request) {
        contactService.saveMessage(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Contact message created successfully"));
    }
}


