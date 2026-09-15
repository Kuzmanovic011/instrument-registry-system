package rs.pupin.evmer.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import rs.pupin.evmer.Specification.UserSpecification;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.enums.ReservationStatus;
import rs.pupin.evmer.enums.UserRoles;
import rs.pupin.evmer.mapper.UserMapper;
import rs.pupin.evmer.model.User;
import rs.pupin.evmer.repository.AssignmentRepository;
import rs.pupin.evmer.repository.ReservationRepository;
import rs.pupin.evmer.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class UserService {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AssignmentRepository assignmentRepository;
    private final ReservationRepository reservationRepository;

    public UsersResponseDto getUsers(
            UserFilter request,
            int page,
            int size,
            String sortBy,
            boolean ascending
    ){
        if (!currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN
            );
        }
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<User> specification= Specification
                .where(UserSpecification.hasFirstName(request.firstName()))
                .and(UserSpecification.hasLastName(request.lastName()))
                .and(UserSpecification.hasUsername(request.username()))
                .and(UserSpecification.hasEmail(request.email()))
                .and(UserSpecification.hasRole(request.role()))
                .and(UserSpecification.hasDepartment(request.department()));

        Page<User> userPage = userRepository.findAll(specification,pageable);

        List<User> users = userPage.getContent();
        long numPageUsers = userPage.getTotalPages();

        return new UsersResponseDto(
                userMapper.toDtoUserDetailsList(users),
                numPageUsers
            );
    }

    @Transactional
    public ResponseEntity<?> promoteUser(
            Long id
    ){
        if(!currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User user= userRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Korisnik nije pronađen."
                ));


        if (user.getRole().equals(UserRoles.ADMINISTRATOR))
            return ResponseEntity.status(HttpStatus.CONFLICT).build();

        user.setRole(UserRoles.ADMINISTRATOR);

        userRepository.saveAndFlush(user);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Transactional
    public ResponseEntity<?> addUser(
            UserRequest request
    ){
        if(!currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (userRepository.existsByUsername(request.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        User user= new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setCreatedAt(LocalDateTime.now());
        user.setDepartment(request.department());

        userRepository.saveAndFlush(user);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Transactional
    public ResponseEntity<?> editUser(
             Long id,
            UserEdit request

    ){
        if(!currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        User user = userRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Korisnik nije pronadjen."
                ));
        if (userRepository.existsByUsernameAndIdNot(request.username(),user.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if (userRepository.existsByEmailAndIdNot(request.email(),user.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setRole(request.userRoles());
        user.setDepartment(request.department());
        userRepository.saveAndFlush(user);
        return ResponseEntity.ok().build();
    }
    @Transactional
    public ResponseEntity<?> deleteUser(
            Long id
    ){

        if(!currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User user=userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Korisnik nije pronađen."
                ));

        if(user.isDeleted()){
            return ResponseEntity.
                    status(HttpStatus.CONFLICT)
                    .body("Korisnik nije dostupan");

        }

        if(reservationRepository.existsByUserIdAndStatus(user.getId(), ReservationStatus.AKTIVNA)){
            return ResponseEntity.
                    status(HttpStatus.CONFLICT)
                    .body("Korisnik ima aktivnu rezervaciju i ne moze se obrisati!");

        }

        if(assignmentRepository.existsByUserIdAndActiveAssignmentTrue(user.getId())){
            return ResponseEntity.
                    status(HttpStatus.CONFLICT)
                    .body("Korisnik ima aktivno zaduzenje i ne moze se obrisati!");

        }

        user.setActive(false);
        user.setDeleted(true);
        user.setDeletedBy(currentUserService.getAuthenticatedUser());
        user.setDeletedAt(LocalDateTime.now());

        userRepository.saveAndFlush(user);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Transactional
    public ResponseEntity<?> restoreUser(
            Long id
    ){
        if(!currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Korisnik nije pronađen."
                ));

        if(!user.isDeleted()){
            return ResponseEntity.
                    status(HttpStatus.CONFLICT)
                    .body("Korisnik je vec dostupan");
        }

        user.setDeletedAt(null);
        user.setDeletedBy(null);
        user.setDeleted(false);
        user.setActive(true);

        userRepository.saveAndFlush(user);

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    public UsersDetails getProfile(){
        User user=currentUserService.getAuthenticatedUser();

        User profile=userRepository.findByIdAndActiveTrue(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Korisnik nije pronađen."
                ));

        return userMapper.toDtoUserDetails(profile);
    }

    @Transactional
    public ResponseEntity<?> editProfile(
            EditProfile request

    ){
        User user=currentUserService.getAuthenticatedUser();
        User profile = userRepository.findByIdAndActiveTrue(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Korisnik nije pronađen."
                ));

        if (userRepository.existsByEmailAndIdNot(request.email(),profile.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        profile.setFirstName(request.firstName());
        profile.setLastName(request.lastName());
        profile.setEmail(request.email());
        profile.setDepartment(request.department());
        userRepository.saveAndFlush(profile);
        return ResponseEntity.ok().build();
    }

    @Transactional
    public ResponseEntity<?> changePassword(
            ChangePassword request

    ){
        User user=currentUserService.getAuthenticatedUser();
        User profile = userRepository.findByIdAndActiveTrue(user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Korisnik nije pronađen."
                ));

        if(!passwordEncoder.matches(request.oldPassword(),profile.getPassword())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Pogresna lozinka!");
        }

        if (!request.newPassword1().equals(request.newPassword2())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Nove lozinke se ne poklapaju!");
        }

        if(passwordEncoder.matches(request.newPassword1(),profile.getPassword())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Nova lozinka mora biti drugacija od stare!");
        }

        profile.setPassword(passwordEncoder.encode(request.newPassword1()));
        userRepository.saveAndFlush(profile);

        return ResponseEntity.ok().build();
    }

    @Transactional
    public ResponseEntity<?> changePasswordAdmin(
            Long id,
            ChangePasswordAdmin request

    ){
        if(!currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        User user=userRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Korisnik nije pronadjen."
        ));

        if (!request.newPassword1().equals(request.newPassword2())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Nove lozinke se ne poklapaju!");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword1()));
        userRepository.saveAndFlush(user);

        return ResponseEntity.ok().build();
    }


}
