package com.kh.team119.exercise.controller;

import com.kh.team119.exercise.dto.WorkoutRoutineDtos;
import com.kh.team119.exercise.service.WorkoutRoutineService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout-routines")
@RequiredArgsConstructor
public class WorkoutApiRoutineController {

    private final WorkoutRoutineService service;

    @PostMapping
    public WorkoutRoutineDtos.Resp create(@RequestBody WorkoutRoutineDtos.CreateReq req) {
        return service.create(req);
    }

    @GetMapping
    public List<WorkoutRoutineDtos.Resp> listByEmployee(@RequestParam Long empNo) {
        return service.listByEmployee(empNo);
    }

    /**
     * 루틴 항목 단건 추가
     */
    @PostMapping("/{routineNo}/items")
    public WorkoutRoutineDtos.ItemResp addItem(
            @PathVariable Long routineNo,
            @RequestBody WorkoutRoutineDtos.ItemReq req
    ) {
        return service.addItem(routineNo, req);
    }

    /**
     * 루틴 항목 단건 삭제
     */
    @DeleteMapping("/items/{itemNo}")
    public void deleteItem(@PathVariable Long itemNo) {
        service.deleteItem(itemNo);
    }

    /**
     * 루틴을 지정 날짜에 적용
     */
    @PostMapping("/apply")
    public void apply(@RequestBody WorkoutRoutineDtos.ApplyReq req) {
        service.apply(req);
    }

    @DeleteMapping("/{routineNo}")
    public void delete(@PathVariable Long routineNo) {
        service.delete(routineNo);
    }

    @PutMapping("/{routineNo}")
    public WorkoutRoutineDtos.Resp updateName(
            @PathVariable Long routineNo,
            @RequestBody WorkoutRoutineDtos.CreateReq req
    ) {
        return service.updateName(routineNo, req.getRoutineName());
    }
}
