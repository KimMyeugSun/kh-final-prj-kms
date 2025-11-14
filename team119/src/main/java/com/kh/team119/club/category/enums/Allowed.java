package com.kh.team119.club.category.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Allowed {

    Y("승인 됨")
    , N("승인 안됨")
    , D("승인 대기");

    private final String stringValue;
}
