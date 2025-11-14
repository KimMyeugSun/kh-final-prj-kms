package com.kh.team119.banner.dto;

import com.kh.team119.challenge.entity.ChallengeEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.Resource;

@Getter
@Setter
@Builder
public class RespBanner {
    private String bannerImageUrl;  //!< 배너 이미지 URL
    private String bannerLink;      //!< 배너 클릭 시 이동할 링크

    public static RespBanner from(String imgUrl, String link) {
        return RespBanner.builder()
                .bannerImageUrl(imgUrl)
                .bannerLink(link)
                .build();
    }
}
