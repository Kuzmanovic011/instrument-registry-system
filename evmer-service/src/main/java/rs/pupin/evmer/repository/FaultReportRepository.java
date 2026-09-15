package rs.pupin.evmer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import rs.pupin.evmer.model.Equipment;
import rs.pupin.evmer.model.FaultReport;

public interface FaultReportRepository extends JpaRepository<FaultReport,Long>, JpaSpecificationExecutor<FaultReport> {
            FaultReport findByEquipmentAndStatusTrue(Equipment equipment);
}
