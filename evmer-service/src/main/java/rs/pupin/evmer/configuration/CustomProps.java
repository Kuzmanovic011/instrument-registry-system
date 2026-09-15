package rs.pupin.evmer.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Getter
@Setter
@ConfigurationProperties(prefix = "custom-props")
public class CustomProps {
    private List<String> allowedOrigins;
}
