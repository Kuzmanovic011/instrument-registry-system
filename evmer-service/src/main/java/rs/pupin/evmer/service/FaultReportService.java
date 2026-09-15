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
import org.springframework.web.server.ResponseStatusException;
import rs.pupin.evmer.Specification.FaultReportSpecification;
import rs.pupin.evmer.dto.EquipmentFaultReport;
import rs.pupin.evmer.dto.FaultReportFilter;
import rs.pupin.evmer.dto.FaultReportResponse;
import rs.pupin.evmer.dto.FaultResolve;
import rs.pupin.evmer.enums.*;
import rs.pupin.evmer.mapper.FaultReportMapper;
import rs.pupin.evmer.model.*;
import rs.pupin.evmer.repository.EquipmentRepository;
import rs.pupin.evmer.repository.FaultReportRepository;
import rs.pupin.evmer.repository.ReservationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class FaultReportService {

    private final RepoService repoService;
    private final CurrentUserService currentUserService;
    private final FaultReportRepository faultReportRepository;
    private final EquipmentRepository equipmentRepository;
    private final ReservationRepository reservationRepository;
    private final EmailService emailService;
    private final FaultReportMapper faultReportMapper;


    public FaultReportResponse getFaultReport(
            FaultReportFilter request,
            int page,
            int size,
            String sortBy,
            boolean ascending
    ){
        User user = currentUserService.getAuthenticatedUser();
        if(!user.getRole().equals(UserRoles.ADMINISTRATOR) && !user.getRole().equals(UserRoles.MENADZER)){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Nemate dozvolu za pregled prijava kvarova."
            );
        }
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page,size,sort);

        Specification<FaultReport> specification= Specification
                .where(FaultReportSpecification.hasEquipmentName(request.equipmentName()))
                .and(FaultReportSpecification.hasUserFirstName(request.userFirstName()))
                .and(FaultReportSpecification.hasUserLastName(request.userLastName()))
                .and(FaultReportSpecification.hasReportedAt(request.reportedAt()))
                .and(FaultReportSpecification.hasSeverity(request.severity()))
                .and(FaultReportSpecification.hasStatus(request.status()));

        Page<FaultReport> faultReportPage =
                faultReportRepository.findAll(specification,pageable);

        List<FaultReport> reports = faultReportPage.getContent();

        long reportsPages = faultReportPage.getTotalPages();

        return new FaultReportResponse(
                faultReportMapper.toFaultReportResponseDTOList(reports),
                reportsPages
        );
    }


    @Transactional
    public ResponseEntity<?> createFaultReport(
            Long id,
            EquipmentFaultReport request
    ){
        Equipment equipment = repoService.getEquipmentById(id);

        if(!equipment.getStatus().equals(EquipmentStatus.SLOBODAN) &&
                !equipment.getStatus().equals(EquipmentStatus.REZERVISAN))
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        User user = currentUserService.getAuthenticatedUser();

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

        return ResponseEntity.ok().build();
    }


    @Transactional
    public ResponseEntity<?> faultResolveEquipment(
            Long id,
            FaultResolve request
    ) {
        User user = currentUserService.getAuthenticatedUser();
        Equipment equipment = repoService.getEquipmentById(id);

        if (!user.getRole().equals(UserRoles.ADMINISTRATOR)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (!equipment.getStatus().equals(EquipmentStatus.NEISPRAVAN)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        FaultReport report = faultReportRepository.findByEquipmentAndStatusTrue(equipment);

        if (!report.isStatus()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        report.setResolvedAt(LocalDateTime.now());
        report.setStatus(false);
        report.setResolutionNote(request.note());

        faultReportRepository.saveAndFlush(report);

        repoService.saveEquipmentHistory(
                equipment,
                user,
                HistoryEvent.RESAVANJE_KVARA,
                report.getReportType().toString(),
                ReturnCondition.ISPRAVAN.toString(),
                report.getResolutionNote()
        );

        Optional<Reservation> firstReservation = reservationRepository.findFirstByEquipmentIdAndStatusOrderByReservedAtAsc(equipment.getId(), ReservationStatus.AKTIVNA);

        if (firstReservation.isEmpty()) {
            equipment.setStatus(EquipmentStatus.SLOBODAN);

            if (!equipment.getAccessories().isEmpty()) {
                for (Equipment accessories : equipment.getAccessories()) {
                    accessories.setStatus(EquipmentStatus.SLOBODAN);
                    equipmentRepository.save(accessories);
                }
            }
        }
        else {
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

        return ResponseEntity.ok().build();
    }
}
