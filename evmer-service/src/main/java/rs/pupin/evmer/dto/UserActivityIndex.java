package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record UserActivityIndex(
        Long id,
        String equipmentName,
        String eventType,
        String oldValue,
        String newValue,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime performedAt,
        String note
) {
}
