package rs.pupin.evmer.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import rs.pupin.evmer.enums.EquipmentStatus;
import rs.pupin.evmer.enums.HistoryEvent;
import rs.pupin.evmer.enums.ReservationStatus;
import rs.pupin.evmer.model.Equipment;
import rs.pupin.evmer.model.Reservation;
import rs.pupin.evmer.repository.ReservationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReservationExpirationService {

    private final ReservationRepository reservationRepository;
    private final EmailService emailService;
    private final RepoService repoService;

    @Transactional
    @Scheduled(
            fixedDelayString =
                    "${reservation.expiration-check-interval:60000}"
    )
    public void expireReservations() {

        LocalDateTime now = LocalDateTime.now();

        List<Reservation> expiredReservations =
                reservationRepository
                        .findByStatusAndExpiresAtIsNotNullAndExpiresAtBefore(
                                ReservationStatus.AKTIVNA,
                                now
                        );

        for (Reservation reservation : expiredReservations) {
            expireReservation(reservation, now);
        }
    }

    private void expireReservation(
            Reservation expiredReservation,
            LocalDateTime now
    ) {
        Equipment equipment =
                expiredReservation.getEquipment();

        expiredReservation.setStatus( ReservationStatus.ISTEKLA );

        expiredReservation.setExpiresAt(null);

        reservationRepository.saveAndFlush(expiredReservation);

        saveExpirationHistory(
                equipment,
                expiredReservation
        );

        Optional<Reservation> nextReservation =
                reservationRepository
                        .findFirstByEquipmentIdAndStatusOrderByReservedAtAsc(
                                equipment.getId(),
                                ReservationStatus.AKTIVNA
                        );

        if (nextReservation.isEmpty()) {
            equipment.setStatus(EquipmentStatus.SLOBODAN);
            return;
        }

        Reservation next = nextReservation.get();

        equipment.setStatus(EquipmentStatus.REZERVISAN);

        next.setExpiresAt(
                now.plusHours(48)
        );

        reservationRepository.save(next);

        try {
            emailService.sendEquipmentAvailableNotification(next);
        } catch (Exception exception) {
            System.err.println(
                    "Mejl nije poslat za rezervaciju "
                            + exception.getMessage()
            );
        }
    }

    private void saveExpirationHistory(
            Equipment equipment,
            Reservation reservation
    ) {
        repoService.saveEquipmentHistory(
                equipment,
                reservation.getUser(),
                HistoryEvent.ISTEK_REZERVACIJE,
                ReservationStatus.AKTIVNA.toString(),
                ReservationStatus.ISTEKLA.toString(),
                "Rezervacija je automatski istekla"
        );
    }
}