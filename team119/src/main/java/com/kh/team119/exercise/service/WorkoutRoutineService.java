package com.kh.team119.exercise.service;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.exercise.dto.WorkoutRoutineDtos;
import com.kh.team119.exercise.entity.*;
import com.kh.team119.exercise.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class WorkoutRoutineService {

    private final WorkoutRoutineRepository routineRepo;
    private final WorkoutRoutineItemRepository routineItemRepo;
    private final ExerciseCatalogRepository catalogRepo;
    private final ExerciseEntryRepository entryRepo;
    private final EmployeeRepository empRepo;

    @Transactional
    public WorkoutRoutineDtos.Resp create(WorkoutRoutineDtos.CreateReq req) {
        EmployeeEntity emp = empRepo.findById(req.getEmpNo())
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT));

        WorkoutRoutineEntity r = WorkoutRoutineEntity.builder()
                .employee(emp)
                .routineName(req.getRoutineName())
                .createdAt(LocalDateTime.now())
                .build();

        for (var it : req.getItems()) {
            ExerciseCatalogEntity ex = catalogRepo.findById(it.getExerciseNo())
                    .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_EXERCISE));
            r.getItems().add(
                    WorkoutRoutineItemEntity.builder()
                            .routine(r)
                            .exercise(ex)
                            .defaultMin(it.getMinutes() == null ? 60 : it.getMinutes())
                            .build()
            );
        }
        var saved = routineRepo.save(r);
        return toResp(saved);
    }

    public List<WorkoutRoutineDtos.Resp> listByEmployee(Long empNo) {
        return routineRepo.findByEmployee_Eno(empNo).stream().map(this::toResp).toList();
    }

    private WorkoutRoutineDtos.Resp toResp(WorkoutRoutineEntity r) {
        return WorkoutRoutineDtos.Resp.builder()
                .routineNo(r.getRoutineNo())
                .routineName(r.getRoutineName())
                .items(r.getItems().stream().map(i ->
                        WorkoutRoutineDtos.ItemResp.builder()
                                .itemNo(i.getItemNo())
                                .exerciseNo(i.getExercise().getExerciseNo())
                                .exerciseName(i.getExercise().getExerciseName())
                                .minutes(i.getDefaultMin())
                                .energyPerKgHr(i.getExercise().getEnergyPerKgHr())
                                .build()
                ).toList())
                .build();
    }

    @Transactional
    public WorkoutRoutineDtos.ItemResp addItem(Long routineNo, WorkoutRoutineDtos.ItemReq req) {
        WorkoutRoutineEntity routine = routineRepo.findById(routineNo)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_ROUTINE));
        ExerciseCatalogEntity ex = catalogRepo.findById(req.getExerciseNo())
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_EXERCISE));

        WorkoutRoutineItemEntity item = WorkoutRoutineItemEntity.builder()
                .routine(routine)
                .exercise(ex)
                .defaultMin(req.getMinutes() == null ? 60 : req.getMinutes())
                .build();

        var saved = routineItemRepo.save(item);
        return WorkoutRoutineDtos.ItemResp.builder()
                .itemNo(saved.getItemNo())
                .exerciseNo(ex.getExerciseNo())
                .exerciseName(ex.getExerciseName())
                .minutes(saved.getDefaultMin())
                .energyPerKgHr(ex.getEnergyPerKgHr())
                .build();
    }

    @Transactional
    public void deleteItem(Long itemNo) {
        routineItemRepo.deleteById(itemNo);
    }

    @Transactional
    public void apply(WorkoutRoutineDtos.ApplyReq req) {
        WorkoutRoutineEntity r = routineRepo.findById(req.getRoutineNo())
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_ROUTINE));
        EmployeeEntity emp = empRepo.findById(req.getEmpNo())
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT));

        BigDecimal weightKg = BigDecimal.valueOf(60);

        for (var it : r.getItems()) {
            int minutes = req.getDefaultMinutesOverride() != null
                    ? req.getDefaultMinutesOverride()
                    : (it.getDefaultMin() == null ? 60 : it.getDefaultMin());

            ExerciseCatalogEntity ex = it.getExercise();

            BigDecimal kcal = ex.getEnergyPerKgHr()
                    .multiply(weightKg)
                    .multiply(BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 4, RoundingMode.HALF_UP))
                    .setScale(1, RoundingMode.HALF_UP);

            ExerciseEntryEntity e = ExerciseEntryEntity.builder()
                    .employee(emp)
                    .exercise(ex)
                    .workDate(req.getWorkDate())
                    .durationMin(minutes)
                    .weightKg(weightKg)
                    .kcalBurned(kcal)
                    .doneYn("Y")
                    .createdAt(LocalDateTime.now())
                    .build();

            entryRepo.save(e);
        }
    }

    @Transactional
    public void delete(Long routineNo) {
        routineRepo.deleteById(routineNo);
    }

    @Transactional
    public WorkoutRoutineDtos.Resp updateName(Long routineNo, String newName) {
        WorkoutRoutineEntity routine = routineRepo.findById(routineNo)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_ROUTINE));
        routine.setRoutineName(newName);
        return toResp(routine);
    }

}
