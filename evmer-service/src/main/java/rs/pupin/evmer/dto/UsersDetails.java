package rs.pupin.evmer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import rs.pupin.evmer.enums.UserRoles;

import java.time.LocalDateTime;

public record UsersDetails(
        Long id,
        String firstName,
        String lastName,
        String username,
        String email,
        UserRoles role,
        String department,
        boolean active,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime lastLoginAt,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
        LocalDateTime createdAt
) {
}
