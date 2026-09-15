package rs.pupin.evmer.dto;

import rs.pupin.evmer.enums.EquipmentStatus;


public record EquipmentFilter(
        String name,
        String inventoryNumber,
        String serialNumber,
        String manufacturer,
        String manufacturerModel,
        Long categoryId,
        EquipmentStatus status,
        String homeLocationDescription
){}
