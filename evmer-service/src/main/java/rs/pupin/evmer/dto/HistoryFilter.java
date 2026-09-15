package rs.pupin.evmer.dto;

import org.springframework.format.annotation.DateTimeFormat;
import rs.pupin.evmer.enums.HistoryEvent;

import java.time.LocalDateTime;

public record HistoryFilter(
        String equipmentName,
        String userFirstName,
        String userLastName,
        HistoryEvent eventType,
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime from,
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime to
) {
}
