package rs.pupin.evmer.model;


import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "category")
public class Category extends BaseEntity {

    @Column(
            name = "name",
            nullable = false,
            length = 40
    )
    private String name;

    @Column(
            name = "description"
    )
    private String desc;

    @Column(
            name = "active",
            nullable = false
            )
    private boolean active = true;

    @Column(
            name = "deleted",
            nullable = false
    )
    private boolean deleted = false;

    @Column(
            name = "deleted_at"
    )
    private LocalDateTime deletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deleted_by_user_id")
    private User deletedBy;

}
