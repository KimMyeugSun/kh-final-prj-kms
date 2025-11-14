package com.kh.team119.meal.service;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.dailygoal.repository.DailyGoalRepository;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.food.entity.FoodCatalogEntity;
import com.kh.team119.food.repository.FoodCatalogRepository;
import com.kh.team119.meal.dto.MealDtos;
import com.kh.team119.meal.entity.*;
import com.kh.team119.meal.repository.MealEntryRepository;
import com.kh.team119.meal.repository.MealFoodItemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealEntryRepository mealEntryRepo;
    private final EmployeeRepository employeeRepo;
    private final FoodCatalogRepository foodRepo;
    private final MealFoodItemRepository mealFoodItemRepo;
    private final DailyGoalRepository dailyGoalRepo;

    /**
     * 식사 등록 (항목 함께 저장 & 총칼로리 합산)
     */
    public MealDtos.Resp create(MealDtos.CreateReq req) {
        EmployeeEntity emp = employeeRepo.findById(req.getEmployeeNo())
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT));

        MealEntryEntity entry = MealEntryEntity.builder()
                .employee(emp)
                .mealType(req.getMealType())
                .eatDate(req.getEatDate())
                .imageUrl(req.getImageUrl())
                .memo(req.getMemo())
                .doneYn(YesNo.Y)
                .createdAt(LocalDateTime.now())
                .totalKcal(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        if (req.getItems() != null) {
            for (MealDtos.ItemReq it : req.getItems()) {
                FoodCatalogEntity food = foodRepo.findById(it.getFoodNo())
                        .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_FOOD));

                MealFoodItemEntity item = MealFoodItemEntity.builder()
                        .meal(entry)
                        .food(food)
                        .servings(it.getServings())
                        .memo(it.getMemo())
                        .createdAt(LocalDateTime.now())
                        .build();

                entry.getItems().add(item);

                // kcal 합계 = food.kcal * servings
                if (food.getKcal() != null && it.getServings() != null) {
                    total = total.add(food.getKcal().multiply(it.getServings()));
                }
            }
        }

        entry.setTotalKcal(total);

        return MealDtos.Resp.from(mealEntryRepo.save(entry));
    }

    /**
     * 단건 조회
     */
    public MealDtos.Resp get(Long mealNo) {
        MealEntryEntity e = mealEntryRepo.findById(mealNo)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_MEAL));
        return MealDtos.Resp.from(e);
    }

    /**
     * 직원 기간별 목록
     */
    @Transactional(value = Transactional.TxType.SUPPORTS) // 읽기 트랜잭션
    public List<MealDtos.Resp> listByEmployee(Long employeeNo, LocalDate from, LocalDate to) {
        // N+1 제거된 fetch join 메서드로 교체
        return mealEntryRepo
                .findWithItemsAndFoodByEmployeeAndEatDateBetween(employeeNo, from, to)
                .stream().map(MealDtos.Resp::from).toList();
    }

    @Transactional(value = Transactional.TxType.SUPPORTS)
    public List<MealDtos.Resp> listByDate(Long empNo, LocalDate date) {
        // N+1 제거된 fetch join 메서드로 교체
        return mealEntryRepo
                .findWithItemsAndFoodByEmployeeAndEatDate(empNo, date)
                .stream().map(MealDtos.Resp::from).toList();
    }


    @Transactional
    public void deleteItem(Long itemNo) {
        MealFoodItemEntity item = mealFoodItemRepo.findById(itemNo)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_MEAL_ITEM));

        MealEntryEntity meal = item.getMeal();

        // DailyGoal 정리 (여기는 기존 로직 유지)
        dailyGoalRepo.deleteByEmployee_EnoAndGoalDateAndItemId(
                meal.getEmployee().getEno(),
                meal.getEatDate(),
                item.getFood().getName()
        );

        // ✅ 컬렉션에서만 제거 (orphanRemoval=true 가 실제 DELETE 수행)
        meal.getItems().remove(item);

        // ❌ 중복 삭제 금지
        // mealFoodItemRepo.delete(item);

        // ✅ 총칼로리 재계산 (null-safe)
        BigDecimal newTotal = meal.getItems().stream()
                .map(it -> (it.getFood().getKcal() == null ? BigDecimal.ZERO : it.getFood().getKcal())
                        .multiply(it.getServings() == null ? BigDecimal.ZERO : it.getServings()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        meal.setTotalKcal(newTotal);
        // mealEntryRepo.save(meal);  // 트랜잭션 컨텍스트에서 변경감지로 자동 flush
    }


    @Transactional
    public MealDtos.Resp update(Long mealNo, MealDtos.UpdateReq req) {
        MealEntryEntity meal = mealEntryRepo.findById(mealNo)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_MEAL));

        // 이미지/메모만 수정 (필요에 따라 확장 가능)
        if (req.getImageUrl() != null) {
            meal.setImageUrl(req.getImageUrl());
        }
        meal.setMemo(req.getMemo());
        meal.setUpdatedAt(LocalDateTime.now());

        return MealDtos.Resp.from(mealEntryRepo.save(meal));
    }


}
