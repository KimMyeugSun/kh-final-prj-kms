package com.kh.team119.notification.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WelfarePointPacket {
    private Long eno;
    private Long welfarePoints;
}
