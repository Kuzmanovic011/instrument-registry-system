package rs.pupin.evmer.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import rs.pupin.evmer.enums.UserRoles;


import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "users")
public class User extends BaseEntity {

    @Column(
            name = "first_name",
            nullable = false,
            length = 20
    )
    private String firstName;

    @Column(
            name = "last_name",
            nullable = false,
            length = 30
    )
    private String lastName;

    @Column(
            name = "username",
            nullable = false,
            unique = true,
            length = 30
    )
    private String username;

    @Column(
            name = "email",
            nullable = false,
            unique = true,
            length = 50
    )
    private String email;

    @Column(
            name = "password",
            nullable = false
    )
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(
            name = "role",
            nullable = false,
            length = 20
    )
    private UserRoles role;

    @Column(
            name = "department",
            nullable = false,
            length = 20
    )
    private String department;

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

    @CreatedDate
    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "last_login_at"
    )
    private LocalDateTime lastLoginAt = LocalDateTime.now();


}
