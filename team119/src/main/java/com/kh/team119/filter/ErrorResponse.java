package com.kh.team119.filter;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
    private String errorMsg;
}