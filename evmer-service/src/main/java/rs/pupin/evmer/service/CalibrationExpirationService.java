package rs.pupin.evmer.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import rs.pupin.evmer.enums.CalibrationStatus;
import rs.pupin.evmer.model.Equipment;
import rs.pupin.evmer.repository.EquipmentRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalibrationExpirationService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentService equipmentService;

    @Transactional
    @Scheduled(
            fixedDelayString =
                    "${calibration.expiration-check-interval:60000}"
    )
    public void expireCalibrations()
    {
        LocalDateTime now = LocalDateTime.now();

        List<Equipment> equipments =
                equipmentRepository.findByCalibrationRequiredTrueAndDeletedFalse();

        for (Equipment equipment : equipments) {

            CalibrationStatus oldStatus =
                    equipment.getCalibrationStatus();

            LocalDateTime nextCalibration =
                    equipment.getNextCalibration();

            if (nextCalibration == null) {
                equipment.setCalibrationStatus(
                        CalibrationStatus.PODACI_NISU_UNETI
                );
                continue;
            }

            if (!nextCalibration.isAfter(now)) {

                equipment.setCalibrationStatus(
                        CalibrationStatus.ISTEKLA
                );

            } else if (!nextCalibration.isAfter(now.plusMonths(1))) {

                equipment.setCalibrationStatus(
                        CalibrationStatus.USKORO_ISTICE
                );

            }

            equipmentService.saveChangeIfDifferent(
                    equipment,
                    null,
                    "calibration_status",
                    oldStatus.toString(),
                    equipment.getCalibrationStatus().toString()

            );
        }

        equipmentRepository.saveAllAndFlush(equipments);
    }
}
