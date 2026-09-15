package rs.pupin.evmer.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import rs.pupin.common.mailing.client.RestMailingClient;

@Configuration
@RequiredArgsConstructor
public class ProjectConfiguration {

    @Qualifier("imptMailingRestClient")
    private final RestClient imptMailingRestClient;

    public RestMailingClient restMailingClient(){
        return new RestMailingClient(imptMailingRestClient);
    }
}
