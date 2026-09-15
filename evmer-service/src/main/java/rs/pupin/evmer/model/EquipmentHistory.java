package rs.pupin.evmer.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import rs.pupin.evmer.enums.HistoryEvent;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "equipment_history")
public class EquipmentHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by_user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "event_type",
            length = 40,
            nullable = false
    )
    private HistoryEvent eventType;

    @Column(
            name = "old_value",
            nullable = false
    )
    private String oldValue;

    @Column(
            name = "new_value",
            nullable = false
    )
    private String newValue;

    @Column(
            name = "performed_at",
            nullable = false
    )
    private LocalDateTime performedAt = LocalDateTime.now();

    @Column(
            name = "note",
            length = 150
    )
    private String note = null;

}
