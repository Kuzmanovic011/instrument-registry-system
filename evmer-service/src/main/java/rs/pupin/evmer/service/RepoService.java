package rs.pupin.evmer.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import rs.pupin.evmer.enums.HistoryEvent;
import rs.pupin.evmer.model.Equipment;
import rs.pupin.evmer.model.EquipmentHistory;
import rs.pupin.evmer.model.User;
import rs.pupin.evmer.repository.EquipmentHistoryRepository;
import rs.pupin.evmer.repository.EquipmentRepository;


@Service
@AllArgsConstructor
public class RepoService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentHistoryRepository equipmentHistoryRepository;

    public Equipment getEquipmentById(Long id){

        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Oprema nije pronadjena")
                );

        return equipment;
    }

    public void saveEquipmentHistory(
            Equipment equipment,
            User user,
            HistoryEvent event,
            String oldValue,
            String newValue,
            String note
    ){
        EquipmentHistory history = new EquipmentHistory();

        history.setNote(note);
        history.setUser(user);
        history.setEquipment(equipment);
        history.setEventType(event);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);

        equipmentHistoryRepository.save(history);
    }
}
