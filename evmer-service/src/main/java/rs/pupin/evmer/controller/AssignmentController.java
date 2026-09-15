package rs.pupin.evmer.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.enums.ExpectedTableSort;
import rs.pupin.evmer.service.AssignmentService;


@RestController
@AllArgsConstructor
@RequestMapping("/authenticated/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    //Prikaz zaduzenja
    @GetMapping
    public AssignmentResponse getAssignment(
            @ModelAttribute AssignmentFilter request,
            @RequestParam(defaultValue = "ASSIGNMENTS")
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
        return assignmentService.getAssignment(request,table,page, size, sortBy, ascending);
    }

    //Vracanje uzete opreme
    @PatchMapping("/unassign/{id}")
    public ResponseEntity<?> unassignEquipment(
            @PathVariable Long id,
            @RequestBody UnassignRequest request
    ){
        return assignmentService.unassignEquipment(id,request);
    }

}
