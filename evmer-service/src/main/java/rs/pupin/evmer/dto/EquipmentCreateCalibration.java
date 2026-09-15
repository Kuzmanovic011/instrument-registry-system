package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import rs.pupin.evmer.enums.CalibrationResult;

import java.time.LocalDateTime;

public record EquipmentCreateCalibration(
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime lastCalibration,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime nextCalibration,
        CalibrationResult calibrationResult,
        String calibrationNote
) {
}
