package rs.pupin.evmer.mapper;

import org.mapstruct.Mapper;
import rs.pupin.evmer.dto.EquipmentCategory;
import rs.pupin.evmer.model.Category;
import java.util.List;

@Mapper(componentModel="spring")
public interface CategoryMapper {

    EquipmentCategory toDtoEquipmentCategory(Category entity);
    List<EquipmentCategory> toDtoEquipmentCategoryList (List<Category> entity);
}
