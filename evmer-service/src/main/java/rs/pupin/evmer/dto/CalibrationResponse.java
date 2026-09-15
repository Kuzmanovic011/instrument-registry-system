package rs.pupin.evmer.dto;

import java.util.List;

public record CalibrationResponse(
        List<CalibrationIndex> calibrations,
        Long numPageCalibrations
) {
}
