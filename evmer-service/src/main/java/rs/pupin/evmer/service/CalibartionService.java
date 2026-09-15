package rs.pupin.evmer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import rs.pupin.evmer.Specification.EquipmentSpecification;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.enums.UserRoles;
import rs.pupin.evmer.mapper.CalibrationMapper;
import rs.pupin.evmer.model.Equipment;
import rs.pupin.evmer.repository.EquipmentRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CalibartionService {

    private final CurrentUserService currentUserService;
    private final EquipmentRepository equipmentRepository;
    private final CalibrationMapper calibrationMapper;

    public CalibrationResponse getCalibrations(
            CalibrationFilter request,
            int page,
            int size,
            String sortBy,
            boolean ascending
    ) {
        if (!currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN
            );
        }
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page,size,sort);

        List<Equipment> calibrations;

        long numPageCalibrations;

        if (request.from() != null && request.to() != null && request.to().isBefore(request.from())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Krajnji datum ne moze biti pre pocetnog datuma"
            );
        }

        Specification<Equipment> specification =
                Specification
                        .where(EquipmentSpecification.calibrationRequiredAndNotDeleted())
                        .and(EquipmentSpecification.hasCalibrationExpiringBetween(
                                request.from(),
                                request.to()
                        ))
                        .and(EquipmentSpecification.hasCalibrationStatus(
                                        request.calibrationStatus()
                        ))
                        .and(EquipmentSpecification.hasName(
                                request.name()
                        ));

        Page<Equipment> calibrationPage= equipmentRepository.findAll(specification,pageable);
        calibrations=calibrationPage.getContent();
        numPageCalibrations=calibrationPage.getTotalPages();


        List<CalibrationIndex> calibrationResponses = calibrationMapper.toCalibrationIndexDtoList(calibrations);


        return new CalibrationResponse(
                calibrationResponses,
                numPageCalibrations
        );
    }
}
