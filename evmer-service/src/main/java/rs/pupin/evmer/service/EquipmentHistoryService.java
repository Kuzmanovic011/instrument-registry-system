package rs.pupin.evmer.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import rs.pupin.evmer.Specification.HistorySpecification;
import rs.pupin.evmer.dto.EquipmentHistoryDto;
import rs.pupin.evmer.dto.HistoryFilter;
import rs.pupin.evmer.enums.UserRoles;
import rs.pupin.evmer.mapper.EquipmentHistoryMapper;
import rs.pupin.evmer.model.EquipmentHistory;
import rs.pupin.evmer.repository.EquipmentHistoryRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class EquipmentHistoryService {

    private final CurrentUserService currentUserService;
    private final EquipmentHistoryRepository equipmentHistoryRepository;
    private final EquipmentHistoryMapper equipmentHistoryMapper;

    public EquipmentHistoryDto getHistory(
            HistoryFilter request,
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

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<EquipmentHistory> specification= Specification
                .where(HistorySpecification.hasEquipmentName(request.equipmentName()))
                .and(HistorySpecification.hasUserFirstName(request.userFirstName()))
                .and(HistorySpecification.hasUserLastName(request.userLastName()))
                .and(HistorySpecification.hasEventType(request.eventType()))
                .and(HistorySpecification.hasPerformedAt(request.from(),request.to()));

        Page<EquipmentHistory> historyPages = equipmentHistoryRepository.findAll(specification,pageable);

        List<EquipmentHistory> history = historyPages.getContent();
        long numPagesHistory = historyPages.getTotalPages();

        return new EquipmentHistoryDto(
                equipmentHistoryMapper.toDtoEquipmentHistoryDetailsList(history),
                numPagesHistory
        );
    }

}
