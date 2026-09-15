package rs.pupin.evmer.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangePassword(
        @NotBlank(message = "Mora biti popunjeno!")
        String oldPassword,
        @NotBlank(message = "Mora biti popunjeno!")
        String newPassword1,
        @NotBlank(message = "Mora biti popunjeno!")
        String newPassword2
) {
}
