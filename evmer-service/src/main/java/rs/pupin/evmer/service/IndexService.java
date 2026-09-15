package rs.pupin.evmer.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import rs.pupin.evmer.dto.EquipmentResponseIndex;
import rs.pupin.evmer.enums.CalibrationStatus;
import rs.pupin.evmer.enums.EquipmentStatus;
import rs.pupin.evmer.enums.ExpectedTableSort;
import rs.pupin.evmer.enums.ReservationStatus;
import rs.pupin.evmer.mapper.*;
import rs.pupin.evmer.model.*;
import rs.pupin.evmer.repository.*;

import java.util.List;

@Service
@AllArgsConstructor
public class IndexService {
    private final EquipmentRepository equipmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final ReservationRepository reservationRepository;
    private final EquipmentHistoryRepository equipmentHistoryRepository;
    private final AssignmentMapper assignmentMapper;
    private final CalibrationMapper calibrationMapper;
    private final ReservationMapper reservationMapper;
    private final EquipmentHistoryMapper equipmentHistoryMapper;
    private final CurrentUserService currentUserService;

    public EquipmentResponseIndex getInitialInfo(
            ExpectedTableSort table,
            int page,
            int size,
            String sortBy,
            boolean ascending
    ){

        User user = currentUserService.getAuthenticatedUser();

        Sort sort;
        Pageable pageable;

        long numTotalEquipment = equipmentRepository.count();
        long numAvailableEquipment = equipmentRepository.countByStatus(EquipmentStatus.SLOBODAN);
        long numBrokenEquipment = equipmentRepository.countByStatus(EquipmentStatus.NEISPRAVAN);
        long numAssignedEquipment = equipmentRepository.countByStatus(EquipmentStatus.ZAUZET);


        List<Assignment> assignments = assignmentRepository.findByUserIdAndActiveAssignmentTrue(user.getId());
        List<Reservation> reservationsActive = reservationRepository.findByStatus(ReservationStatus.AKTIVNA);
        List<Equipment> calibrationDue = equipmentRepository.findByCalibrationStatusIn(List.of(CalibrationStatus.USKORO_ISTICE,CalibrationStatus.ISTEKLA));
        List<EquipmentHistory> history = equipmentHistoryRepository.findByUserId(user.getId());

        long numAssignedEquipmentPage = (long)Math.ceil((double) assignments.size()/size);
        long numActiveReservationsPage = (long)Math.ceil((double) reservationsActive.size()/size);
        long numCalibrationDuePage = (long)Math.ceil((double) calibrationDue.size()/size);
        long numHistoryPage = (long)Math.ceil((double) history.size()/size);

        switch (table) {

            case ASSIGNMENTS -> {
                sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
                pageable = PageRequest.of(page,size,sort);
                assignments = assignmentRepository
                        .findByUserIdAndActiveAssignmentTrue(
                                user.getId(),
                                null,
                                pageable
                        ).getContent();
            }

            case RESERVATIONS -> {
                sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
                pageable = PageRequest.of(page,size,sort);
                reservationsActive = reservationRepository
                        .findByStatus(
                                ReservationStatus.AKTIVNA,
                                null,
                                pageable
                        ).getContent();
            }

            case CALIBRATIONS -> {
                sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
                pageable = PageRequest.of(page,size,sort);
                calibrationDue = equipmentRepository
                        .findByCalibrationStatusIn(
                                List.of(
                                        CalibrationStatus.USKORO_ISTICE,
                                        CalibrationStatus.ISTEKLA
                                ),
                                pageable
                        ).getContent();
            }

            case ACTIVITIES -> {
                sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
                pageable = PageRequest.of(page,size,sort);
                history = equipmentHistoryRepository
                        .findByUserId(
                                user.getId(),
                                pageable
                        ).getContent();
            }

            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nepoznata tabela za sortiranje: " + table
            );
        }

        return new EquipmentResponseIndex(
                numTotalEquipment,
                numAvailableEquipment,
                numBrokenEquipment,
                numAssignedEquipment,
                numAssignedEquipmentPage,
                numActiveReservationsPage,
                numCalibrationDuePage,
                numHistoryPage,
                assignmentMapper.toUserAssignmentIndexDTOList(assignments),
                reservationMapper.activeReservationIndexDtoList(reservationsActive),
                calibrationMapper.toCalibrationIndexDtoList(calibrationDue),
                equipmentHistoryMapper.toUserActivityIndexDtoList(history)
                );
    }

}
