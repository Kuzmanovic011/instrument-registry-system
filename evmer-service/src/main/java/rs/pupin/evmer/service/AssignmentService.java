package rs.pupin.evmer.service;


import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import rs.pupin.evmer.Specification.AssignmentSpecification;
import rs.pupin.evmer.Specification.HistorySpecification;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.enums.*;
import rs.pupin.evmer.mapper.AssignmentMapper;
import rs.pupin.evmer.mapper.EquipmentHistoryMapper;
import rs.pupin.evmer.model.*;
import rs.pupin.evmer.repository.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentMapper assignmentMapper;
    private final EquipmentHistoryMapper equipmentHistoryMapper;
    private final EquipmentHistoryRepository equipmentHistoryRepository;
    private final EquipmentRepository equipmentRepository;
    private final ReservationRepository reservationRepository;
    private final EmailService emailService;
    private final CurrentUserService currentUserService;
    private final RepoService repoService;
    private final FaultReportRepository faultReportRepository;

    public AssignmentResponse getAssignment(
            AssignmentFilter request,
            ExpectedTableSort table,
            int page,
            int size,
            String sortBy,
            boolean ascending
    ) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        List<Assignment> assignments = new ArrayList<>();
        List<EquipmentHistory> histories = new ArrayList<>();

        long numPageActiveAssignment = 0;
        long numPageHistoryAssignment = 0;

        if (currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.OPERATER)) {
            Specification<Assignment> specification = Specification
                            .where(AssignmentSpecification.isActive())
                            .and(
                                    AssignmentSpecification.belongsToUser(
                                            currentUserService
                                                    .getAuthenticatedUser()
                                                    .getId()
                                    )
                            )
                            .and(AssignmentSpecification.hasEquipmentName(request.equipmentName()))
                            .and(AssignmentSpecification.hasUserFirstName(request.userFirstName()))
                            .and(AssignmentSpecification.hasUserLastName(request.userLastName()))
                            .and(AssignmentSpecification.hasProjectOrTask(request.projectOrTask()))
                            .and(AssignmentSpecification.hasAssignedAt(request.from(), request.to()));

            assignments = assignmentRepository.findAll(specification, pageable).getContent();
            numPageActiveAssignment = assignmentRepository.findAll(specification, pageable).getTotalPages();

            return new AssignmentResponse(
                    assignmentMapper.toDtoActiveAssignmentResponseList(assignments),
                    numPageActiveAssignment,
                    null,
                    null
            );
        }
        else {
            switch (table) {
                case ASSIGNMENTS -> {
                    Specification<Assignment> specification = Specification
                                    .where(AssignmentSpecification.isActive())
                                    .and(AssignmentSpecification.hasEquipmentName(request.equipmentName()))
                                    .and(AssignmentSpecification.hasUserFirstName(request.userFirstName()))
                                    .and(AssignmentSpecification.hasUserLastName(request.userLastName()))
                                    .and(AssignmentSpecification.hasProjectOrTask(request.projectOrTask()))
                                    .and(AssignmentSpecification.hasAssignedAt(request.from(), request.to()));

                    assignments = assignmentRepository.findAll(specification, pageable).getContent();
                    numPageActiveAssignment = assignmentRepository.findAll(specification,pageable).getTotalPages();

                    histories = equipmentHistoryRepository.findByEventType(HistoryEvent.ZADUZENJE);
                    numPageHistoryAssignment = (long) Math.ceil((double) histories.size() / size);
                }

                case HISTORY -> {
                    Specification<EquipmentHistory> specification =
                            Specification
                                    .where(HistorySpecification.hasEventType(HistoryEvent.ZADUZENJE))
                                    .and(HistorySpecification.hasEquipmentName(request.equipmentName()))
                                    .and(HistorySpecification.hasUserFirstName(request.userFirstName()))
                                    .and(HistorySpecification.hasUserLastName(request.userLastName()))
                                    .and(HistorySpecification.hasPerformedAt(request.from(), request.to()));

                    assignments = assignmentRepository.findByActiveAssignmentTrue();
                    numPageActiveAssignment = (long) Math.ceil((double) assignments.size() / size);

                    histories = equipmentHistoryRepository.findAll(specification, pageable).getContent();
                    numPageHistoryAssignment = equipmentHistoryRepository.findAll(specification, pageable).getTotalPages();
                }
            }
            return new AssignmentResponse(
                    assignmentMapper.toDtoActiveAssignmentResponseList(assignments),
                    numPageActiveAssignment,
                    equipmentHistoryMapper.toDtoHistoryAssignemntResponseList(histories),
                    numPageHistoryAssignment
            );
        }
    }

    @Transactional
    public ResponseEntity<?> unassignEquipment(
            Long id,
            UnassignRequest request
    ){
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Zaduzenje sa ID-em " + id + " nije pronađeno."
                ));

        if(!assignment.isActiveAssignment()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Oprema je vec razduzena!");
        }

        assignment.setActiveAssignment(false);
        assignment.setReturnedAt(LocalDateTime.now());
        assignment.setReturnNote(request.returnNote());
        assignment.setReturnCondition(request.returnCondition());

        Assignment savedAssignment = assignmentRepository.save(assignment);

        repoService.saveEquipmentHistory(
                savedAssignment.getEquipment(),
                savedAssignment.getUser(),
                HistoryEvent.RAZDUZENJE,
                EquipmentStatus.ZAUZET.toString(),
                EquipmentStatus.SLOBODAN.toString(),
                request.returnNote()
        );

        Equipment equipment = repoService.getEquipmentById(savedAssignment.getEquipment().getId());

        if(request.returnCondition().equals(ReturnCondition.OSTECEN) ||
                request.returnCondition().equals(ReturnCondition.NEISPRAVAN))
        {
            createFaultReportForReturnedEquipment(
                    equipment,
                    savedAssignment.getUser(),
                    new EquipmentFaultReport(
                            request.desc(),
                            request.severity(),
                            request.returnCondition()
                    )
            );

        }
        else {

            Optional<Reservation> firstReservation = reservationRepository.findFirstByEquipmentIdAndStatusOrderByReservedAtAsc(equipment.getId(), ReservationStatus.AKTIVNA);

            if(firstReservation.isEmpty())
            {
                equipment.setStatus(EquipmentStatus.SLOBODAN);

                if(!equipment.getAccessories().isEmpty())
                {
                    for (Equipment accessories : equipment.getAccessories())
                    {
                        accessories.setStatus(EquipmentStatus.SLOBODAN);

                        Assignment assignment1 = assignmentRepository.findByEquipmentIdAndActiveAssignmentTrue(accessories.getId());

                        assignment1.setActiveAssignment(false);
                        assignment1.setReturnedAt(LocalDateTime.now());
                        assignment1.setReturnNote(request.returnNote());
                        assignment1.setReturnCondition(request.returnCondition());

                        assignmentRepository.save(assignment1);
                        equipmentRepository.save(accessories);
                    }
                }
            }
            else
            {
                equipment.setStatus(EquipmentStatus.REZERVISAN);
                Reservation reservation = firstReservation.get();

                for(Equipment accessories : equipment.getAccessories())
                {
                    accessories.setStatus(EquipmentStatus.REZERVISAN);
                }

                reservation.setExpiresAt(
                        LocalDateTime.now().plusHours(48)
                );

                reservationRepository.save(reservation);

                try {
                    emailService.sendEquipmentAvailableNotification(reservation);
                } catch (Exception exception) {
                    System.err.println(
                            "Mejl nije poslat: " + exception.getMessage()
                    );
                }
            }
            equipmentRepository.save(equipment);
        }

        return ResponseEntity.status(HttpStatus.OK).build();
    }


    //dodavanje zaduzenja
    @Transactional
    public ResponseEntity<?> assignEquipment(
            Long id,
            CreateAssignment request
    ){
        User user = currentUserService.getAuthenticatedUser();

        Equipment equipment = repoService.getEquipmentById(id);

        validateEquipmentCanBeAssigned(equipment, user);
        validateAccessoriesAreAvailable(equipment);

        if(equipment.getStatus().equals(EquipmentStatus.REZERVISAN))
        {
            Optional<Reservation> reservation = reservationRepository.findFirstByEquipmentIdAndStatusOrderByReservedAtAsc(equipment.getId(), ReservationStatus.AKTIVNA);
            reservation.get().setStatus(ReservationStatus.REALIZOVANA);
            reservation.get().setExpiresAt(null);
            reservationRepository.save(reservation.get());
        }
        EquipmentStatus oldStatus = equipment.getStatus();

        equipment.setStatus(EquipmentStatus.ZAUZET);

        for (Equipment accessory : equipment.getAccessories()) {
            accessory.setStatus(EquipmentStatus.ZAUZET);

            Assignment savedAssignment = saveAssignment(
                    accessory,
                    user,
                    request
            );
        }

        Equipment savedEquipment = equipmentRepository.save(equipment);


        Assignment savedAssignment = saveAssignment(
                savedEquipment,
                user,
                request
        );

        saveAssignmentHistory(
                savedEquipment,
                user,
                savedAssignment,
                oldStatus
        );

        return ResponseEntity.ok().build();
    }

    private void validateEquipmentCanBeAssigned(
            Equipment equipment,
            User user
    ) {
        if (equipment.isDeleted()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Oprema nije dostupna"
            );
        }

        if (equipment.getStatus().equals(EquipmentStatus.SLOBODAN)) {
            return;
        }

        if (equipment.getStatus().equals(EquipmentStatus.REZERVISAN))
        {
            validateReservationOwner(equipment, user);
            return;
        }

        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Oprema nije slobodna i ne može biti zadužena"
        );
    }

    private void validateReservationOwner(
            Equipment equipment,
            User user
    ) {
        Optional<Reservation> reservation = reservationRepository.findFirstByEquipmentIdAndStatusOrderByReservedAtAsc( equipment.getId(), ReservationStatus.AKTIVNA );

        if (reservation.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Aktivna rezervacija nije pronađena"
            );
        }

        if (!reservation.get().getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Opremu je rezervisao drugi korisnik"
            );
        }

    }


    private void validateAccessoriesAreAvailable(
            Equipment equipment
    ) {
        for (Equipment accessory : equipment.getAccessories()) {

            if (accessory.isDeleted()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Prateća oprema nije dostupna: "
                                + accessory.getName()
                );
            }

            if (accessory.getStatus() != EquipmentStatus.SLOBODAN) {
                System.out.println("1212");
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Prateća oprema nije slobodna: "
                                + accessory.getName()
                );
            }
        }
    }


    private Assignment saveAssignment(
            Equipment equipment,
            User user,
            CreateAssignment request
    ) {
        Assignment assignment = new Assignment();

        assignment.setEquipment(equipment);
        assignment.setUser(user);
        assignment.setProjectOrTask(request.projectOrTask());
        assignment.setAssignmentNote(request.assignmentNote());

        return assignmentRepository.save(assignment);
    }

    private void saveAssignmentHistory(
            Equipment equipment,
            User user,
            Assignment assignment,
            EquipmentStatus oldStatus
    ) {

        repoService.saveEquipmentHistory(
                equipment,
                user,
                HistoryEvent.ZADUZENJE,
                oldStatus.toString(),
                EquipmentStatus.ZAUZET.toString(),
                assignment.getAssignmentNote()
        );
    }

    @Transactional
    private void createFaultReportForReturnedEquipment(
            Equipment equipment,
            User user,
            EquipmentFaultReport request
    ) {
        FaultReport report = new FaultReport();

        report.setEquipment(equipment);
        report.setUser(user);
        report.setDesc(request.desc());
        report.setReportType(request.reportType());
        report.setSeverity(request.severity());

        faultReportRepository.save(report);

        repoService.saveEquipmentHistory(
                equipment,
                user,
                HistoryEvent.PRIJAVA_KVARA,
                ReturnCondition.ISPRAVAN.toString(),
                request.reportType().toString(),
                request.desc()
        );

        equipment.setStatus(EquipmentStatus.NEISPRAVAN);
        equipment.setUpdatedAt(LocalDateTime.now());

        equipmentRepository.saveAndFlush(equipment);
    }
}

