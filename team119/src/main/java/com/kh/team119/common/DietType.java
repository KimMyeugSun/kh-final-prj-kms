package com.kh.team119.common;

/**
 * 식단 유형을 나타내는 열거형
 */
public enum DietType {
    Balanced("균형")
    , HighCarb("고탄수화물")
    , HighProtein("고단백질")
    , Vegan("비건")
    ;

    private final String desc;

    DietType(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
