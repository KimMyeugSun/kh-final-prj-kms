package com.kh.team119.dailygoal.service;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.dailygoal.dto.DailyGoalDto;
import com.kh.team119.dailygoal.entity.DailyGoalEntity;
import com.kh.team119.dailygoal.repository.DailyGoalRepository;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyGoalService {

    private final DailyGoalRepository repo;
    private final EmployeeRepository empRepo;

    @Transactional
    public void toggleGoal(DailyGoalDto req) {
        EmployeeEntity emp = empRepo.findById(req.getEmpNo())
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT));

        DailyGoalEntity goal = repo.findByEmployee_EnoAndGoalDateAndItemId(
                        req.getEmpNo(), req.getGoalDate(), req.getItemId())
                .orElse(req.toEntity(emp));

        goal.setDoneYn(req.isDone() ? "Y" : "N");
        goal.setItemText(req.getItemText()); // 혹시 이름 바뀔 경우 갱신
        goal.setUpdatedAt(LocalDateTime.now());

        repo.save(goal);
    }

    public List<DailyGoalDto> listGoals(Long empNo, LocalDate date) {
        return repo.findByEmployee_EnoAndGoalDate(empNo, date)
                .stream()
                .map(DailyGoalDto::fromEntity)
                .toList();
    }
}
