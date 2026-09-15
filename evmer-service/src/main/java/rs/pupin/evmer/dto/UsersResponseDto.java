package rs.pupin.evmer.dto;



import java.util.List;

public record UsersResponseDto(
        List<UsersDetails> users,
        Long numPageUsers
) {
}
