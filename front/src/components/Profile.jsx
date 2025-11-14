import React from 'react';
import { Avatar } from '@mui/material';

/**
 * MUI 공용 프로필 이미지(단순히 이미표시에도 사용가능)
 * @param {string} url - 이미지 url
 * @param {string} name - 사용자 이름 (url이 없을 때 성명의 첫 글자를 표시)
 * @param {number} w - 이미지 너비
 * @param {number} h - 이미지 높이
 * @param {number} fs - 글꼴 크기
 * @param {string} fcolor - 글꼴 색상 (url이 없을 때 성명의 첫 글자 색상)
 * @param {function} onClick - 클릭 이벤트 핸들러
 * @returns 
 * 
 * 사용예시:
 * <Profile url="http://localhost:5555/cdn/profile/img/avatar.jpg" name="John Doe" w={150} h={150} fs={75} />
 */

const Profile = ({ url, name="default", w=32, h=32, fs=16, fcolor="#fff", onClick }) => {
  return (
    <>
      {url ? (
        <Avatar
          src={url}
          alt={name}
          sx={{
            width: w,
            height: h,
            border: '2px solid #ddd',
            fontSize: fs,
            cursor: onClick ? 'pointer' : 'default'
          }}
          onClick={onClick ? onClick : null}
          
        />
      ) : (
        <Avatar sx={{ width: w, height: h, fontSize: fs, color: fcolor, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick ? onClick : null} >
          {name?.charAt(0)?.toUpperCase()}
        </Avatar>
      )}
    </>
  );
};

export default Profile;
