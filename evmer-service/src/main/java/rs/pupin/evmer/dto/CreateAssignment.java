package rs.pupin.evmer.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateAssignment(
        @NotBlank(message = "Mora biti popunjeno projectOrTask!")
        String projectOrTask,
        String assignmentNote
) {
}
