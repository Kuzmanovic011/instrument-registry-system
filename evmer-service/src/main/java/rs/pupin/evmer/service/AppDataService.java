package rs.pupin.evmer.service;


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import rs.pupin.evmer.dto.AppDataResponse;
import rs.pupin.evmer.dto.EquipmentCategory;
import rs.pupin.evmer.dto.UserRequest;
import rs.pupin.evmer.enums.*;
import rs.pupin.evmer.mapper.CategoryMapper;
import rs.pupin.evmer.repository.CategoryRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class AppDataService {

    private final CategoryMapper categoryMapper;
    private final CategoryRepository categoryRepository;

    public AppDataResponse getData(){
        List<EquipmentCategory> equipmentCategories =
                categoryMapper.toDtoEquipmentCategoryList(categoryRepository.findByActiveTrue());
        List<EquipmentStatus> equipmentStatuses =
                List.of(EquipmentStatus.values());
        List<CalibrationResult> calibrationResults =
                List.of(CalibrationResult.values());
        List<ExpectedTableSort> expectedTableSorts=
                List.of(ExpectedTableSort.values());
        List<ReturnCondition> returnConditions=
                List.of(ReturnCondition.values());
        List<ReturnCondition> faultReport = List.of(
                ReturnCondition.NEISPRAVAN,
                ReturnCondition.OSTECEN
        );
        List<UserRoles> userRoles=
                List.of(UserRoles.values());
        List<UserRoles>userRolesUpdate=
                List.of(
                        UserRoles.MENADZER,
                        UserRoles.OPERATER
                );
        List<HistoryEvent> historyEvents=
                List.of(HistoryEvent.values());
        List<CalibrationStatus> calibrationStatuses=
                List.of(CalibrationStatus.values());

        return new AppDataResponse(
                equipmentCategories,
                equipmentStatuses,
                calibrationResults,
                expectedTableSorts,
                returnConditions,
                faultReport,
                userRoles,
                userRolesUpdate,
                historyEvents,
                calibrationStatuses
        );
    }
}
