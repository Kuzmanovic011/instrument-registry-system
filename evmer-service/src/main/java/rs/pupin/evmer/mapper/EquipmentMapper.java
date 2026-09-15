package rs.pupin.evmer.mapper;

import org.mapstruct.*;
import rs.pupin.evmer.dto.CreateEquipmentRequest;
import rs.pupin.evmer.dto.EquipmentEdit;
import rs.pupin.evmer.dto.EquipmentResponse;
import rs.pupin.evmer.model.Equipment;
import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface EquipmentMapper {

    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "responsibleFirstName", source = "responsibleUser.firstName")
    @Mapping(target = "responsibleLastName", source = "responsibleUser.lastName")
    @Mapping(target = "expertFirstName", source = "expertUser.firstName")
    @Mapping(target = "expertLastName", source = "expertUser.lastName")
    @Mapping(target = "image", source = "imagePath")
    @Mapping(target = "parentEquipmentId",source = "parentEquipment.id")
    @Mapping(target = "parentEquipmentName",source = "parentEquipment.name")
    @Mapping(target = "accessories", source = "accessories", qualifiedByName = "accessoriesToNames")
    EquipmentResponse equipmentToDto(Equipment entity);
    List<EquipmentResponse> toDto(List<Equipment> entityList);

    @Named("accessoriesToNames")
    default List<String> accessoriesToNames(List<Equipment> accessories) {
        List<String> names = new ArrayList<>();
        if (accessories == null) {
            return names;
        }
        for (Equipment equipment : accessories) {
            names.add(equipment.getName());
        }
        return names;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "deletedBy", ignore = true)
    @Mapping(target = "parentEquipment", ignore = true)
    @Mapping(target = "accessories", ignore = true)
    @Mapping(target = "responsibleUser", ignore = true)
    @Mapping(target = "expertUser", ignore = true)
    @Mapping(target = "lastCalibration", ignore = true)
    @Mapping(target = "nextCalibration", ignore = true)
    @Mapping(target = "calibrationResult", ignore = true)
    @Mapping(target = "calibrationStatus", ignore = true)
    @Mapping(target = "calibrationNote", ignore = true)
    Equipment createEquipmentRequestToEquipment(
            CreateEquipmentRequest dto
    );

    @BeanMapping(
            nullValuePropertyMappingStrategy =
                    NullValuePropertyMappingStrategy.IGNORE
    )
    @Mapping(target = "category", ignore = true)
    void updateEquipmentFromDto(
            EquipmentEdit request,
            @MappingTarget Equipment equipment
    );
}
