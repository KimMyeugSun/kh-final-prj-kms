package com.kh.team119.club.board.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Status {

    NE("정상"),
    DA("관리자 삭제"),
    WD("작성자 삭제");

    private final String stringValue;
}
