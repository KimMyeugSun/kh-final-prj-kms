package com.kh.team119.dailygoal.controller;

import com.kh.team119.dailygoal.dto.DailyGoalDto;
import com.kh.team119.dailygoal.service.DailyGoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/daily-goals")
@RequiredArgsConstructor
public class DailyGoalApiController {

    private final DailyGoalService service;

    // 토글 저장
    @PostMapping("/toggle")
    public ResponseEntity<Void> toggle(@RequestBody DailyGoalDto req) {
        service.toggleGoal(req);
        return ResponseEntity.ok().build();
    }

    // 특정 날짜 불러오기
    @GetMapping
    public List<DailyGoalDto> list(@RequestParam Long empNo,
                                   @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.listGoals(empNo, date);
    }
}
