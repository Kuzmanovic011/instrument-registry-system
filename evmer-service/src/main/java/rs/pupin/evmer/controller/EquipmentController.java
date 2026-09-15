package rs.pupin.evmer.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.service.AssignmentService;
import rs.pupin.evmer.service.EquipmentService;
import rs.pupin.evmer.service.FaultReportService;
import rs.pupin.evmer.service.ReservationService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/authenticated/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final AssignmentService assignmentService;
    private final FaultReportService faultReportService;
    private final ReservationService reservationService;


    //filtriranje sortiranje i paginacija -> 3u1
    @GetMapping
    public EquipmentMainResponse getInitialInfo(
            @ModelAttribute EquipmentFilter request,
            @RequestParam(defaultValue = "0")
            int page,
            @RequestParam(defaultValue = "20")
            int size,
            @RequestParam(defaultValue = "id")
            String sortBy,
            @RequestParam(defaultValue = "true")
            boolean ascending
    ) {
        return equipmentService.getInitialInfo(request,page,size,sortBy,ascending);
    }

    //Dodavanje opreme
    @PostMapping(path = "/add", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createEquipment(
            @RequestPart("data")
            CreateEquipmentRequest request,
            @RequestPart(
                    value = "file",
                    required = false
            )
            MultipartFile file
        ){
            return equipmentService.createEquipment(request,file);
        }

    //Izmena opreme
    @PatchMapping(path = "/edit/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> editEquipment(
            @PathVariable Long id,
            @RequestPart("data")
            EquipmentEdit request,
            @RequestPart(
                    value = "file",
                    required = false
            )
            MultipartFile file

    ){
        return equipmentService.editEquipment(id,request,file);
    }

    //Unos vec izvrsene kalibracije, npr dugme dodaj kalibraciju
    @PostMapping("/calibration/add/{id}")
    public ResponseEntity<?> addExecutedCalibration(
            @PathVariable Long id,
            @RequestBody EquipmentCreateCalibration request
    ){
        return equipmentService.addExecutedCalibration(id,request);
    }

    //Zakazivanje kalibracije
    @PostMapping("/calibration/schedule/{id}")
    public ResponseEntity<?> addScheduledCalibration(
            @PathVariable Long id,
            @RequestBody EquipmentScheduleCalibration request
    ){
        return equipmentService.addScheduledCalibration(id,request);
    }

    //Detaljan prikaz jednog equipment-a
    @GetMapping("/{id}")
    public EquipmentResponse getEquipmentDetails(
            @PathVariable Long id
    ){
        return equipmentService.getEquipmentDetails(id);
    }

    //Soft delete equipmenta
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipment(
            @PathVariable Long id,
            @Valid @RequestBody DeleteEquipmentRequest request
    ){
        return equipmentService.deleteEquipment(id,request);
    }

    //Restore obrisane opreme
    @PatchMapping("/restore/{id}")
    public ResponseEntity<?> restoreEquipment(
            @PathVariable Long id
    ){
        return equipmentService.restoreEquipment(id);
    }

    //Zaduzivanje opreme
    @PostMapping("/assign/{id}")
    public ResponseEntity<?> assignEquipment(
            @PathVariable Long id,
            @RequestBody CreateAssignment request
    ){
        return assignmentService.assignEquipment(id,request);
    }

    //Prijava kvara na stranici opreme
    @PostMapping("/fault-report/{id}")
    public ResponseEntity<?> faultReportEquipment(
            @PathVariable Long id,
            @RequestBody EquipmentFaultReport request
    ){
        return faultReportService.createFaultReport(id,request);
    }

    //Resavanje kvara
    @PostMapping("/fault-resolve/{id}")
    public ResponseEntity<?> faultResolveEquipment(
            @PathVariable Long id,
            @RequestBody FaultResolve request
    ){
        return faultReportService.faultResolveEquipment(id,request);
    }

    @GetMapping("/reservations/{id}")
    public Long countActiveReservations(
            @PathVariable Long id
    ){
        return reservationService.countActiveReservations(id);
    }
}
