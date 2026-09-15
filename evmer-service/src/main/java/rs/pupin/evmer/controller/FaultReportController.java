package rs.pupin.evmer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rs.pupin.evmer.dto.FaultReportFilter;
import rs.pupin.evmer.dto.FaultReportResponse;
import rs.pupin.evmer.service.FaultReportService;


@RestController
@RequiredArgsConstructor
@RequestMapping("/authenticated/fault-report")
public class FaultReportController {

    private final FaultReportService faultReportService;

    //Prikaz kvarova
    @GetMapping
    public FaultReportResponse getFaultReport(
            @ModelAttribute FaultReportFilter request,
            @RequestParam(defaultValue = "0")
            int page,
            @RequestParam(defaultValue = "20")
            int size,
            @RequestParam(defaultValue = "id")
            String sortBy,
            @RequestParam(defaultValue = "true")
            boolean ascending
    ) {
        return faultReportService.getFaultReport(request,page,size,sortBy,ascending);
    }
}
