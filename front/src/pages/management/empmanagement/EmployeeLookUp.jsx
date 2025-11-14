import React, { use, useEffect, useRef, useState } from 'react';
import authFetch from '../../../utils/authFetch';
import { CircularProgress, Box, Pagination, Typography, Divider } from '@mui/material';
import CommonTable from '../../../components/commons/CommonTable';
import { useNavigate, useParams } from 'react-router-dom';
import { ROLE_COLOR } from '../../../define/RoleColor';

const EmployeeLookUp = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { page } = useParams();
  const navigate = useNavigate();
  const pageNum = Number(page) || 1;
  const totalPage = useRef(1);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    authFetch(`/management/api/employee/look-up/${pageNum}`)
      .then((data) => {
        if (!ignore) {
          if (!data.ok) throw new Error('직원 조회 실패');
          return data.json();
        }
      })
      .then((jsondata) => {
        if(!jsondata.success) throw new Error('직원 조회 실패');

        const data = jsondata.data;
          console.log(data);
        if (!ignore && data) {
          
          totalPage.current = data.totalPages;
          setRows(
            data.data.map((item) => ({
              eno: item.eno,
              name: item.name,
              department: item.department,
              position: positionMap[item.position] ?? item.position ?? '-',
              phone: item.phone,
              address: item.address,
              welfarePoints: Number(item.welfarePoints).toLocaleString(),
              // roles:
              //   Array.isArray(item.roles) && item.roles.length > 0
              //     ? item.roles.map((role) => ({
              //         label: role,
              //         color: ROLE_COLOR[role] ?? 'primary',
              //       }))
              //     : [{ label: '없음', color: 'default' }],
              // tags: 
              // Array.isArray(item.tags) && item.tags.length > 0
              //   ? item.tags.map((tag) => ({
              //       label: tag,
              //       color: 'secondary',
              //     }))
              //   : [{ label: '없음', color: 'default' }],
            }))
          );
        }
      })
      .catch((err) => {
        if (!ignore) setRows([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [pageNum]);

  const handleChangePage = (event, value) => {
    if (pageNum == value) return;
    navigate(`/management/employee/lookup/${value}`);
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 2, userSelect: 'none' }}>
      <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>직원 목록 조회</Typography>
      <Divider />
      <Box sx={{ width: '100%', height: 'calc(100% - 130px)', display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
        <CommonTable
          tableHeader={tableHeader}
          rows={rows}
          getRowLink={(row) => `/management/employee/lookat/${row.eno}`}
        />
        <Pagination
          count={totalPage.current}
          page={pageNum}
          onChange={handleChangePage}
          size="small"
          sx={{ display: 'flex', justifyContent: 'center', my: 2 }}
          showFirstButton
          showLastButton
          variant="outlined"
          color="primary"
          shape="rounded"
          siblingCount={2} // 모든 페이지 버튼 노출
          boundaryCount={0} // 모든 페이지 버튼 노출
        />
      </Box>
    </Box>
  );
};

const tableHeader = [
  { header: '사번', field: 'eno' },
  { header: '이름', field: 'name' },
  { header: '부서', field: 'department' },
  { header: '직급', field: 'position' },
  { header: '전화번호', field: 'phone' },
  { header: '주소', field: 'address' },
  { header: '복지포인트', field: 'welfarePoints' },
  // { header: '권한', field: 'roles', type: 'chips' },
  // { header: '태그', field: 'tags', type: 'chips' },
];

const positionMap = {
    Employee: '사원',
    Associate: '주임',
    AssistantManager: '대리',
    Manager: '과장',
    SeniorManager: '차장',
    DepartmentHead: '부장',
    Director: '임원',
    ChiefExecutiveOfficer: 'CEO',
    Chairman: '회장'
};

export default EmployeeLookUp;
