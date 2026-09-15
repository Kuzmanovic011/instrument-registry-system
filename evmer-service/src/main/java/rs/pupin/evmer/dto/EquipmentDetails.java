package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import rs.pupin.evmer.enums.CalibrationResult;
import rs.pupin.evmer.enums.CalibrationStatus;
import rs.pupin.evmer.enums.EquipmentStatus;


import java.time.LocalDateTime;

public record EquipmentDetails(
        String name,
        String desc,
        String categoryName,
        String manufacturer,
        String manufacturerModel,
        String serialNumber,
        Integer purchaseYear,
        String inventoryNumber,
        String homeLocationDescription,
        EquipmentStatus status,
        Boolean calibrationRequired,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime lastCalibration,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime nextCalibration,
        CalibrationResult calibrationResult,
        CalibrationStatus calibrationStatus,
        String calibrationNote,
        Long parentEquipmentId,
        String responsibleFirstName,
        String responsibleLastName,
        String expertFirstName,
        String expertLastName,
        String image,
        String notes,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime updatedAt
) {
}
