package rs.pupin.evmer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rs.pupin.evmer.dto.EquipmentResponseIndex;
import rs.pupin.evmer.enums.ExpectedTableSort;
import rs.pupin.evmer.service.IndexService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/authenticated/index")
public class IndexController {

    private final IndexService indexService;

    @GetMapping
    public EquipmentResponseIndex getInitialInfo(
            @RequestParam(defaultValue = "ACTIVITIES")
            ExpectedTableSort table,
            @RequestParam(defaultValue = "0")
            int page,
            @RequestParam(defaultValue = "20")
            int size,
            @RequestParam(defaultValue = "id")
            String sortBy,
            @RequestParam(defaultValue = "true")
            boolean ascending
    ){
        return indexService.getInitialInfo(table,page,size,sortBy,ascending);
    }
}
