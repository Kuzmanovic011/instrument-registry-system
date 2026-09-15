package rs.pupin.evmer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import rs.pupin.evmer.enums.ReturnCondition;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "fault_report")
public class FaultReport extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by_user_id")
    private User user;

    @Column(
            name = "reported_at",
            nullable = false
    )
    private LocalDateTime reportedAt = LocalDateTime.now();

    @Column(
            name = "description",
            length = 255
    )
    private String desc;

    //ovde se mozda uvede enumerator kada se doda ozbiljnost
    @Column(
            name = "severity",
            length = 20
    )
    private String severity;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "report_type",
            nullable = false,
            length = 20
    )
    private ReturnCondition reportType;

    @Column(
            name = "status_active",
            nullable = false
    )
    private boolean status = true;

    @Column(
            name = "resolved_at"
    )
    private LocalDateTime resolvedAt;

    @Column(
            name = "resolution_note",
            length = 150
    )
    private String resolutionNote;

}
