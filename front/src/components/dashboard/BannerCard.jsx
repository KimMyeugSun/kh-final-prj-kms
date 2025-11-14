import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CardShell from './CardShell';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import authFetch from '../../utils/authFetch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';

/**
 * BannerCard component displays a carousel of banners.
 * @param {number} [w=596] 가로 길이
 * @param {number} [h=596] 세로 길이
 * @returns
 * 
 * @example
 * <BannerCard w={596} h={596} />
 */
export default function BannerCard({ w = 596, h = 596 }) {
  const [bannerList, setBannerList] = useState([]);
  const navigate = useNavigate();
  const { getEmpNo } = useAuth();

  useEffect(() => {
    authFetch(`/api/banners/${getEmpNo()}`)
      .then((res) => res.json())
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('배너 데이터 없음');

        setBannerList(data);
      });
  }, [getEmpNo()]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleBannerClick = (banner) => {
    navigate(banner.bannerLink);
  };

  return (
    <CardShell
      sx={{
        flex: 1,
        display: 'flex',
        width: '100%',
        height: '100%',
        maxWidth: w,
        maxHeight: h,
      }}
    >
      <Box
        sx={{
          flex: 1,
          border: (t) => `1px dashed ${t.palette.divider}`,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Slider {...settings} style={{ width: '100%', height: '100%' }}>
          {bannerList?.map((b, idx) => (
            <Box
              key={idx}
              component="img"
              src={b.bannerImageUrl}
              alt={`banner-${idx}`}
              onClick={() => handleBannerClick(b)}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 2,
                cursor: 'pointer',
              }}
            />
          ))}
        </Slider>
      </Box>
    </CardShell>
  );
}
