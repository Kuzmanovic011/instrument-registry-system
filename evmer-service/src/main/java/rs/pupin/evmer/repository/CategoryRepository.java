package rs.pupin.evmer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rs.pupin.evmer.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category,Long> {
    List<Category> findByActiveTrue();
    Optional<Category> findByIdAndActiveTrue(Long id);
    boolean existsByNameIgnoreCaseAndDeletedFalse(String name);
}
