package rs.pupin.evmer.service;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import rs.pupin.evmer.Specification.EquipmentSpecification;
import rs.pupin.evmer.dto.*;
import rs.pupin.evmer.enums.*;
import rs.pupin.evmer.mapper.*;
import rs.pupin.evmer.model.*;
import rs.pupin.evmer.repository.*;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;
    private final EquipmentMapper equipmentMapper;
    private final CategoryRepository categoryRepository;
    private final AssignmentRepository assignmentRepository;
    private final CurrentUserService currentUserService;
    private final RepoService repoService;
    private final FileStorageService fileStorageService;
    private final CalibrationMapper calibrationMapper;

    public EquipmentMainResponse getInitialInfo(
            EquipmentFilter request,
            int page,
            int size,
            String sortBy,
            boolean ascending
    ) {

        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page,size,sort);

        List<Equipment> equipments;

        long equipmentNumPage;

        Specification<Equipment> specification= Specification
                .where(EquipmentSpecification.hasName(request.name()))
                .and(EquipmentSpecification.hasInventoryNumber(request.inventoryNumber()))
                .and(EquipmentSpecification.hasSerialNumber(request.serialNumber()))
                .and(EquipmentSpecification.hasManufacturer(request.manufacturer()))
                .and(EquipmentSpecification.hasManufacturerModel(request.manufacturerModel()))
                .and(EquipmentSpecification.hasCategory(request.categoryId()))
                .and(EquipmentSpecification.hasStatus(request.status()))
                .and(EquipmentSpecification.hasHomeLocationDescription(request.homeLocationDescription()));

        if(currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            equipments = equipmentRepository.findAll(specification,pageable).getContent();
            equipmentNumPage = equipmentRepository.findAll(specification,pageable).getTotalPages();
        } else{
            Specification<Equipment> notDeleted=
                    (root,query,cb)-> cb.equal(root.get("deleted"),false);

            equipments = equipmentRepository.findAll(specification.and(notDeleted),pageable).getContent();
            equipmentNumPage = equipmentRepository.findAll(specification.and(notDeleted),pageable).getTotalPages();
        }

        for(Equipment e : equipments)
        {
            if(e.getStatus().equals(EquipmentStatus.ZAUZET))
            {
                Assignment assignment = assignmentRepository.findByEquipmentIdAndActiveAssignmentTrue(e.getId());
                e.setHomeLocationDescription(assignment.getUser().getFirstName() + ' ' + assignment.getUser().getLastName());
            }
        }

        List<EquipmentResponse> equipmentResponses =
                equipmentMapper.toDto(equipments);


        return new EquipmentMainResponse(
                equipmentNumPage,
                equipmentResponses
        );
    }


    @Transactional
    public ResponseEntity<?> createEquipment(
            CreateEquipmentRequest request,
            MultipartFile file
    )
    {
        User user = currentUserService.getAuthenticatedUser();

        if(!user.getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        boolean alreadyExists =
                equipmentRepository
                        .existsBySerialNumberAndManufacturerAndManufacturerModel(
                                request.serialNumber(),
                                request.manufacturer(),
                                request.manufacturerModel()
                        );

        if (alreadyExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                            "Oprema sa istim serijskim brojem, proizvođačem i modelom već postoji");
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Kategorija nije pronađena"
                ));

        if(request.purchaseYear()> Year.now().getValue())
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    "Godina nabavke ne moze biti posle trenutne godine");
        Equipment equipment = equipmentMapper.createEquipmentRequestToEquipment(request);
        equipment.setCategory(category);

        if(equipment.isCalibrationRequired())
        {
            LocalDateTime now = LocalDateTime.now();

            LocalDateTime lastCalibration =
                    request.lastCalibration() != null
                            ? request.lastCalibration()
                            : LocalDateTime.now();

            LocalDateTime nextCalibration =
                    request.nextCalibration() != null
                            ? request.nextCalibration()
                            : lastCalibration.plusYears(1);

            if(lastCalibration.isAfter(now)){
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Datum poslednje kalibracije ne moze biti nakon danasnjeg datuma");
            }

            if(nextCalibration.isBefore(now)){
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Datum sledece kalibracije ne moze biti pre danasnjeg datuma");
            }

            if(nextCalibration.isBefore(lastCalibration)){
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Datum sledece kalibracije ne moze biti pre datuma poslednje kalibracije");
            }

            equipment.setCalibrationNote(request.calibrationNote());
            equipment.setCalibrationStatus(CalibrationStatus.VAZECA);
            equipment.setCalibrationResult(request.calibrationResult());
            equipment.setLastCalibration(lastCalibration);
            equipment.setNextCalibration(nextCalibration);
        }
        else{
            equipment.setCalibrationStatus(CalibrationStatus.NIJE_POTREBNA);
        }
        if (request.parentEquipmentId() != null) {
            Equipment parentEquipment = repoService.getEquipmentById(request.parentEquipmentId());
            equipment.setParentEquipment(parentEquipment);
        } else {
            equipment.setParentEquipment(null);
        }

        String storedFilename = fileStorageService.saveImage(file);
        equipment.setImagePath(
                storedFilename == null
                        ? null
                        : "/uploads/" + storedFilename
        );
        Equipment savedEquipment = equipmentRepository.save(equipment);

        repoService.saveEquipmentHistory(
                savedEquipment,
                user,
                HistoryEvent.DODAVANJE,
                "nema podataka",
                savedEquipment.getStatus().toString(),
                savedEquipment.getNotes()
        );
        return ResponseEntity.status(HttpStatus.CREATED).build();

    }

    @Transactional
    public ResponseEntity<?> editEquipment(
            Long id,
            EquipmentEdit request,
            MultipartFile file
    ){
        User user = currentUserService.getAuthenticatedUser();

        if(!user.getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Equipment equipment = repoService.getEquipmentById(id);

        Category newCategory = equipment.getCategory();

        String oldCategory = historyValue(equipment.getCategory().getName());
        String oldName = historyValue(equipment.getName());
        String oldDesc = historyValue(equipment.getDesc());
        String oldHomeLocationDescription = historyValue(equipment.getHomeLocationDescription());
        String oldStatus = historyValue(equipment.getStatus().toString());
        String oldNotes = historyValue(equipment.getNotes());
        String oldImagePath = historyValue(equipment.getImagePath());
        String oldImageFilePath = equipment.getImagePath();

        String newStoredFilename = null;

        if (request.category() != null) {
            newCategory = categoryRepository
                    .findByIdAndActiveTrue(request.category())
                    .orElseThrow(() ->
                            new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Aktivna kategorija sa ID-em "
                                            + request.category()
                                            + " nije pronađena"
                            )
                    );
        }

        equipmentMapper.updateEquipmentFromDto(request,equipment);

        if (file != null && !file.isEmpty()) {
            newStoredFilename = fileStorageService.saveImage(file);

            equipment.setImagePath("/uploads/" + newStoredFilename);
        }
        equipment.setUpdatedAt(LocalDateTime.now());
        equipment.setCategory(newCategory);
        Equipment savedEquipment = equipmentRepository.saveAndFlush(equipment);

        if (newStoredFilename != null
                && oldImageFilePath != null) {

            fileStorageService.deleteImage(
                    oldImageFilePath
            );
        }

        saveChangeIfDifferent(
                savedEquipment,
                user,
                "name",
                oldName,
                historyValue(savedEquipment.getName())
        );
        saveChangeIfDifferent(
                savedEquipment,
                user,
                "category",
                oldCategory,
                historyValue(savedEquipment.getCategory().getName())
        );
        saveChangeIfDifferent(
                savedEquipment,
                user,
                "desc",
                oldDesc,
                historyValue(savedEquipment.getDesc())
        );
        saveChangeIfDifferent(
                savedEquipment,
                user,
                "homeLocationDescription",
                oldHomeLocationDescription,
                historyValue(savedEquipment.getHomeLocationDescription())
        );
        saveChangeIfDifferent(
                savedEquipment,
                user,
                "status",
                oldStatus,
                historyValue(savedEquipment.getStatus().toString())
        );
        saveChangeIfDifferent(
                savedEquipment,
                user,
                "notes",
                oldNotes,
                historyValue(savedEquipment.getNotes())
        );
        saveChangeIfDifferent(
                savedEquipment,
                user,
                "imagePath",
                oldImagePath,
                historyValue(savedEquipment.getImagePath())
        );

        return ResponseEntity.ok().build();
    }

    public EquipmentResponse getEquipmentDetails(
            Long id
    ){
        Equipment equipment;

        if(currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR))
        {
            equipment = repoService.getEquipmentById(id);
        } else {
            equipment = equipmentRepository.findByIdAndDeletedFalse(id)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Aktivna oprema sa ID-em " + id + " nije pronađena."
                            ));

        }

        return equipmentMapper.equipmentToDto(equipment);
    }

    @Transactional
    public ResponseEntity<?> deleteEquipment(
            Long id,
            DeleteEquipmentRequest request
    ){

            User user = currentUserService.getAuthenticatedUser();
            if(!user.getRole().equals(UserRoles.ADMINISTRATOR)){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            Equipment equipment = repoService.getEquipmentById(id);

            if(equipment.isDeleted()){
                return ResponseEntity.
                        status(HttpStatus.CONFLICT)
                        .body("Equipment nije dostupan");

            }
            Assignment activeAssignments = assignmentRepository.findByEquipmentIdAndActiveAssignmentTrue(id);

            List<Equipment> accessories = equipment.getAccessories();

            if(accessories != null && !accessories.isEmpty()){
                return ResponseEntity.
                        status(HttpStatus.CONFLICT)
                        .body("Equipment ne moze biti obrisan jer ima zavisne delove opreme");
            }
            if(activeAssignments != null){
                return ResponseEntity.
                        status(HttpStatus.CONFLICT)
                        .body("Equipment ne moze biti obrisan jer ima aktivna zaduzenja");

            }

            equipment.setDeletedAt(LocalDateTime.now());
            equipment.setDeletedBy(user);
            equipment.setDeleted(true);

            Equipment savedEquipment = equipmentRepository.save(equipment);

            String note = request != null ? request.note() : null;

            repoService.saveEquipmentHistory(
                    savedEquipment,
                    user,
                    HistoryEvent.BRISANJE,
                    "Aktivan",
                    "Obrisan",
                    note
            );

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Transactional
    public ResponseEntity<?> restoreEquipment(
            Long id
    ){
        User user = currentUserService.getAuthenticatedUser();

        if(!user.getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Equipment equipment = repoService.getEquipmentById(id);

        if(!equipment.isDeleted()){
            return ResponseEntity.
                    status(HttpStatus.CONFLICT)
                    .body("Equipment je vec dostupan");
        }

        equipment.setDeletedAt(null);
        equipment.setDeletedBy(null);
        equipment.setDeleted(false);

        Equipment savedEquipment = equipmentRepository.save(equipment);

        repoService.saveEquipmentHistory(
                savedEquipment,
                user,
                HistoryEvent.RESTOROVANJE,
                "Obrisan",
                "Aktivan",
                null
        );
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Transactional
    public ResponseEntity<?> addExecutedCalibration(
            Long id,
            EquipmentCreateCalibration request

    ){
        User user = currentUserService.getAuthenticatedUser();

        if(!user.getRole().equals(UserRoles.ADMINISTRATOR))
        {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Equipment equipment = repoService.getEquipmentById(id);

        if(!equipment.isCalibrationRequired()){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        String oldCalibrationResult = historyValue(equipment.getCalibrationResult());

        calibrationMapper.addExecutedCalibrationToEquipmentFromDto(request,equipment);

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime lastCalibration =
                request.lastCalibration() != null
                        ? request.lastCalibration()
                        : LocalDateTime.now();

        LocalDateTime nextCalibration =
                request.nextCalibration() != null
                        ? request.nextCalibration()
                        : lastCalibration.plusYears(1);

        if(lastCalibration.isAfter(now)){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Datum poslednje kalibracije ne moze biti nakon danasnjeg datuma");
        }

        if(nextCalibration.isBefore(now)){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Datum sledece kalibracije ne moze biti pre danasnjeg datuma");
        }

        if(nextCalibration.isBefore(lastCalibration)){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Datum sledece kalibracije ne moze biti pre datuma poslednje kalibracije");
        }

        equipment.setCalibrationStatus(CalibrationStatus.VAZECA);
        equipment.setLastCalibration(lastCalibration);
        equipment.setNextCalibration(nextCalibration);
        equipment.setUpdatedAt(LocalDateTime.now());

        Equipment savedEquipment = equipmentRepository.save(equipment);
        repoService.saveEquipmentHistory(
                equipment,
                user,
                HistoryEvent.DODVANJE_KALIBRACIJE,
                oldCalibrationResult,
                savedEquipment.getCalibrationResult().toString(),
                request.calibrationNote()
        );
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Transactional
    public ResponseEntity<?> addScheduledCalibration(
            Long id,
            EquipmentScheduleCalibration request
    ){

        if(!currentUserService.getAuthenticatedUser().getRole().equals(UserRoles.ADMINISTRATOR)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if(request.date().isBefore(LocalDateTime.now())){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Equipment equipment = repoService.getEquipmentById(id);

        if(!equipment.isCalibrationRequired()){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
        }

        LocalDateTime oldDate =
                equipment.getNextCalibration();

        LocalDateTime nextCalibration =
                equipment.getNextCalibration();

        if (!nextCalibration.isAfter(LocalDateTime.now().plusMonths(1)))
        {
            equipment.setCalibrationStatus(
                    CalibrationStatus.USKORO_ISTICE
            );
        } else {
            equipment.setCalibrationStatus(
                    CalibrationStatus.VAZECA
            );
        }

        equipment.setNextCalibration(request.date());

        repoService.saveEquipmentHistory(
                equipment,
                currentUserService.getAuthenticatedUser(),
                HistoryEvent.ZAKAZIVANJE_KALIBRACIJE,
                oldDate.toString(),
                equipment.getNextCalibration().toString(),
                null
        );

        equipmentRepository.saveAndFlush(equipment);

        return ResponseEntity.ok().build();
    }


    public void saveChangeIfDifferent(
            Equipment equipment,
            User user,
            String field,
            String oldValue,
            String newValue
    ){
        if(Objects.equals(oldValue,newValue)){
            return;
        }

        repoService.saveEquipmentHistory(
                equipment,
                user,
                HistoryEvent.IZMENA_PODATAKA,
                oldValue,
                newValue,
                "promenjeno je polje: " + field
        );

    }

    private String historyValue(Object value) {
        if (value == null) {
            return "nepoznata vrednost";
        }

        String text = value.toString();

        return text.isBlank()
                ? "nepoznata vrednost"
                : text;
    }
}
