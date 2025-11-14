package com.kh.team119.employee.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqChangePassword {
    private String prevPwd;
    private String newPwd;
}
