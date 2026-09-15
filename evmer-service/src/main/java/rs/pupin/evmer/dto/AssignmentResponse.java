package rs.pupin.evmer.dto;


import java.util.List;

public record AssignmentResponse(
        List<ActiveAssignmentResponse> activeAssignments,
        Long numPageActiveAssingment,
        List<HistoryAssignmentResponse> historyAssignments,
        Long numPageHistoryAssignment

) {
}
