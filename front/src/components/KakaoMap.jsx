import React, { useEffect, useMemo, useRef, useState } from 'react';
import { searchPlaces } from '../service/kakaoService';

export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY;
// const radius = 0.2;

export default function KakaoMap({ selectedFilters, radiusValue = 200 }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [markers, setMarkers] = useState([]); // 마커 배열
  const currentMarkerRef = useRef(null); // (사용자 위치용) 이전 구현 유지
  const accuracyCircleRef = useRef(null);
  const watchIdRef = useRef(null);
  const infoWindowRef = useRef(null);

  const selectedMarkerRef = useRef(null);
  const MarkersRef = useRef([]); // 병원 마커들 (clear 용)
  const mapClickListenerRef = useRef(null);
  const ImageCacheRef = useRef(new Map());
  const allItemsRef = useRef([]); // 전체 데이터 (필터링용)
  const radiusRef = useRef(Number(radiusValue)); // km 단위로 보관
  const selectedFiltersRef = useRef(Array.isArray(selectedFilters) ? selectedFilters : []);

  // 원(검색 반경) 레퍼런스
  const searchCircleRef = useRef(null);

  useEffect(() => {
    if (!KAKAO_KEY) {
      console.warn('VITE_KAKAO_JS_KEY not set');
      return;
    }
    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(initMap);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      if (currentMarkerRef.current) currentMarkerRef.current.setMap(null);
      if (accuracyCircleRef.current) accuracyCircleRef.current.setMap(null);
      if (searchCircleRef.current) searchCircleRef.current.setMap(null);
      if (selectedMarkerRef.current) selectedMarkerRef.current.setMap(null);
      MarkersRef.current.forEach((m) => m.setMap(null));
      MarkersRef.current = [];
      if (watchIdRef.current && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (mapClickListenerRef.current && window.kakao && window.kakao.maps) {
        window.kakao.maps.event.removeListener(mapClickListenerRef.current);
        mapClickListenerRef.current = null;
      }
    };
  }, []);

  const initMap = () => {
    const options = {
      center: new window.kakao.maps.LatLng(37.499, 127.0328), //!< 학원
      level: 4,
    };
    mapRef.current = new window.kakao.maps.Map(containerRef.current, options);

    // 지도 클릭으로 선택 위치 지정 + 검색(반경 radiusValue 200m)
    const clickHandler = (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lon = latlng.getLng();

      // 선택 마커 갱신
      if (selectedMarkerRef.current) selectedMarkerRef.current.setMap(null);
      selectedMarkerRef.current = new window.kakao.maps.Marker({
        position: latlng,
        map: mapRef.current,
        title: '선택한 위치',
      });

      mapRef.current.setCenter(latlng);

      // 선택한 위치를 중심으로 radius 원 그리기
      drawRadiusCircle(lat, lon,  radiusRef.current);
      // 중심 이동 및 반경 원 그리기 후 데이터 조회
      fetchMapData(lon, lat);
    };

    mapClickListenerRef.current = window.kakao.maps.event.addListener(
      mapRef.current,
      'click',
      clickHandler
    );
  };

  const clearMarkers = () => {
    // 기존 마커 제거
    MarkersRef.current.forEach((m) => m.setMap(null));
    MarkersRef.current = [];
    setMarkers([]);
    // close infoWindow
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  };

  const getMarkerImage = (color) => {
    if (!window.kakao) return null;
    if (ImageCacheRef.current.has(color)) return ImageCacheRef.current.get(color);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <circle cx="12" cy="12" r="9" fill="${color}" stroke="#ffffff" stroke-width="2"/>
    </svg>`;
    const url = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    const image = new window.kakao.maps.MarkerImage(
      url,
      new window.kakao.maps.Size(24, 24),
      { offset: new window.kakao.maps.Point(12, 12) }
    );
    ImageCacheRef.current.set(color, image);
    return image;
  };

  const getInfoWindow = () => {
    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.kakao.maps.InfoWindow({ yAnchor: 1 });
    }
    return infoWindowRef.current;
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000; // meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
 
  const renderMarkers = (centerLat, centerLon, radiusMeter) => {
    if (!mapRef.current) return;
    
    MarkersRef.current.forEach((m) => m.setMap(null));
    MarkersRef.current = [];

    const source = Array.isArray(allItemsRef.current) ? allItemsRef.current : [];
    const radiusM = Math.round(Number(radiusMeter));
    const newMarkers = [];
    source.forEach((doc) => {
      const latVal = doc.wgs84lat;
      const lonVal = doc.wgs84lon;

      if (latVal == null || lonVal == null) return;
      const lat = Number(latVal);
      const lon = Number(lonVal);
      if (Number.isNaN(lat) || Number.isNaN(lon)) return;
      const dist = haversineDistance(centerLat, centerLon, lat, lon);
      if (dist > radiusM) return;
      const p = new window.kakao.maps.LatLng(lat, lon);
      const matchedFilter = Array.isArray(selectedFiltersRef.current)
        ? selectedFiltersRef.current.find((f) => f.value == doc.dutyDiv)
        : undefined;
      const color = matchedFilter ? matchedFilter.color : 'gray';
      const markerImage = getMarkerImage(color);
      const marker = new window.kakao.maps.Marker({
        position: p,
        map: mapRef.current,
        title: doc.dutyName || '',
        image: markerImage,
      });
      
      const name = doc.dutyName || '';
      const tel = doc.dutyTel1 || '';
      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        const iw = getInfoWindow();
        iw.setContent(
          `<div style="padding:4px 6px;font-size:12px;">${escapeHtml(name)}</div>
          <div style="padding:4px 6px;font-size:12px;">전화: ${escapeHtml(tel)}</div>`
        );
        iw.open(mapRef.current, marker);
      });
      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        const iw = getInfoWindow();
        iw.close();
      });
      MarkersRef.current.push(marker);
      newMarkers.push(marker);
    });
    setMarkers(newMarkers);
  };

  //!< 일단 1km 고정 (벼경은 필터 or 중심 변경시)
  const fetchMapData = async (lon, lat, radiusKm = 1) => {
    if (!mapRef.current) {
      alert('지도가 준비되지 않았습니다.');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set('lon', String(lon));
      params.set('lat', String(lat));
      params.set('radius', String(radiusKm));
      //!< 필터링은 받아온 값에서 출력할 때 처리

      const res = await fetch(`${API_BASE}/api/public/map-info?${params.toString()}`);
      if (!res.ok) throw new Error('병원 API 호출 실패');

      const json = await res.json();
      const items = Array.isArray(json?.data?.maps) ? json.data.maps : [];

      allItemsRef.current = items || [];

      clearMarkers();
      
      const center = selectedMarkerRef.current
        ? selectedMarkerRef.current.getPosition()
        : mapRef.current.getCenter();
      renderMarkers(center.getLat(), center.getLng(), radiusRef.current);

    } catch (err) {
      console.error(err);
      alert('병원 검색 중 오류가 발생했습니다.');
    }
  };

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (s) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[s];
    });
  };

  const doSearch = async () => {
    try {
      const data = await searchPlaces('카페'); // 예시: '카페'
      clearMarkers();
      const newMarkers = (data.documents || []).map((doc) => {
        const pos = new window.kakao.maps.LatLng(
          parseFloat(doc.y),
          parseFloat(doc.x)
        );
        const marker = new window.kakao.maps.Marker({ position: pos });
        marker.setMap(mapRef.current);
        return marker;
      });
      setMarkers(newMarkers);
      if (newMarkers.length) {
        mapRef.current.setCenter(newMarkers[0].getPosition());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filterKey = useMemo(
    () => (Array.isArray(selectedFilters) ? selectedFilters.map(f => f.value).join(',') : ''),
    [selectedFilters]
  );

  const drawRadiusCircle = (lat, lon, radiusMeter = 200) => {
    
    if (!window.kakao || !mapRef.current) return;
    // 기존 원 제거
    if (searchCircleRef.current) {
      searchCircleRef.current.setMap(null);
      searchCircleRef.current = null;
    }

    const circleOptions = {
      center: new window.kakao.maps.LatLng(lat, lon),
      radius: Math.round(radiusMeter), // km -> m
      strokeWeight: 2,
      strokeColor: '#1976d2',
      strokeOpacity: 0.6,
      strokeStyle: 'solid',
      fillColor: '#1976d2',
      fillOpacity: 0.12,
    };

    const circle = new window.kakao.maps.Circle(circleOptions);
    circle.setMap(mapRef.current);
    searchCircleRef.current = circle;
  };

  useEffect(() => {
    selectedFiltersRef.current = Array.isArray(selectedFilters) ? selectedFilters : [];
  }, [selectedFilters]);

  useEffect(() => {
    if (!mapRef.current) return;
    const center = selectedMarkerRef.current
      ? selectedMarkerRef.current.getPosition()
      : mapRef.current.getCenter();
      
    renderMarkers(center.getLat(), center.getLng(), radiusRef.current);
  }, [filterKey]);

  useEffect(() => {
    if (!mapRef.current) return;
    const center = selectedMarkerRef.current
      ? selectedMarkerRef.current.getPosition()
      : mapRef.current.getCenter();
      radiusRef.current = Number(radiusValue);
      renderMarkers(center.getLat(), center.getLng(), radiusRef.current);
      drawRadiusCircle(center.getLat(), center.getLng(), radiusRef.current);
  }, [radiusValue]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <div style={{ width: '100%', height: '400px' }} ref={containerRef} />
    </div>
  );
}