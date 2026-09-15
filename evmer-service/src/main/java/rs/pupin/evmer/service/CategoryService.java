package rs.pupin.evmer.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import rs.pupin.evmer.dto.CategoryDto;
import rs.pupin.evmer.enums.UserRoles;
import rs.pupin.evmer.model.Category;
import rs.pupin.evmer.repository.CategoryRepository;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CurrentUserService currentUserService;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ResponseEntity<?> addCategory(
            CategoryDto request
    )
    {
        if(!currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        if (categoryRepository.existsByNameIgnoreCaseAndDeletedFalse(request.name())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Category category=new Category();
        category.setName(request.name());
        category.setDesc(request.desc());
        categoryRepository.save(category);

        return ResponseEntity.status(HttpStatus.CREATED).build();

    }


}
