package rs.pupin.evmer.dto;

import java.util.List;

public record EquipmentResponseIndex(long numTotalEquipment,
                                     long numAvailableEquipment,
                                     long numBrokenEquipment,
                                     long numAssignedEquipment,
                                     long numAssignedEquipmentPage,
                                     long numActiveReservationsPage,
                                     long numCalibrationDuePage,
                                     long numHistoryPage,
                                     List<UserAssignmentIndex> assignments,
                                     List<ActiveReservationIndex> reservations,
                                     List<CalibrationIndex> calibrations,
                                     List<UserActivityIndex> activities
                                     ) {
}
