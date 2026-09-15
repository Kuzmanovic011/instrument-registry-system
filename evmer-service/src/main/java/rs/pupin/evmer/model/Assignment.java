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
@Table(name = "assignment")
public class Assignment extends BaseEntity{


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(
            name = "project_or_task",
            length = 150,
            nullable = false
    )
    private String projectOrTask;

    @Column(
            name = "assigned_at",
            nullable = false
    )
    private LocalDateTime assignedAt = LocalDateTime.now();

    @Column(
            name = "returned_at"
    )
    private LocalDateTime returnedAt ;

    @Column(
            name = "assignment_note"
    )
    private String assignmentNote;

    @Column(
            name = "return_note"
    )
    private String returnNote;


    @Enumerated(EnumType.STRING)
    @Column(
            name = "return_condition"
    )
    private ReturnCondition returnCondition;

    @Column(
            name = "active_assignment",
            nullable = false
    )
    private boolean activeAssignment = true;
}
