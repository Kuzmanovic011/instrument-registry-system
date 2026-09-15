package rs.pupin.evmer.dto;

import java.util.List;

public record FaultReportResponse (
        List<FaultReportDetails> reports,
        long reportsPages
){
}
