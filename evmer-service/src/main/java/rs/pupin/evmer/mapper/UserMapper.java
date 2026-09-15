package rs.pupin.evmer.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import rs.pupin.evmer.dto.LoginResponse;
import rs.pupin.evmer.dto.UsersDetails;
import rs.pupin.evmer.model.User;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "accessToken", source = "accessToken")
    LoginResponse userToDto(User entity, String accessToken, String refreshToken);

    UsersDetails toDtoUserDetails(User user);
    List<UsersDetails> toDtoUserDetailsList(List<User> users);

}
