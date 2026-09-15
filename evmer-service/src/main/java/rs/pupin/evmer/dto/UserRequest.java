package rs.pupin.evmer.dto;

import rs.pupin.evmer.enums.UserRoles;


public record UserRequest (
        String firstName,
        String lastName,
        String username,
        String email,
        String password,
        UserRoles role,
        String department
) {
}
