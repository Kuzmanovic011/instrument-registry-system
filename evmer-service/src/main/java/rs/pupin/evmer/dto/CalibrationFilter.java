package rs.pupin.evmer.dto;

import org.springframework.format.annotation.DateTimeFormat;
import rs.pupin.evmer.enums.CalibrationStatus;

import java.time.LocalDateTime;

public record CalibrationFilter(
        String name,
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime from,
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime to,
        CalibrationStatus calibrationStatus
) {
}
