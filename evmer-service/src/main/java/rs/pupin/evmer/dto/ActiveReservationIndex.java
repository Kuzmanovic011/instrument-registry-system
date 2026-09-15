package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record ActiveReservationIndex(
        long idReservation,
        String equipmentName,
        String userFirstName,
        String userLastName,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime reservedAt,
        String status,
        String note
) {
}
