package rs.pupin.evmer.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import rs.pupin.common.mailing.client.RestMailingClient;

@Configuration
@RequiredArgsConstructor
public class RestClientConfig {

    @Bean
    public RestClient.Builder restClientBuilder() {

        return RestClient.builder();
    }

    @Bean("imptMailingRestClient")
    public RestClient imptMailingRestClient(
            RestClient.Builder restClientBuilder,
            @Value("${app.mailing.url}") String mailingUrl
    ) {
        return restClientBuilder
                .baseUrl(mailingUrl)
                .build();
    }

    @Bean
    public RestMailingClient restMailingClient(RestClient imptMailingRestClient) {
        return new RestMailingClient(imptMailingRestClient);
    }
}
