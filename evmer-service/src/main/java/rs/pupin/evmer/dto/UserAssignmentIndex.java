package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record UserAssignmentIndex(
        String equipmentName,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime assignedAt,
        String projectOrTask,
        String assignmentNote
) {
}
