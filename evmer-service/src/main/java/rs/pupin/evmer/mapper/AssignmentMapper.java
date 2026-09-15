package rs.pupin.evmer.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import rs.pupin.evmer.dto.ActiveAssignmentResponse;
import rs.pupin.evmer.dto.UserAssignmentIndex;
import rs.pupin.evmer.model.Assignment;
import rs.pupin.evmer.model.Equipment;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface AssignmentMapper {

    @Mapping(target = "equipmentName", source = "equipment.name")
    UserAssignmentIndex toDto(Assignment entity);
    List<UserAssignmentIndex> toUserAssignmentIndexDTOList(List<Assignment> entities);


    @Mapping(target = "userUsername", source = "user.username")
    @Mapping(target = "userFirstName", source = "user.firstName")
    @Mapping(target = "userLastName", source = "user.lastName")
    @Mapping(target = "equipmentName", source = "equipment.name")
    @Mapping(target = "accessories", source = "equipment.accessories", qualifiedByName = "accessoriesToNames")
    ActiveAssignmentResponse toDtoActiveAssignmentResponse(Assignment entity);
    List<ActiveAssignmentResponse> toDtoActiveAssignmentResponseList(List<Assignment> entity);

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
}
