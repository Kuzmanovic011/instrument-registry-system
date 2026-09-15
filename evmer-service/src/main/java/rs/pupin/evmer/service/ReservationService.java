package rs.pupin.evmer.service;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;
import rs.pupin.evmer.Specification.ReservationSpecification;
import rs.pupin.evmer.Specification.UserSpecification;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.enums.EquipmentStatus;
import rs.pupin.evmer.enums.HistoryEvent;
import rs.pupin.evmer.enums.ReservationStatus;
import rs.pupin.evmer.enums.UserRoles;
import rs.pupin.evmer.mapper.ReservationMapper;
import rs.pupin.evmer.model.*;
import rs.pupin.evmer.repository.AssignmentRepository;
import rs.pupin.evmer.repository.EquipmentRepository;
import rs.pupin.evmer.repository.ReservationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class ReservationService {

    private final CurrentUserService currentUserService;
    private final ReservationRepository reservationRepository;
    private final RepoService repoService;
    private final AssignmentRepository assignmentRepository;
    private final EquipmentRepository equipmentRepository;
    private final EmailService emailService;
    private final ReservationMapper reservationMapper;

    @Transactional
    public ResponseEntity<?> createReservation(
            Long idEquipment,
            CreateReservation request
    )
    {
        Equipment equipment = repoService.getEquipmentById(idEquipment);

        User user = currentUserService.getAuthenticatedUser();
        Reservation reservation = reservationRepository.findByEquipmentIdAndUserIdAndStatus(equipment.getId(),user.getId(), ReservationStatus.AKTIVNA);

        Assignment assignment = assignmentRepository.findByEquipmentIdAndUserIdAndActiveAssignmentTrue(equipment.getId(), user.getId());

        if(reservation != null){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Vec imate aktivnu rezervaciju za trazenu opremu");
        }

        if(assignment != null){
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Oprema je vec kod vas");
        }

        if( equipment.getStatus().equals(EquipmentStatus.ZAUZET)
            || equipment.getStatus().equals(EquipmentStatus.REZERVISAN))
        {
            saveReservation(equipment,user,request.note());
        }
        else {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Trazena oprema nije dostupna za Rezervisanje");
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @Transactional
    public ResponseEntity<?> cancelReservation(
            Long idReservation,
            CancelReservationRequest request
    ) {
        User user = currentUserService.getAuthenticatedUser();

        Reservation reservation;

        if (user.getRole().equals(UserRoles.ADMINISTRATOR)) {

            String adminNote = request.note();

            if (adminNote == null || adminNote.isBlank()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Administrator mora uneti napomenu prilikom otkazivanja rezervacije");
            }

            reservation = reservationRepository
                    .findByIdAndStatus(
                            idReservation,
                            ReservationStatus.AKTIVNA
                    )
                    .orElse(null);

        }

        else {

            reservation = reservationRepository
                    .findByIdAndUserIdAndStatus(
                            idReservation,
                            user.getId(),
                            ReservationStatus.AKTIVNA
                    );
        }


        if (reservation == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Aktivna rezervacija nije pronađena");
        }

        Equipment equipment = reservation.getEquipment();

        Optional<Reservation> firstNextReservation =
                reservationRepository
                        .findFirstByEquipmentIdAndStatusOrderByReservedAtAsc(
                                equipment.getId(),
                                ReservationStatus.AKTIVNA
                        );

        if (firstNextReservation.isPresent() && reservation.getId().equals(firstNextReservation.get().getId())) {

            List<Reservation> allReservationsForEquipment =
                    reservationRepository
                            .findByEquipmentIdAndStatusOrderByReservedAtAsc(
                                    equipment.getId(),
                                    ReservationStatus.AKTIVNA
                            );

            if (allReservationsForEquipment.size() == 1
                    && equipment.getStatus().equals(EquipmentStatus.REZERVISAN)) {

                equipment.setStatus(EquipmentStatus.SLOBODAN);

                equipmentRepository.save(equipment);

                repoService.saveEquipmentHistory(
                        equipment,
                        user,
                        HistoryEvent.OTKAZIVANJE_REZERVACIJE,
                        EquipmentStatus.REZERVISAN.toString(),
                        EquipmentStatus.SLOBODAN.toString(),
                        request.note()
                );
            }

            else if (allReservationsForEquipment.size() > 1) {

                Reservation nextReservation =
                        allReservationsForEquipment.get(1);

                nextReservation.setExpiresAt(
                        LocalDateTime.now().plusHours(48)
                );

                reservationRepository.save(nextReservation);

                try {
                    emailService.sendEquipmentAvailableNotification(
                            nextReservation
                    );
                } catch (Exception exception) {
                    System.err.println(
                            "Mejl nije poslat: " + exception.getMessage()
                    );
                }
            }
        }

        reservation.setStatus(ReservationStatus.OTKAZANA);
        reservation.setExpiresAt(null);

        reservationRepository.saveAndFlush(reservation);

        String reservationNote =request.note();

        repoService.saveEquipmentHistory(
                equipment,
                user,
                HistoryEvent.OTKAZIVANJE_REZERVACIJE,
                ReservationStatus.AKTIVNA.toString(),
                ReservationStatus.OTKAZANA.toString(),
                reservationNote
        );

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

    public void saveReservation(
            Equipment equipment,
            User user,
            String note
    )
    {
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setEquipment(equipment);
        reservation.setNote(note);

        reservationRepository.save(reservation);

        repoService.saveEquipmentHistory(equipment,
                user,
                HistoryEvent.REZERVISANJE,
                equipment.getStatus().toString(),
                EquipmentStatus.REZERVISAN.toString(),
                note
        );
    }

    public ReservationsResponseDto getReservations(
            ReservationFilter request,
            int page,
            int size,
            String sortBy,
            boolean ascending
    ){
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        User user=currentUserService.getAuthenticatedUser();
        long numPageReservations;

        List <Reservation> reservations;

        Page<Reservation> reservationPage;

        Specification<Reservation> specification;

        if (user.getRole().equals(UserRoles.ADMINISTRATOR)){
            specification= Specification
                    .where(ReservationSpecification.hasEquipmentName(request.equipmentName()))
                    .and(ReservationSpecification.hasUserFirstName(request.userFirstName()))
                    .and(ReservationSpecification.hasUserLastName(request.userLastName()))
                    .and(ReservationSpecification.hasStatus(request.status()))
                    .and(ReservationSpecification.hasReservedAt(request.from(),request.to()));
            reservationPage = reservationRepository.findAll(specification,pageable);
            reservations= reservationPage.getContent();
            numPageReservations=reservationPage.getTotalPages();
        }

        else{
            specification= Specification
                    .where(ReservationSpecification.hasEquipmentName(request.equipmentName()))
                    .and(ReservationSpecification.hasUserFirstName(request.userFirstName()))
                    .and(ReservationSpecification.hasUserLastName(request.userLastName()))
                    .and(ReservationSpecification.hasStatus(request.status()))
                    .and(ReservationSpecification.hasReservedAt(request.from(),request.to()));
            reservationPage = reservationRepository.findByUserIdAndStatus(user.getId(),ReservationStatus.AKTIVNA,specification,pageable);
            reservations= reservationPage.getContent();
            numPageReservations=reservationPage.getTotalPages();
        }

        return new ReservationsResponseDto(
                reservationMapper.activeReservationIndexDtoList(reservations),
                numPageReservations
        );
    }

    public Long countActiveReservations(
            Long id
    ){
        Long num=reservationRepository.countByEquipmentIdAndStatus(id,ReservationStatus.AKTIVNA);
        return num;
    }

}
