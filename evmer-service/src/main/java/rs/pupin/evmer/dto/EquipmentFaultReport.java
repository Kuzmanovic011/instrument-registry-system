package rs.pupin.evmer.dto;

import rs.pupin.evmer.enums.ReturnCondition;

public record EquipmentFaultReport(
        String desc,
        String severity,
        ReturnCondition reportType
) {
}
