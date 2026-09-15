package rs.pupin.evmer.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.pupin.evmer.dto.AppDataResponse;
import rs.pupin.evmer.service.AppDataService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/authenticated/api/app-data")
public class AppDataController {

    private final AppDataService appDataService;

    @GetMapping
    public AppDataResponse getData(){

        return appDataService.getData();
    }
}
