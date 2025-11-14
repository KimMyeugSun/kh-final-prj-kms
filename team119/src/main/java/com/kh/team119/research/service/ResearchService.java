package com.kh.team119.research.service;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.research.dto.ResearchReqDto;
import com.kh.team119.research.dto.ResearchRespDto;
import com.kh.team119.research.entity.*;
import com.kh.team119.research.enums.ResearchCategory;
import com.kh.team119.research.repository.ResearchRepository;
import com.kh.team119.research.repository.option.OptionRepository;
import com.kh.team119.research.repository.question.QuestionRepository;
import com.kh.team119.research.repository.result.ResultRepository;
import com.kh.team119.tag.TagType;
import com.kh.team119.tag.entity.EmpTagEntity;
import com.kh.team119.tag.repository.EmpTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static java.util.Arrays.stream;

@Service
@Transactional
@RequiredArgsConstructor
public class ResearchService {

    private final ResearchRepository researchRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final ResultRepository resultRepository;
    private final EmployeeRepository employeeRepository;
    private final EmpTagRepository empTagRepository;

    public ResearchRespDto.LookUpRespDto researchLookUp(String category) {
        List<ResearchEntity> researchEntity = researchRepository.LookUp(category);
        List<String> labels = stream(ResearchCategory.values())
                .map(ResearchCategory::getLabel).toList();
        if (researchEntity.isEmpty()){
            //에러코드 수정필요 , 등록된 리서치가 없음
            throw new Team119Exception(ErrorCode.NOT_FOUND_CLUB_BOARD);
        }
        List<ResearchRespDto.LookUpRespDto.LookUpInnerRespDto> dataList = researchEntity.stream().map(ResearchRespDto.LookUpRespDto.LookUpInnerRespDto::from).toList();
        return ResearchRespDto.LookUpRespDto.from(labels,dataList);
    }

    public ResearchRespDto.LookAtRespDto researchLookAt(Long no) {
        ResearchEntity research = researchRepository.findById(no).get();
        List<QuestionEntity> questionEntities = questionRepository.findByResearch(no);
        List<Long> qnoList = questionEntities.stream().map(QuestionEntity::getQno).toList();
        List<QuestionOptionEntity> optionEntities = optionRepository.findAllByQno(qnoList);
        List<ResearchRespDto.LookAtRespDto.QuestionRespDto> questionList = questionEntities.stream().map(ResearchRespDto.LookAtRespDto.QuestionRespDto::fromQuestion).toList();
        List<ResearchRespDto.LookAtRespDto.OptionRespDto> optionList = optionEntities.stream().map(ResearchRespDto.LookAtRespDto.OptionRespDto::fromOption).toList();
        return ResearchRespDto.LookAtRespDto.builder()
                .title(research.getTitle())
                .no(research.getNo())
                .description(research.getDescription())
                .topic(research.getTopic())
                .questionList(questionList)
                .optionList(optionList)
                .build();
    }

    public ResearchRespDto.SubmitRespDto submit(Long researchNo, ResearchReqDto.SubmitReqDto req) {
        ResearchEntity research = researchRepository.findById(researchNo).get();
        EmployeeEntity employee = employeeRepository.findByEno(req.getEno());

        int lastAttempt = resultRepository.findMaxAttemptNoByResearchNoAndEno(researchNo, req.getEno());
        int attemptNo = (lastAttempt == 0 ? 1 : lastAttempt + 1);

        String result = summarize(req.getTotalScore(), req.getTopic());

        String summary = result.split("/")[0];
        String respSummary = result.split("/")[1];
        TagType tagType = TagType.valueOf(summary);

        // 사원에게 tag 저장
        upsertEmpTag(req.getEno(), employee, tagType, req.getTopic());

        // 결과 테이블에 저장
        ResultEntity saved = resultRepository.save(ResultEntity.builder()
                .employee(employee)
                .research(research)
                .attemptNo(attemptNo)
                .score(req.getTotalScore())
                .summary(summary)
                .build());

        return ResearchRespDto.SubmitRespDto.builder()
                .resultNo(saved.getNo())
                .attemptNo(saved.getAttemptNo())
                .totalScore(saved.getScore())
                .summary(respSummary)
                .build();
    }
    // 점수 값에 따른 결과 도출을 위한 메서드
    private String summarize(int totalScore, String topic){
        List<String> tagNameList = getTagNameList(topic).stream().map(TagType::name).toList();
        String summary = "";
        String name = "";
        if (totalScore >= 0 && totalScore <= 54){
            summary = tagNameList.get(2);
            name = TagType.valueOf(summary).getDesc();
        } else if (totalScore >= 55 && totalScore <= 84) {
            summary = tagNameList.get(1);
            name = TagType.valueOf(summary).getDesc();
        }else if (totalScore >= 85 && totalScore <= 100){
            summary = tagNameList.get(0);
            name = TagType.valueOf(summary).getDesc();
        }else {
            // 에러코드 수정 필요 ()
            throw new Team119Exception(ErrorCode.NOT_FOUND_CLUB_BOARD);
        }
        return summary + "/" + name;
    }

    // 리서치의 주제에 알맞는 TagTypeList 추출 메서드
    private static List<TagType> getTagNameList(String topic) {
        return stream(TagType.values())
                .filter(tagType -> tagType.name().split("__")[0].equals(topic))
                .toList();
    }
    // 사원의 기존 topic에 따른 tag 수정 또는 생성 메서드
    private void upsertEmpTag(Long eno, EmployeeEntity employee, TagType newTag, String topic) {

        if (empTagRepository.existsByTagAndEno(newTag, eno)) return;

        // 같은 topic 태그 제거
        empTagRepository.deleteByEmployeeAndTopic(eno, topic);
        //새 태그 저장
        EmpTagEntity e = EmpTagEntity.builder().tag(newTag).build();
        employee.addTag(e);
        empTagRepository.save(e);
    }

}


