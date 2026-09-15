package rs.pupin.evmer.service;

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final int MAX_WIDTH = 1200;
    private static final int MAX_HEIGHT = 1200;
    private static final double IMAGE_QUALITY = 0.80;

    private final Path uploadDirectory;

    public FileStorageService(
            @Value("${app.upload.directory}")
            String uploadDirectory
    ) {
        this.uploadDirectory = Paths
                .get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(this.uploadDirectory);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Nije moguće kreirati direktorijum za slike: "
                            + this.uploadDirectory,
                    exception
            );
        }
    }


    public String saveImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dozvoljeni formati su JPG, PNG i WEBP"
            );
        }

        String extension = switch (file.getContentType()) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nepodržan format slike"
            );
        };

        String outputFormat = switch (file.getContentType()) {
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nepodržan format slike"
            );
        };

        String storedFilename =
                UUID.randomUUID() + extension;

        Path destination = uploadDirectory
                .resolve(storedFilename)
                .normalize();

        Path temporaryFile = uploadDirectory
                .resolve(UUID.randomUUID() + "-compressed" + extension)
                .normalize();

        if (!destination.startsWith(uploadDirectory)
                || !temporaryFile.startsWith(uploadDirectory)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Neispravna putanja fajla"
            );
        }

        try {

            //Citamo original samo da bismo videli dimenzije.
            BufferedImage originalImage =
                    ImageIO.read(file.getInputStream());

            if (originalImage == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Neispravna slika"
                );
            }

            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();

            boolean needsResize =
                    originalWidth > MAX_WIDTH
                            || originalHeight > MAX_HEIGHT;

            if (needsResize) {

                Thumbnails.of(originalImage)
                        .size(MAX_WIDTH, MAX_HEIGHT)
                        .outputFormat(outputFormat)
                        .outputQuality(IMAGE_QUALITY)
                        .toFile(temporaryFile.toFile());

            } else {

                Thumbnails.of(originalImage)
                        .scale(1.0)
                        .outputFormat(outputFormat)
                        .outputQuality(IMAGE_QUALITY)
                        .toFile(temporaryFile.toFile());
            }

            long originalSize = file.getSize();
            long compressedSize = Files.size(temporaryFile);

            if (compressedSize < originalSize) {

                Files.move(
                        temporaryFile,
                        destination,
                        StandardCopyOption.REPLACE_EXISTING
                );

            } else {

                //Ako je kompresija napravila veci fajl, cuvamo original.
                Files.deleteIfExists(temporaryFile);

                try (InputStream originalInputStream =
                             file.getInputStream()) {

                    Files.copy(
                            originalInputStream,
                            destination,
                            StandardCopyOption.REPLACE_EXISTING
                    );
                }
            }

        } catch (IOException exception) {

            try {
                Files.deleteIfExists(temporaryFile);
            } catch (IOException ignored) {
            }

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Slika nije mogla biti sačuvana",
                    exception
            );
        }

        return storedFilename;
    }

    public void deleteImage(String imagePath) {

        if (imagePath == null || imagePath.isBlank()) {
            return;
        }

        String filename = imagePath.substring(
                imagePath.lastIndexOf("/") + 1
        );

        Path filePath = uploadDirectory
                .resolve(filename)
                .normalize();

        if (!filePath.startsWith(uploadDirectory)) {
            log.warn(
                    "Pokušaj brisanja slike van upload direktorijuma: {}",
                    filePath
            );
            return;
        }

        try {
            Files.deleteIfExists(filePath);

        } catch (IOException exception) {

            log.error(
                    "Stara slika nije mogla biti obrisana: {}",
                    filePath,
                    exception
            );
        }
    }

    public Path getUploadDirectory() {
        return uploadDirectory;
    }
}