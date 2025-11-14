package com.kh.team119.tag.dto;

import com.kh.team119.tag.TagType;
import com.kh.team119.tag.entity.TagEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.List;

@Getter
@Setter
@Builder
public class RespTagLookUp {

    private List<String> tags;

    public static RespTagLookUp setup() {
        var list = Arrays.stream(TagType.values())
                .toList();

        return RespTagLookUp.builder()
                .tags(list.stream().map(TagType::getDesc).toList())
                .build();
    }


    public static RespTagLookUp tagNameLookUp() {
        List<TagType> tagList = List.of(TagType.values());
        return RespTagLookUp.builder()
                .tags(tagList.stream().map(TagType::getDesc).toList())
                .build();
    }
}
