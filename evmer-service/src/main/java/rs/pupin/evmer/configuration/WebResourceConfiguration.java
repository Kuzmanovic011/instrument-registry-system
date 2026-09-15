package rs.pupin.evmer.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import rs.pupin.evmer.service.FileStorageService;

@Configuration
@RequiredArgsConstructor
public class WebResourceConfiguration

        implements WebMvcConfigurer {

    private final FileStorageService fileStorageService;

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {
        String resourceLocation =
                fileStorageService
                        .getUploadDirectory()
                        .toUri()
                        .toString();

        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation);
    }
}