package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import rs.pupin.evmer.enums.HistoryEvent;

import java.time.LocalDateTime;

public record EquipmentHistoryDetails(
        String equipmentName,
        String userFirstName,
        String userLastName,
        HistoryEvent eventType,
        String oldValue,
        String newValue,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime performedAt,
        String note
) {
}
