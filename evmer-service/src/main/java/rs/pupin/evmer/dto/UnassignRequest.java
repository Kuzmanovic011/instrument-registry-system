package rs.pupin.evmer.dto;

import rs.pupin.evmer.enums.ReturnCondition;

public record UnassignRequest(
        String returnNote,
        ReturnCondition returnCondition,
        String desc,
        String severity

) {
}
