package com.kh.team119.meal.controller;

import com.kh.team119.common.FileController;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.meal.dto.MealDtos;
import com.kh.team119.meal.service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.kh.team119.common.exception.ErrorCode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealApiController {

    private final MealService service;
    private final FileController fileCtrl;

    @Value("${MEAL_STORAGE_PATH.IMG}")
    private String mealStoragePath;

    @PostMapping
    public MealDtos.Resp create(@RequestBody MealDtos.CreateReq req) {
        return service.create(req);
    }

    @GetMapping("/{mealNo}")
    public MealDtos.Resp get(@PathVariable Long mealNo) {
        return service.get(mealNo);
    }

    @GetMapping("/by-employee")
    public List<MealDtos.Resp> listByEmployee(@RequestParam Long empNo,
                                              @RequestParam LocalDate from,
                                              @RequestParam LocalDate to) {
        return service.listByEmployee(empNo, from, to);
    }

    @GetMapping
    public List<MealDtos.Resp> listByDate(@RequestParam Long empNo,
                                          @RequestParam LocalDate date) {
        return service.listByDate(empNo, date);
    }

    @DeleteMapping("/items/{itemNo}")
    public void deleteItem(@PathVariable Long itemNo) {
        service.deleteItem(itemNo);
    }

    // 업로드
    @PostMapping("/upload")
    public Map<String, String> upload(@RequestParam MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new Team119Exception(ErrorCode.FILE_EMPTY);
        }
        String fileName = fileCtrl.save(file, mealStoragePath);
        return Map.of("filePath", fileName);
    }

    // 수정
    @PutMapping("/{mealNo}")
    public MealDtos.Resp update(@PathVariable Long mealNo,
                                @RequestBody MealDtos.UpdateReq req) {
        return service.update(mealNo, req);
    }
}
