package rs.pupin.evmer.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.pupin.evmer.dto.CategoryDto;
import rs.pupin.evmer.service.CategoryService;

@RestController
@AllArgsConstructor
@RequestMapping("/authenticated/category")
public class CategoryController {

    private final CategoryService categoryService;

    //Dodavanje kategorija opreme kao admin
    @PostMapping("/add")
    public ResponseEntity<?> addCategory(
            @RequestBody CategoryDto request
    ){
        return categoryService.addCategory(request);
    }
}
