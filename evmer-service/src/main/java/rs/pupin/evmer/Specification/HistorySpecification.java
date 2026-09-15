package rs.pupin.evmer.Specification;

import org.springframework.data.jpa.domain.Specification;
import rs.pupin.evmer.enums.HistoryEvent;
import rs.pupin.evmer.model.EquipmentHistory;

import java.time.LocalDateTime;

public class HistorySpecification {

    public static Specification<EquipmentHistory> hasEquipmentName(String equipmentName) {
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

    public static Specification<EquipmentHistory> hasUserFirstName(String firstName) {
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

    public static Specification<EquipmentHistory> hasUserLastName(String lastName) {
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

    public static Specification<EquipmentHistory>hasEventType(HistoryEvent eventType){
        return (root,query,cb)-> {
            if (eventType == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("eventType"),eventType);
        };
    }

    public static Specification<EquipmentHistory> hasPerformedAt(
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
                    cb.greaterThanOrEqualTo(root.get("performedAt"), start),
                    cb.lessThan(root.get("performedAt"), end)
            );
        };
    }
}
