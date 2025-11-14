package com.kh.team119.club.board.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Type {
    B("동호회 게시판")
    , C("동호회 댓글");

    private final String stringValue;
}
