package rs.pupin.evmer.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import rs.pupin.evmer.dto.ActiveReservationIndex;
import rs.pupin.evmer.model.Reservation;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(target = "idReservation", source = "id")
    @Mapping(target = "equipmentName", source = "equipment.name")
    @Mapping(target="userFirstName",source="user.firstName")
    @Mapping(target="userLastName",source="user.lastName")
    ActiveReservationIndex toDto(Reservation entity);
    List<ActiveReservationIndex> activeReservationIndexDtoList(List<Reservation> entities);


}
