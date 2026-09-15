package rs.pupin.evmer.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import rs.pupin.evmer.dto.EquipmentHistoryDetails;
import rs.pupin.evmer.dto.HistoryAssignmentResponse;
import rs.pupin.evmer.dto.UserActivityIndex;
import rs.pupin.evmer.model.Equipment;
import rs.pupin.evmer.model.EquipmentHistory;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface EquipmentHistoryMapper {
    @Mapping(target = "equipmentName", source = "equipment.name")
    UserActivityIndex toDto(EquipmentHistory entity);
    List<UserActivityIndex> toUserActivityIndexDtoList(List<EquipmentHistory> entities);

    @Mapping(target = "userUsername", source = "user.username")
    @Mapping(target = "userFirstName", source = "user.firstName")
    @Mapping(target = "userLastName", source = "user.lastName")
    @Mapping(target = "equipmentName", source = "equipment.name")
    @Mapping(target = "accessories", source = "equipment.accessories", qualifiedByName = "accessoriesToNames")

    HistoryAssignmentResponse toDtoHistoryAssignmentResponse (EquipmentHistory entity);
    List<HistoryAssignmentResponse> toDtoHistoryAssignemntResponseList (List<EquipmentHistory> entity);

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

    @Mapping(target = "equipmentName", source = "equipment.name")
    @Mapping(target = "userFirstName", source = "user.firstName")
    @Mapping(target = "userLastName", source = "user.lastName")
    EquipmentHistoryDetails toDtoEquipmentHistoryDetails(EquipmentHistory entity);
    List<EquipmentHistoryDetails> toDtoEquipmentHistoryDetailsList(List<EquipmentHistory> entity);
}
