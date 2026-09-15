package rs.pupin.evmer.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import rs.pupin.evmer.enums.ReservationStatus;
import rs.pupin.evmer.model.Reservation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation,Long>, JpaSpecificationExecutor<Reservation> {
    List<Reservation> findByStatus(ReservationStatus status);
    Page<Reservation> findByStatus(ReservationStatus status, Specification specification, Pageable pageable);
    Optional<Reservation> findFirstByEquipmentIdAndStatusOrderByReservedAtAsc(Long equipmentId, ReservationStatus status);
    Reservation findByEquipmentIdAndUserIdAndStatus(Long equipmentId, Long userId, ReservationStatus status);
    List<Reservation> findByEquipmentIdAndStatusOrderByReservedAtAsc(Long equipmentId, ReservationStatus status);
    List<Reservation> findByStatusAndExpiresAtIsNotNullAndExpiresAtBefore(ReservationStatus status, LocalDateTime currentTime);
    Optional<Reservation> findByIdAndStatus(Long idReservation, ReservationStatus status);
    Reservation findByIdAndUserIdAndStatus(Long idReservation, Long userId, ReservationStatus status);
    boolean existsByUserIdAndStatus(Long userId,ReservationStatus status);
    Page<Reservation> findByUserIdAndStatus(Long userId,ReservationStatus status,Specification specification,Pageable pageable);
    Long countByEquipmentIdAndStatus(Long equipmentId, ReservationStatus status);
}
