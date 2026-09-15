package rs.pupin.evmer.Specification;


import org.springframework.data.jpa.domain.Specification;
import rs.pupin.evmer.enums.CalibrationStatus;
import rs.pupin.evmer.enums.EquipmentStatus;
import rs.pupin.evmer.model.Equipment;

import java.time.LocalDateTime;

public class EquipmentSpecification {

    //filter po name
    public static Specification<Equipment>hasName(String name){
        //root - tabela equipment, cb.like - like
        return (root,query,cb)-> {
            if(name==null || name.isBlank()){
                return cb.conjunction();
            }
             return cb.like(
                cb.lower(root.get("name")),"%"+ name.toLowerCase() + "%"
        );
        };
    }

    //filter po inventoryNumber
    public static Specification<Equipment>hasInventoryNumber(String inventoryNumber){
        //WHERE lower(inventory_number) LIKE '%inv-0005%'
        return (root,query,cb)-> {
            if (inventoryNumber == null || inventoryNumber.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("inventoryNumber")), "%" + inventoryNumber.toLowerCase() + "%"
            );
        };
    }

    //filter po serialNumber
    public static Specification<Equipment>hasSerialNumber(String serialNumber){
        return (root,query,cb)->{
            if (serialNumber == null || serialNumber.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("serialNumber")), "%" + serialNumber.toLowerCase() + "%"
            );
        };
    }

    //filter po manufacturer
    public static Specification<Equipment>hasManufacturer(String manufacturer){
        return (root,query,cb)-> {
            if (manufacturer == null || manufacturer.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("manufacturer")), "%" + manufacturer.toLowerCase() + "%"
            );
        };
    }

    //filter po manufacturerModel
    public static Specification<Equipment>hasManufacturerModel(String manufacturerModel){
        return (root,query,cb)-> {
            if (manufacturerModel == null || manufacturerModel.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("manufacturerModel")), "%" + manufacturerModel.toLowerCase() + "%"
            );
        };
    }

    //filter po status
    public static Specification<Equipment>hasStatus(EquipmentStatus status){
        return (root,query,cb)-> {
            if (status == null) {
                return cb.conjunction(); // ako ne prosledimo status vratice se sve( izvrsice se upit WHERE true)
            }
            return cb.equal(root.get("status"),status);
        };
    }

    //filter po homeLocationDescription
    public static Specification<Equipment>hasHomeLocationDescription(String homeLocationDescription){
        return (root,query,cb)-> {
            if (homeLocationDescription == null || homeLocationDescription.isBlank()) {
                return cb.conjunction();
            }
            return cb.like(
                    cb.lower(root.get("homeLocationDescription")), "%" + homeLocationDescription.toLowerCase() + "%"
            );
        };
    }

    //filter po calibrationStatus
    public static Specification<Equipment>hasCalibrationStatus(CalibrationStatus calibrationStatus){
        return (root,query,cb)-> {
            if (calibrationStatus == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("calibrationStatus"),calibrationStatus);
        };
    }


    //filter po categoryId
    public static Specification<Equipment>hasCategory(Long categoryId){
        return (root,query,cb)-> {
            if (categoryId == null) {
                return cb.conjunction();
            }
            return cb.equal(
                    root.get("category").get("id"),
                    categoryId
            );
        };
    }
    // FILTER ZA KALIBRACIJU
    public static Specification<Equipment> hasCalibrationExpiringBetween(
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
                    cb.greaterThanOrEqualTo(root.get("nextCalibration"), start),
                    cb.lessThan(root.get("nextCalibration"), end)
            );
        };
    }

    //Pretrazivanje kalibracije za opremu koja nije obrisana i kojoj je kalibracija potrebna
    public static Specification<Equipment> calibrationRequiredAndNotDeleted() {
        return (root, query, cb) -> cb.and(
                cb.isTrue(root.get("calibrationRequired")),
                cb.isFalse(root.get("deleted"))
        );
    }
}
