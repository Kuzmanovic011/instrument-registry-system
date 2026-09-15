package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public record HistoryAssignmentResponse(
        Long id,
        String userUsername,
        String userFirstName,
        String userLastName,
        String equipmentName,
        List<String> accessories,
        String oldValue,
        String newValue,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime performedAt,
        String note
) {
}
