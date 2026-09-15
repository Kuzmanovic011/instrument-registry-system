package rs.pupin.evmer.dto;

import java.util.List;

public record ReservationsResponseDto(
        List<ActiveReservationIndex> reservations,
        Long numPageReservations
) {
}
