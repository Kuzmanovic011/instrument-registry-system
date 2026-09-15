package rs.pupin.evmer.dto;

import rs.pupin.evmer.enums.*;

import java.util.List;

public record AppDataResponse(
        List<EquipmentCategory> equipmentCategories,
        List<EquipmentStatus> equipmentStatuses,
        List<CalibrationResult> calibrationResults,
        List<ExpectedTableSort> expectedTableSorts,
        List<ReturnCondition> returnConditions,
        List<ReturnCondition> faultReport,
        List<UserRoles> userRoles,
        List<UserRoles> userRolesUpdate,
        List<HistoryEvent> historyEvents,
        List<CalibrationStatus> calibrationStatuses
) {
}
