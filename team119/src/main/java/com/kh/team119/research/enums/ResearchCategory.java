package com.kh.team119.research.enums;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
public enum ResearchCategory {

    LIFESTYLE("일상생활 리서치"),
    MENTAL("마음건강 리서치"),
    PHYSICAL("신체건강 리서치"),
    ETC("기타");

    private final String label;

}
