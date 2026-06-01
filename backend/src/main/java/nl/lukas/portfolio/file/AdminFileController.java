package nl.lukas.portfolio.file;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.lukas.portfolio.common.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

import nl.lukas.portfolio.config.AppProperties;

@Slf4j
@RestController
@RequestMapping("/api/admin/files")
@RequiredArgsConstructor
@Tag(name = "Admin - Files", description = "File upload endpoints (JWT required)")
public class AdminFileController {

    private final FileStorageService fileStorageService;
    private final AppProperties appProperties;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload file", description = "Upload a file (PDF, image, etc.) and get back its public URL")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "File is empty"));
        }

        String contentType = file.getContentType();
        boolean isAllowed = contentType != null && (
                contentType.equals("application/pdf") ||
                contentType.startsWith("image/") ||
                contentType.startsWith("video/") ||
                contentType.equals("application/zip") ||
                contentType.equals("application/x-zip-compressed")
        );

        if (!isAllowed) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "Only PDF, image, video, and ZIP files are allowed"));
        }

        try {
            String filename;
            boolean isZip = contentType.contains("zip");

            if (isZip) {

                filename = fileStorageService.storeAndExtractZip(file);
            } else {

                filename = fileStorageService.store(file);
            }

            String fileUrl = appProperties.baseUrl() + "/uploads/" + filename;

            Map<String, String> data = Map.of(
                    "filename", filename,
                    "url", fileUrl
            );

            return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", data));
        } catch (IOException e) {
            log.error("Upload error: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(500, "Failed to store file: " + e.getMessage()));
        }
    }
}
