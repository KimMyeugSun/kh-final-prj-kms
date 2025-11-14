package com.kh.team119.calendar.controller;

import com.kh.team119.calendar.dto.CalendarDtos;
import com.kh.team119.calendar.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarApiController {

    private final CalendarService service;

    @GetMapping("/events")
    public List<CalendarDtos.Event> listEvents(@RequestParam Long empNo,
                                               @RequestParam LocalDate from,
                                               @RequestParam LocalDate to) {
        return service.listEvents(empNo, from, to);
    }

    @GetMapping("/meals/detail")
    public CalendarDtos.MealDetailResp mealDetail(@RequestParam Long empNo,
                                                  @RequestParam LocalDate date) {
        return service.getMealDetail(empNo, date);
    }

    @GetMapping("/workouts/detail")
    public CalendarDtos.WorkoutDetail workoutDetail(@RequestParam Long empNo,
                                                    @RequestParam LocalDate date) {
        return service.getWorkoutDetail(empNo, date);
    }
}
