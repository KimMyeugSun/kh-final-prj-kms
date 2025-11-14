package com.kh.team119.exercise.service;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.dailygoal.repository.DailyGoalRepository;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.exercise.dto.ExerciseDtos;
import com.kh.team119.exercise.entity.ExerciseCatalogEntity;
import com.kh.team119.exercise.entity.ExerciseEntryEntity;
import com.kh.team119.exercise.repository.ExerciseCatalogRepository;
import com.kh.team119.exercise.repository.ExerciseEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseEntryRepository entryRepo;
    private final ExerciseCatalogRepository catalogRepo;
    private final EmployeeRepository empRepo;
    private final DailyGoalRepository dailyGoalRepo;


    public Page<ExerciseDtos.CatalogResp> listCatalog(
            String type, String q,
            BigDecimal weightKg, Integer minutes,
            Pageable pageable) {

        boolean hasType = (type != null && !type.isBlank());
        boolean hasQ = (q != null && !q.isBlank());

        Page<ExerciseCatalogEntity> page;
        if (hasType && hasQ) {
            page = catalogRepo.findByType_TypeCodeAndExerciseNameContainingIgnoreCase(type, q.trim(), pageable);
        } else if (hasType) {
            page = catalogRepo.findByType_TypeCode(type, pageable);
        } else if (hasQ) {
            page = catalogRepo.findByExerciseNameContainingIgnoreCase(q.trim(), pageable);
        } else {
            page = catalogRepo.search(type, q, pageable);
        }

        return page.map(e -> ExerciseDtos.CatalogResp.from(e, weightKg, minutes));
    }

    public ExerciseCatalogEntity getCatalog(Long id) {
        return catalogRepo.findById(id)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_EXERCISE));
    }

    public ExerciseDtos.Resp create(ExerciseDtos.CreateReq req) {
        EmployeeEntity emp = empRepo.findById(req.getEmpNo())
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT));
        ExerciseCatalogEntity exercise = catalogRepo.findById(req.getExerciseNo())
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_EXERCISE));

        BigDecimal weightKg = BigDecimal.valueOf(60);
        BigDecimal kcal = exercise.getEnergyPerKgHr()
                .multiply(weightKg)
                .multiply(BigDecimal.valueOf(req.getDurationMin())
                        .divide(BigDecimal.valueOf(60), 4, RoundingMode.HALF_UP))
                .setScale(1, RoundingMode.HALF_UP);

        ExerciseEntryEntity e = ExerciseEntryEntity.builder()
                .employee(emp)
                .exercise(exercise)
                .workDate(req.getWorkDate())
                .durationMin(req.getDurationMin())
                .weightKg(weightKg)
                .kcalBurned(kcal)
                .doneYn("Y")
                .memo(req.getMemo())
                .createdAt(LocalDateTime.now())
                .build();

        return ExerciseDtos.Resp.from(entryRepo.save(e));
    }

    public ExerciseDtos.Resp get(Long sessionNo) {
        return entryRepo.findById(sessionNo)
                .map(ExerciseDtos.Resp::from)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_WORKOUT));
    }

    public List<ExerciseDtos.Resp> listByEmployee(Long empNo, LocalDate from, LocalDate to) {
        return entryRepo.findByEmployee_EnoAndWorkDateBetween(empNo, from, to)
                .stream().map(ExerciseDtos.Resp::from).toList();
    }
    @Transactional
    public void delete(Long sessionNo) {
        ExerciseEntryEntity entry = entryRepo.findById(sessionNo)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_WORKOUT));

        // 운동만 sessionNo로 관리 → DailyGoal에서도 sessionNo 사용
        if ("WORKOUT".equalsIgnoreCase("WORKOUT")) {
            dailyGoalRepo.deleteByEmployee_EnoAndGoalDateAndItemId(
                    entry.getEmployee().getEno(),
                    entry.getWorkDate(),
                    String.valueOf(entry.getSessionNo())
            );
        }

        entryRepo.delete(entry);
    }



    @Transactional
    public void deleteByEmployeeAndDate(Long empNo, LocalDate date) {
        entryRepo.deleteAllByEmployee_EnoAndWorkDate(empNo, date);
    }

    @Transactional
    public void saveDayMemo(Long empNo, LocalDate date, String dayMemo) {
        List<ExerciseEntryEntity> list = entryRepo.findByEmployee_EnoAndWorkDate(empNo, date);

        if (list.isEmpty()) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_WORKOUT);
        }
        // 하루 전체 기록에 같은 메모를 넣는 방식
        for (ExerciseEntryEntity e : list) {
            e.setMemo(dayMemo);
            e.setUpdatedAt(LocalDateTime.now());
        }
        entryRepo.saveAll(list);
    }

    @Transactional
    public void updateWorkoutMemo(Long empNo, LocalDate date, String dayMemo) {
        List<ExerciseEntryEntity> list = entryRepo.findByEmployee_EnoAndWorkDate(empNo, date);

        for (ExerciseEntryEntity e : list) {
            e.setMemo(dayMemo);
            e.setUpdatedAt(LocalDateTime.now());
        }
        // JPA는 @Transactional 내에서 엔티티 변경 감지(Dirty Checking)로 자동 저장
    }


}
