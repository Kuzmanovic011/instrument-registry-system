package rs.pupin.evmer.dto;

import rs.pupin.evmer.enums.UserRoles;

public record UserFilter(
        String firstName,
        String lastName,
        String username,
        String email,
        UserRoles role,
        String department
) {
}
