package rs.pupin.evmer.mapper;

import org.mapstruct.*;
import rs.pupin.evmer.dto.CalibrationIndex;
import rs.pupin.evmer.dto.EquipmentCreateCalibration;
import rs.pupin.evmer.model.Equipment;

import java.util.List;

@Mapper(componentModel="spring")
public interface CalibrationMapper {

    @Mapping(target="idEquipment",source="id")
    CalibrationIndex toCalibrationIndexDto(Equipment entity);
    List<CalibrationIndex> toCalibrationIndexDtoList(List<Equipment> entities);

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "lastCalibration", ignore = true)
    @Mapping(target = "nextCalibration", ignore = true)
    void addExecutedCalibrationToEquipmentFromDto(
            EquipmentCreateCalibration request,
            @MappingTarget Equipment equipment
    );
}
