package rs.pupin.evmer.dto;

import org.springframework.format.annotation.DateTimeFormat;
import rs.pupin.evmer.enums.ReservationStatus;

import java.time.LocalDateTime;

public record ReservationFilter(
        String equipmentName,
        String userFirstName,
        String userLastName,
        ReservationStatus status,
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime from,
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime to
) {
}
