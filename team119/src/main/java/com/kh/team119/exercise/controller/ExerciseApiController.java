package com.kh.team119.exercise.controller;

import com.kh.team119.exercise.dto.ExerciseDtos;
import com.kh.team119.exercise.entity.ExerciseCatalogEntity;
import com.kh.team119.exercise.entity.ExerciseEntryEntity;
import com.kh.team119.exercise.service.ExerciseCatalogService;
import com.kh.team119.exercise.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExerciseApiController {

    private final ExerciseService exerciseService;
    private final ExerciseCatalogService catalogService;

    // 운동 카탈로그
    @GetMapping("/exercises")
    public Page<ExerciseDtos.CatalogResp> listCatalog(
            @RequestParam(required = false) String type,   // CAR   DIO/STRENGTH/SPORTS/PILATES/OTHER
            @RequestParam(required = false) String q,
            @RequestParam(required = false) BigDecimal weightKg,
            @RequestParam(required = false) Integer minutes,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return exerciseService.listCatalog(type, q, weightKg, minutes, PageRequest.of(page, size));
    }

    @GetMapping("/exercises/{id}")
    public ExerciseCatalogEntity getCatalog(@PathVariable Long id) {
        return catalogService.get(id);
    }

    // 운동 기록
    @PostMapping("/workouts")
    public ExerciseDtos.Resp create(@RequestBody ExerciseDtos.CreateReq req) {
        return exerciseService.create(req);
    }

    @GetMapping("/workouts/{sessionNo}")
    public ExerciseDtos.Resp get(@PathVariable Long sessionNo) {
        return exerciseService.get(sessionNo);
    }

    @GetMapping("/workouts/by-employee")
    public List<ExerciseDtos.Resp> listByEmployee(@RequestParam Long empNo,
                                                  @RequestParam LocalDate from,
                                                  @RequestParam LocalDate to) {
        return exerciseService.listByEmployee(empNo, from, to);
    }

    // 운동 단건 삭제
    @DeleteMapping("/workouts/{sessionNo}")
    public void delete(@PathVariable Long sessionNo) {
        exerciseService.delete(sessionNo);
    }

    // 당일날 운동 전체 삭제..
    // DateTimeFormat 안 해주니까 전체삭제 안됨
    @DeleteMapping("/workouts")
    public ResponseEntity<Void> deleteByEmployeeAndDate(
            @RequestParam Long empNo,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        System.out.println("empNo = " + empNo + ", date = " + date);
        exerciseService.deleteByEmployeeAndDate(empNo, date);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/workouts/memo")
    public ResponseEntity<Void> updateWorkoutMemo(@RequestParam Long empNo,
                                                  @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                  @RequestBody String dayMemo) {
        exerciseService.updateWorkoutMemo(empNo, date, dayMemo);
        return ResponseEntity.ok().build();
    }

}
