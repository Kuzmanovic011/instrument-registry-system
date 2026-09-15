package rs.pupin.evmer.dto;

import java.util.List;

public record EquipmentHistoryDto(
        List<EquipmentHistoryDetails> equipmentHistory,
        Long numPagesHistory
) {
}
