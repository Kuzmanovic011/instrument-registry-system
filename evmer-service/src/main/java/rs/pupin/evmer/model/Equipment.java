package rs.pupin.evmer.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import rs.pupin.evmer.enums.CalibrationResult;
import rs.pupin.evmer.enums.CalibrationStatus;
import rs.pupin.evmer.enums.EquipmentStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "equipment", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"serial_number", "manufacturer", "manufacturer_model"})
})
public class Equipment extends BaseEntity {

    @Column(
            name = "name",
            nullable = false,
            length = 30
    )
    private String name;

    @Column(
            name = "description"
    )
    private String desc;

    //veza sa Category entitetom
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(
            name = "manufacturer",
            nullable = false,
            length = 50
    )
    private String manufacturer;

    @Column(
            name = "manufacturer_model",
            nullable = false
    )
    private String manufacturerModel;

    @Column(
            name = "serial_number",
            nullable = false
    )
    private String serialNumber;

    @Column(
            name = "production_or_purchase_year",
            nullable = false
    )
    private Integer purchaseYear;

    @Column(
            name = "inventory_number",
            nullable = false,
            unique = true
    )
    private String inventoryNumber;


    //opis gde se trenutno nalazi trazeni intrument, kada je slobodan, ako je zaduzen ispisuju se podaci osobe kod koje se nalazi instrument
    @Column(
            name = "home_location_description",
            nullable = false
    )
    private String homeLocationDescription;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            length = 20
    )
    private EquipmentStatus status = EquipmentStatus.SLOBODAN;

    @Column(
            name = "calibration_required",
            nullable = false
    )
    private boolean calibrationRequired;

    @Column(
            name = "last_calibration_date"
    )
    private LocalDateTime lastCalibration;

    @Column(
            name = "next_calibration_date"
    )
    private LocalDateTime nextCalibration;

    @Column(
            name = "deleted"
    )
    private boolean deleted=false;

    @Column(
            name = "deleted_at"
    )
    private LocalDateTime deletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deleted_by_user_id")
    private User deletedBy;

    @CreatedDate
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name="notes"
    )
    private String notes;

    @Column(
            name = "updated_at"
    )
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(
            name="calibration_result",
            length = 20
    )
    private CalibrationResult calibrationResult = CalibrationResult.ISPRAVAN;

    @Column(
            name="calibration_note"
    )
    private String calibrationNote;

    @Enumerated(EnumType.STRING)
    @Column(
            name="calibration_status",
            length = 30
    )
    private CalibrationStatus calibrationStatus;

    //roditeljski element opreme
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "parent_equipment_id"
    )
    private Equipment parentEquipment;

    //prikaz dodatne opreme za tekucu stavku
    @OneToMany(mappedBy = "parentEquipment", fetch = FetchType.LAZY)
    private List<Equipment> accessories = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "responsible_user_id"
    )
    private User responsibleUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "expert_user_id"
    )
    private User expertUser;

    @Column(
            name="image_path",
            length = 500
            )
    private String imagePath;
}

