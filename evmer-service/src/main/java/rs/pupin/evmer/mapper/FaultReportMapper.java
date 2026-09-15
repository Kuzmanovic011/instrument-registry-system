package rs.pupin.evmer.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import rs.pupin.evmer.dto.FaultReportDetails;
import rs.pupin.evmer.model.FaultReport;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FaultReportMapper {

    @Mapping(target = "equipmentName", source = "equipment.name")
    @Mapping(target = "userFirstName", source = "user.firstName")
    @Mapping(target = "userLastName", source = "user.lastName")
    FaultReportDetails toDto(FaultReport entity);
    List<FaultReportDetails> toFaultReportResponseDTOList(List<FaultReport> entities);
}
