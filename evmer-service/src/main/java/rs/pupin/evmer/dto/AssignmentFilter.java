package rs.pupin.evmer.dto;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

public record AssignmentFilter(
        String userFirstName,
        String userLastName,
        String equipmentName,
        String projectOrTask,
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime from,
        @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime to
) {
}
