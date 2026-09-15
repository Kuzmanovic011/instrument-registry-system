package rs.pupin.evmer.dto;

import rs.pupin.evmer.enums.UserRoles;

public record UserEdit(
        String firstName,
        String lastName,
        String username,
        String email,
        String department,
        UserRoles userRoles
) {
}
