package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public record EquipmentScheduleCalibration(
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime date
) {
}
