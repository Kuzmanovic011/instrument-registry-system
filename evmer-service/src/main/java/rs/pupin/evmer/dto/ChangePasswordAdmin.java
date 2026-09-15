package rs.pupin.evmer.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordAdmin(
        @NotBlank(message = "Mora biti popunjeno!")
        String newPassword1,
        @NotBlank(message = "Mora biti popunjeno!")
        String newPassword2
) {
}
