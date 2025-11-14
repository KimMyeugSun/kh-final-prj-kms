import React from 'react';
import Profile from '../../../../components/Profile';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { makeImgProfileUrl } from '../../../../utils/makeUrl';
import { ROLE_COLOR } from '../../../../define/RoleColor';

/**
 * 직원 기본 정보 컴포넌트
 * @param {object} data 직원 기본 정보
 * @param {string[]} grantedRoles 부여된 권한 목록
 * @param {function} onRoleEdit 권한 수정 클릭 핸들러
 * @returns 
 */
const BasicInfo = ({data, grantedRoles, onRoleEdit}) => {

  console.log(data);
  
  return (
    <>
      <Profile url={makeImgProfileUrl(data.empProfileName)} name={data.empName} w={150} h={150} fs={75} />

      <Box sx={{ ml: 4, flex: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, mr: 1 }} display={'inline'} >
          '{data.empName}'
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold', mb: 2 }} display={'inline'} >
          {data.empDepartment}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }} display={'inline'} >
          {data.empPosition}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold', mb: 2 }} >
          복지포인트: {Number(data.welfarePoints).toLocaleString() || 0}점
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {Array.isArray(grantedRoles) && grantedRoles.length > 0 ? (
              grantedRoles.map((role, index) => (
                <Chip
                  key={index}
                  label={role}
                  color={ROLE_COLOR[role] || 'default'}
                  size="small"
                />
              ))
            ) : (
              <Chip label="없음" color="default" size="small" />
            )}
          </Stack>
          <Button size="small" sx={{ ml: 1, minWidth: 32 }} onClick={onRoleEdit} aria-label="권한 수정" >
            <EditOutlinedIcon fontSize="small" />
          </Button>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {Array.isArray(data.tag) && data.tag.length > 0 ? (
            data.tag.map((tag, index) => (
              <Chip key={index} label={tag} color="info" size="small" variant="outlined" />
            ))
          ) : (
            <Chip label="없음" color="default" size="small" />
          )}
        </Stack>
      </Box>
    </>
  );
};

export default BasicInfo;