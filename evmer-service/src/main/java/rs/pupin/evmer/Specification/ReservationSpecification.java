package rs.pupin.evmer.Specification;

import org.springframework.data.jpa.domain.Specification;
import rs.pupin.evmer.enums.ReservationStatus;
import rs.pupin.evmer.model.Reservation;

import java.time.LocalDateTime;

public class ReservationSpecification {
    public static Specification<Reservation> hasEquipmentName(String equipmentName) {
        return (root, query, cb) -> {
            if (equipmentName == null || equipmentName.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("equipment").get("name")),
                    "%" + equipmentName.toLowerCase() + "%"
            );
        };
    }

    public static Specification<Reservation> hasUserFirstName(String firstName) {
        return (root, query, cb) -> {
            if (firstName == null || firstName.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("user").get("firstName")),
                    "%" + firstName.toLowerCase() + "%"
            );
        };
    }

    public static Specification<Reservation> hasUserLastName(String lastName) {
        return (root, query, cb) -> {
            if (lastName == null || lastName.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("user").get("lastName")),
                    "%" + lastName.toLowerCase() + "%"
            );
        };
    }

    public static Specification<Reservation>hasStatus(ReservationStatus status){
        return (root,query,cb)-> {
            if (status == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("status"),status);
        };
    }

    public static Specification<Reservation> hasReservedAt(
            LocalDateTime from,
            LocalDateTime to
    ) {
        return (root, query, cb) -> {
            if (from == null && to == null) {
                return cb.conjunction();
            }
            LocalDateTime startDate;
            LocalDateTime endDate;
            if(from!=null)
                startDate = from;
            else
                startDate = to;
            if(to!=null)
                endDate = to;
            else
                endDate = from;

            LocalDateTime start = startDate.toLocalDate().atStartOfDay();
            LocalDateTime end = endDate.toLocalDate().plusDays(1).atStartOfDay();
            return cb.and(
                    cb.greaterThanOrEqualTo(root.get("reservedAt"), start),
                    cb.lessThan(root.get("reservedAt"), end)
            );
        };
    }
}
