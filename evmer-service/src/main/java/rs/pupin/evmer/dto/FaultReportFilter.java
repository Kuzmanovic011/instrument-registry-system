package rs.pupin.evmer.dto;


import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

public record FaultReportFilter(
        String equipmentName,
        String userFirstName,
        String userLastName,
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime reportedAt,
        String severity,
        Boolean status
) {
}
