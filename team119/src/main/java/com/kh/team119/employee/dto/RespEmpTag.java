package com.kh.team119.employee.dto;

import com.kh.team119.tag.TagType;
import com.kh.team119.tag.entity.EmpTagEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
public class RespEmpTag {
    private List<TagType> tags;

    public static RespEmpTag from(Set<EmpTagEntity> tagEntities) {
        return RespEmpTag.builder()
                .tags(tagEntities.stream()
                        .map(EmpTagEntity::getTag)
                        .toList())
                .build();
    }
}
