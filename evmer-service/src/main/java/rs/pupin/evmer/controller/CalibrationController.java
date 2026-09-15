package rs.pupin.evmer.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rs.pupin.evmer.dto.CalibrationFilter;
import rs.pupin.evmer.dto.CalibrationResponse;
import rs.pupin.evmer.service.CalibartionService;

@RestController
@AllArgsConstructor
@RequestMapping("/authenticated/calibrations")
public class CalibrationController {

    private final CalibartionService calibartionService;

    //Ispis kalibracije opreme
    @GetMapping
    public CalibrationResponse getCalibrations(
            @ModelAttribute CalibrationFilter request,
            @RequestParam(defaultValue = "0")
            int page,
            @RequestParam(defaultValue = "20")
            int size,
            @RequestParam(defaultValue = "id")
            String sortBy,
            @RequestParam(defaultValue = "true")
            boolean ascending
    ){
        return calibartionService.getCalibrations(request,page, size, sortBy, ascending);
    }

}
