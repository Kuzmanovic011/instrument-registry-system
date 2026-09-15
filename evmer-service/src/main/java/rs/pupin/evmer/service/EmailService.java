package rs.pupin.evmer.service;



import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import rs.pupin.common.mailing.client.EmailTemplate;
import rs.pupin.common.mailing.client.RestMailingClient;
import rs.pupin.evmer.model.Equipment;
import rs.pupin.evmer.model.Reservation;
import rs.pupin.evmer.model.User;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final RestMailingClient restMailingClient;

    @Value("${app.mailing.enabled:true}")
    private boolean mailingEnabled;


//    @PostConstruct
//    private void init(){
//        EmailTemplate emailTemplate = new EmailTemplate();
//
//        emailTemplate.setSubject("Rezervisana oprema je dostupna");
//        emailTemplate.setBody("Poštovani/a "+
//                "oprema koju ste rezervisali sada je dostupna.\n\n" +
//                "Naziv opreme: "+
//                "Broj rezervacije: "+
//                "Molimo vas da preuzmete opremu u predviđenom roku.\n\n" +
//                "EVMER sistem");
//        emailTemplate.setSendTo("tijana.gitaric@gmail.com");
//        emailTemplate.setMailId(1l);
//
//        restMailingClient.sendEmailTlsAuth(emailTemplate);
//    }

    public void sendEquipmentAvailableNotification(
            Reservation reservation
    ) {
        if (!mailingEnabled) {
            return;
        }

        User user = reservation.getUser();
        Equipment equipment = reservation.getEquipment();

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalStateException(
                    "Korisnik nema unetu email adresu."
            );
        }
        EmailTemplate emailTemplate = new EmailTemplate();

        emailTemplate.setSubject("Rezervisana oprema je dostupna");
        emailTemplate.setBody("Poštovani/a " + user.getFirstName() + ",\n\n" +
                "oprema koju ste rezervisali sada je dostupna.\n\n" +
                "Naziv opreme: " + equipment.getName() + "\n" +
                "Broj rezervacije: " + reservation.getId() + "\n\n" +
                "Molimo vas da preuzmete opremu u predviđenom roku.\n\n" +
                "EVMER sistem");
        emailTemplate.setSendTo(user.getEmail());
        emailTemplate.setMailId(1l);

        restMailingClient.sendEmailTlsAuth(emailTemplate);
    }
}
