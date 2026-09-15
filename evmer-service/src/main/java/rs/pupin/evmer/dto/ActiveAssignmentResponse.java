package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public record ActiveAssignmentResponse(
        long id,
        String userUsername,
        String userFirstName,
        String userLastName,
        String equipmentName,
        String projectOrTask,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime assignedAt,
        List<String> accessories,
        String assignmentNote
) {
}
