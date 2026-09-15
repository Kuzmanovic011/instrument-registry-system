package rs.pupin.evmer.controller;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.service.ReservationService;


@RestController
@AllArgsConstructor
@RequestMapping("/authenticated/reservation")
public class ReservationController {

    private final ReservationService reservationService;

    //Spisak rezervacija
    @GetMapping
    public ReservationsResponseDto getReservations(
            @ModelAttribute ReservationFilter request,
            @RequestParam(defaultValue = "0")
            int page,
            @RequestParam(defaultValue = "20")
            int size,
            @RequestParam(defaultValue = "id")
            String sortBy,
            @RequestParam(defaultValue = "true")
            boolean ascending
    ){
        return reservationService.getReservations(request,page,size,sortBy,ascending);
    }

    //Dodavanje rezervacije
    @PostMapping("/add/{idEquipment}")
    public ResponseEntity<?> createReservation(
            @PathVariable Long idEquipment,
            @RequestBody CreateReservation request
    )
    {
        return reservationService.createReservation(idEquipment,request);
    }

    //Otkazivanje rezervacije
    @DeleteMapping("/cancel/{idReservation}")
    public ResponseEntity<?> cancelReservation(
            @PathVariable
            Long idReservation,
            @RequestBody
            CancelReservationRequest request
    )
    {
        return reservationService.cancelReservation(idReservation,request);
    }

}
