package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import rs.pupin.evmer.enums.CalibrationResult;
import rs.pupin.evmer.enums.CalibrationStatus;

import java.time.LocalDateTime;

public record CreateEquipmentRequest(
        String name,
        String desc,
        Long categoryId,
        String manufacturer,
        String manufacturerModel,
        String serialNumber,
        Integer purchaseYear,
        String inventoryNumber,
        String homeLocationDescription,
        Boolean calibrationRequired,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime lastCalibration,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime nextCalibration,
        CalibrationResult calibrationResult,
        CalibrationStatus calibrationStatus,
        String calibrationNote,
        String notes,
        Long parentEquipmentId
) {
}