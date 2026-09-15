package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record FaultReportDetails(
        String equipmentName,
        String userFirstName,
        String userLastName,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime reportedAt,
        String desc,
        String severity,
        boolean status,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime resolvedAt,
        String resolutionNote
) {
}
