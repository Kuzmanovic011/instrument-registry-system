package rs.pupin.evmer.Specification;

import org.springframework.data.jpa.domain.Specification;
import rs.pupin.evmer.model.FaultReport;

import java.time.LocalDateTime;

public class FaultReportSpecification {

    public static Specification<FaultReport> hasEquipmentName(String equipmentName) {
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

    public static Specification<FaultReport> hasUserFirstName(String firstName) {
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

    public static Specification<FaultReport> hasUserLastName(String lastName) {
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

    public static Specification<FaultReport> hasReportedAt(LocalDateTime date) {
        return (root, query, cb) -> {
            if (date == null) {
                return cb.conjunction();
            }

            LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
            LocalDateTime startOfNextDay = date.toLocalDate().plusDays(1).atStartOfDay();

            return cb.and(
                    cb.greaterThanOrEqualTo(
                            root.get("reportedAt"),
                            startOfDay
                    ),
                    cb.lessThan(
                            root.get("reportedAt"),
                            startOfNextDay
                    )
            );
        };
    }

    public static Specification<FaultReport> hasSeverity(String severity){
        return (root,query,cb)-> {
            if(severity==null || severity.isBlank()){
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("severity")),"%"+ severity.toLowerCase() + "%"
            );
        };
    }

    public static Specification<FaultReport> hasStatus(Boolean status) {
        return (root, query, cb) -> {
            if (status == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("status"), status);
        };
    }
}
