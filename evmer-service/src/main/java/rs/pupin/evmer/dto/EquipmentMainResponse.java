package rs.pupin.evmer.dto;

import java.util.List;

public record EquipmentMainResponse(
        long equipmentNumPage,
        List<EquipmentResponse> equipment

) {
}
