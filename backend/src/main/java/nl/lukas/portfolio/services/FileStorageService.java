package nl.lukas.portfolio.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import nl.lukas.portfolio.config.AppProperties;

@Service
public class FileStorageService {

    private final Path storageLocation;
    private final AppProperties appProperties;

    public FileStorageService(AppProperties appProperties) throws IOException {
        this.appProperties = appProperties;
        this.storageLocation = Paths.get(appProperties.uploadDir()).toAbsolutePath().normalize();
        Files.createDirectories(this.storageLocation);
    }

    public String store(MultipartFile file) throws IOException {
        String originalFilename = StringUtils.cleanPath(
            file.getOriginalFilename() != null ? file.getOriginalFilename() : "file"
        );

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }

        String uniqueFilename = UUID.randomUUID().toString().substring(0, 8) + "_" + originalFilename;
        Path targetPath = this.storageLocation.resolve(uniqueFilename);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return uniqueFilename;
    }

    public Path load(String filename) {
        return storageLocation.resolve(filename);
    }

    public String storeAndExtractZip(MultipartFile file) throws IOException {
        String uniqueFolder = "sites/" + UUID.randomUUID().toString().substring(0, 8);
        Path targetDir = this.storageLocation.resolve(uniqueFolder);
        Files.createDirectories(targetDir);

        String indexPath = null;
        String fallbackHtmlPath = null;

        try (java.util.zip.ZipInputStream zis = new java.util.zip.ZipInputStream(file.getInputStream())) {
            java.util.zip.ZipEntry zipEntry = zis.getNextEntry();

            while (zipEntry != null) {

                Path newPath = targetDir.resolve(zipEntry.getName()).normalize();
                if (!newPath.startsWith(targetDir)) {
                    throw new IOException("Ongeldig pad in ZIP bestand: " + zipEntry.getName());
                }

                if (zipEntry.isDirectory()) {
                    Files.createDirectories(newPath);
                } else {

                    Files.createDirectories(newPath.getParent());
                    Files.copy(zis, newPath, StandardCopyOption.REPLACE_EXISTING);

                    if (zipEntry.getName().endsWith("index.html") && indexPath == null) {
                        indexPath = uniqueFolder + "/" + zipEntry.getName();
                    } else if (zipEntry.getName().endsWith(".html") && fallbackHtmlPath == null) {
                        fallbackHtmlPath = uniqueFolder + "/" + zipEntry.getName();
                    }
                }
                zipEntry = zis.getNextEntry();
            }
        }

        if (indexPath == null) {
            indexPath = fallbackHtmlPath;
        }

        if (indexPath == null) {
            throw new IOException("Geen HTML bestand (.html of index.html) gevonden in de ZIP.");
        }

        return indexPath;
    }

    public void deleteFileFromUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        String uploadsPrefix = appProperties.baseUrl() + "/uploads/";
        if (!fileUrl.startsWith(uploadsPrefix)) {
            return;
        }

        try {

            String relativePath = fileUrl.substring(uploadsPrefix.length());

            if (relativePath.contains("..")) {
                System.err.println("Ongeldig pad gedetecteerd tijdens verwijderen: " + relativePath);
                return;
            }

            if (relativePath.startsWith("sites/")) {

                String[] parts = relativePath.split("/");
                if (parts.length >= 2) {
                    String siteFolder = parts[0] + "/" + parts[1]; 
                    Path targetDir = this.storageLocation.resolve(siteFolder).normalize();

                    if (targetDir.startsWith(this.storageLocation)) {
                        org.springframework.util.FileSystemUtils.deleteRecursively(targetDir);
                    }
                }
            } else {

                Path targetFile = this.storageLocation.resolve(relativePath).normalize();

                if (targetFile.startsWith(this.storageLocation)) {
                    Files.deleteIfExists(targetFile);
                }
            }
        } catch (Exception e) {
            System.err.println("Fout tijdens het verwijderen van fysiek bestand: " + e.getMessage());
        }
    }
}
