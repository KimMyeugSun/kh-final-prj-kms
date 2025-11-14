package com.kh.team119.common.exception;

import lombok.Getter;

@Getter
public class Team119Exception extends RuntimeException {
    private final ErrorCode errorCode;

    public Team119Exception(ErrorCode errorCode) {
        super(errorCode.toString());
        this.errorCode = errorCode;
    }
}