package rs.pupin.evmer.Specification;

import org.springframework.data.jpa.domain.Specification;
import rs.pupin.evmer.model.Assignment;

import java.time.LocalDateTime;

public class AssignmentSpecification {
    public static Specification<Assignment> hasEquipmentName(String equipmentName) {
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

    public static Specification<Assignment> hasUserFirstName(String firstName) {
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

    public static Specification<Assignment> hasUserLastName(String lastName) {
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

    public static Specification<Assignment>hasProjectOrTask(String projectOrTask){
        return (root,query,cb)-> {
            if (projectOrTask == null || projectOrTask.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("projectOrTask")), "%" + projectOrTask.toLowerCase() + "%"
            );
        };
    }

    public static Specification<Assignment> hasAssignedAt(
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
                    cb.greaterThanOrEqualTo(root.get("assignedAt"), start),
                    cb.lessThan(root.get("assignedAt"), end)
            );
        };
    }

    public static Specification<Assignment> isActive() {
        return (root, query, cb) ->
                cb.isTrue(root.get("activeAssignment"));
    }

    public static Specification<Assignment> belongsToUser(Long userId) {
        return (root, query, cb) ->
                cb.equal(root.get("user").get("id"), userId);
    }
}
