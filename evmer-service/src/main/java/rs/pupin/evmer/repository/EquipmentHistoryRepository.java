package rs.pupin.evmer.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import rs.pupin.evmer.enums.HistoryEvent;
import rs.pupin.evmer.model.EquipmentHistory;

import java.util.List;

public interface EquipmentHistoryRepository extends JpaRepository<EquipmentHistory,Long>, JpaSpecificationExecutor<EquipmentHistory> {
    List<EquipmentHistory> findByUserId(long userId);
    Page<EquipmentHistory> findByUserId(long userId, Pageable pageable);
    List<EquipmentHistory> findByEventType(HistoryEvent status);
    Page<EquipmentHistory> findByEventType(HistoryEvent event, Specification specification, Pageable pageable);
}
