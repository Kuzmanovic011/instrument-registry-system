package rs.pupin.evmer.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import rs.pupin.evmer.enums.CalibrationStatus;
import rs.pupin.evmer.enums.EquipmentStatus;
import rs.pupin.evmer.model.Equipment;

import java.util.List;
import java.util.Optional;

public interface EquipmentRepository extends JpaRepository<Equipment,Long>, JpaSpecificationExecutor<Equipment> {
        long countByStatus(EquipmentStatus status);
        List<Equipment> findByCalibrationStatusIn(List<CalibrationStatus> status);
        Page<Equipment> findByCalibrationStatusIn(List<CalibrationStatus> status, Pageable pageable);
        Optional<Equipment> findByIdAndDeletedFalse(long id);
        boolean existsBySerialNumberAndManufacturerAndManufacturerModel(String serialNumber, String manufacturer, String manufacturerModel);
        List<Equipment> findByCalibrationRequiredTrueAndDeletedFalse();


}
