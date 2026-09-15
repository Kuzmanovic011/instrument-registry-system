package rs.pupin.evmer.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import rs.pupin.evmer.model.Assignment;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long>, JpaSpecificationExecutor<Assignment> {
    List<Assignment> findByUserIdAndActiveAssignmentTrue(Long userId);
    Page<Assignment> findByUserIdAndActiveAssignmentTrue(Long userId,Specification specification, Pageable pageable);
    Assignment findByEquipmentIdAndActiveAssignmentTrue(Long equipmentId);
    List<Assignment> findByActiveAssignmentTrue();
    Page<Assignment> findByActiveAssignmentTrue(Specification specification, Pageable pageable);
    Assignment findByEquipmentIdAndUserIdAndActiveAssignmentTrue(Long equipmentId, Long userId);
    boolean existsByUserIdAndActiveAssignmentTrue(Long userId);
}
