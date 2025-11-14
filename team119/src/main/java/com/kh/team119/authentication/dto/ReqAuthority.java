package com.kh.team119.authentication.dto;

import com.kh.team119.roletype.RoleType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ReqAuthority {
    private Long eno;
    private List<RoleType> roles;
}
