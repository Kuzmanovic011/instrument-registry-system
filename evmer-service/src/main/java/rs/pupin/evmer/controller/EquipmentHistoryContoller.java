package rs.pupin.evmer.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rs.pupin.evmer.dto.EquipmentHistoryDto;
import rs.pupin.evmer.dto.HistoryFilter;
import rs.pupin.evmer.service.EquipmentHistoryService;

@RestController
@AllArgsConstructor
@RequestMapping("/authenticated/history")
public class EquipmentHistoryContoller {
    private final EquipmentHistoryService equipmentHistoryService;

    //Prikaz istorije
    @GetMapping
    public EquipmentHistoryDto getHistory(
            @ModelAttribute HistoryFilter request,
            @RequestParam(defaultValue = "0")
            int page,
            @RequestParam(defaultValue = "20")
            int size,
            @RequestParam(defaultValue = "id")
            String sortBy,
            @RequestParam(defaultValue = "true")
            boolean ascending
    ){
        return equipmentHistoryService.getHistory(request,page, size, sortBy, ascending);
    }
}
