package com.kh.team119.mapinfo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RespMap {
    private List<MapVo> maps;

    public static RespMap from(List<MapVo> vo) {
        RespMap respMap = new RespMap();
        respMap.setMaps(vo);
        return respMap;
    }
}
