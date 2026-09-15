package rs.pupin.evmer.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.service.UserService;

@RestController
@AllArgsConstructor
@RequestMapping("/authenticated/users")
public class UsersController {

    private final UserService userService;

    //Spisak korisnika
    @GetMapping
    public UsersResponseDto getUsers(
            @ModelAttribute UserFilter request,
            @RequestParam(defaultValue = "0")
            int page,
            @RequestParam(defaultValue = "20")
            int size,
            @RequestParam(defaultValue = "id")
            String sortBy,
            @RequestParam(defaultValue = "true")
            boolean ascending
    ){
        return userService.getUsers(request,page,size,sortBy,ascending);
    }

    //Dodavanje korisnika
    @PostMapping("/add")
    public ResponseEntity<?> addUser(
            @RequestBody UserRequest request
    ){
        return userService.addUser(request);
    }

    //Izmena korisnika u admina
    @PatchMapping(path = "/{id}")
    public ResponseEntity<?> promoteUser(
            @PathVariable Long id
    ){
        return userService.promoteUser(id);
    }

    //Izmena korisnika
    @PatchMapping(path = "/edit/{id}")
    public ResponseEntity<?> editUser(
            @PathVariable Long id,
            @RequestBody UserEdit request

    ){
        return userService.editUser(id,request);
    }

    //Brisanje korisnika
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id
    ){
        return userService.deleteUser(id);
    }

    //Aktiviranje obrisanog korisnika
    @PatchMapping("/restore/{id}")
    public ResponseEntity<?> restoreUser(
            @PathVariable Long id
    ){
        return userService.restoreUser(id);
    }

    //Prikaz profila prijavljenog korisnika
    @GetMapping("/profile")
    public UsersDetails getUsers(
    ){
        return userService.getProfile();
    }

    //Izmena profila trenutno prijavljenog korisnika
    @PatchMapping(path = "profile/edit")
    public ResponseEntity<?> editProfile(
            @RequestBody EditProfile request

    ){
        return userService.editProfile(request);
    }

    //Izmena lozinke
    @PatchMapping(path = "profile/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePassword request

    ){
        return userService.changePassword(request);
    }

    //Izmena lozinke - admin
    @PatchMapping(path = "edit/password/{id}")
    public ResponseEntity<?> changePasswordAdmin(
            @PathVariable Long id,
            @RequestBody ChangePasswordAdmin request

    ){
        return userService.changePasswordAdmin(id,request);
    }
}
