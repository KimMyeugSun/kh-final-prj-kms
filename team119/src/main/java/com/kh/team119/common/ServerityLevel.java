package com.kh.team119.common;

/**
 * 심각도 수준을 나타내는 열거형
 */
public enum ServerityLevel {
    None("없음")
    ,VeryLow("매우낮음")
    ,Low("낮음")
    ,Moderate("보통")
    ,High("높음")
    ,VeryHigh("매우높음")
    ;

    private final String desc;

    ServerityLevel(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
