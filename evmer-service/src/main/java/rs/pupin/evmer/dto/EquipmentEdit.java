package rs.pupin.evmer.dto;

import rs.pupin.evmer.enums.EquipmentStatus;

public record EquipmentEdit(
        String name,
        String desc,
        Long category,
        String homeLocationDescription,
        EquipmentStatus status,
        String notes
        ) {

}
