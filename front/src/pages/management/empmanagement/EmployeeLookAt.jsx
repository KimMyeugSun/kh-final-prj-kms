import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
  Divider,
} from '@mui/material';
import { useAuth } from '../../../auth/useAuth';
import RoleList from './components/RoleList';
import EditButtonGroup from './components/EditButtonGroup';
import BasicInfo from './components/BasicInfo';
import authFetch from '../../../utils/authFetch';
import SearchBar from '../../../components/commons/SearchBar';
import CommonTable from '../../../components/commons/CommonTable';
import CommonPagination from '../../../components/commons/Pagination';
import { DateFormat } from '../../../define/DateFormat';
import { colors } from '../../../define/styles/Color';
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');


const EmployeeLookAt = () => {
  const { getRoles } = useAuth();
  const { eno } = useParams();
  const [data, setData] = useState({});
  const [currRoles, setCurrRoles] = useState(getRoles());
  const [roles, setRoles] = useState([]);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedGranted, setSelectedGranted] = useState([]);
  const [grantedRoles, setGrantedRoles] = useState([]);
  const [pendingRoles, setPendingRoles] = useState([]);
  const [showAlertMsg, setShowAlertMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    total: 0,
    currentPage: 1,
    pageSize: 5,
  });

  useEffect(() => {
    setCurrRoles(getRoles());
  }, []);

  useEffect(() => {
    setPage(1);
    setLoading(true);
    (async () => {
      try {
        const response = await fetch(`${API_BASE}/api/public/role/look-up`);
        if (!response.ok) throw new Error('역할 조회 실패');
        const jsondata = await response.json();
        const data = jsondata?.data;
        if (!data) throw new Error('역할 데이터 없음');
        setRoles(data); // 전체 권한 목록
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await authFetch(
          `/management/api/employee/look-at/${eno}`
        );
        if (!response.ok) throw new Error('직원 상세 조회 실패');
        const jsondata = await response.json();
        if(!jsondata.success) throw new Error(jsondata.msg || '직원 상세 조회 실패');
        if(!jsondata.data) throw new Error('직원 상세 조회 실패');

        setData(jsondata.data);
        setGrantedRoles(jsondata.data.roles || []);
      } catch (error) {
        console.error(error);
      } finally { setLoading(false); }
    })();
  }, [eno]);

  useEffect(() => {
    if(page < 1) return;
    const pageIndex = page ? parseInt(page, 10) - 1 : 0;
    const params = new URLSearchParams();
    params.set('page', pageIndex);
    params.set('size', pagination.pageSize);

    const url = `/management/welfare-point-record/${eno}?${params.toString()}`;

    (async () => {
      try {
        setShowAlertMsg(null);
        const resp = await authFetch(url);
        if (!resp.ok) throw new Error('복지 포인트 내역 조회에 실패했습니다.');
        const json = await resp.json();
        const { records, pagination: pg } = normalize(json);
        setRows(records);
        setPagination(pg);
      } catch (e) {
        console.error(e);
        setRows([]);
        setPagination({
          totalPages: 0,
          total: 0,
          currentPage: 1,
          pageSize: 10,
        });
        setShowAlertMsg({ type: 'error', message: '복지 포인트 내역 조회 중 오류가 발생했습니다.' });
      }
    })();
  }, [page]);

  // 권한 편집 다이얼로그 열기
  const onRoleEdit = (e) => {
    e.stopPropagation();

    if (!currRoles.includes('ADMIN')) {
      setShowAlertMsg({ type: 'error', message: '관리자만 편집 가능합니다.' });
      return;
    }

    setRoleDialogOpen(true);
    setSelectedAvailable([]);
    setSelectedGranted([]);
    setPendingRoles(grantedRoles); // 현재 권한 복사
  };

  // 권한 이동 (pendingRoles에만 반영)
  const handleGrant = () => {
    setPendingRoles((prev) => [
      ...prev,
      ...selectedAvailable.filter((r) => !prev.includes(r)),
    ]);
    setSelectedAvailable([]);
  };
  const handleRevoke = () => {
    setPendingRoles((prev) => prev.filter((r) => !selectedGranted.includes(r)));
    setSelectedGranted([]);
  };

  // 다이얼로그 닫기
  const handleDialogClose = () => {
    setRoleDialogOpen(false);
  };

  // 전체 권한 목록에서 부여되지 않은 권한만 추출
  const availableRoles = roles.filter((r) => !pendingRoles.includes(r));

  // 적용 버튼 클릭 시 실제 권한 반영
  const handleApplyRoles = () => {

    const reqData = {
      eno: data.eno,
      roles: pendingRoles,
    }

    authFetch(`/management/api/authority`, {
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqData),
    })
    .then(response => {
      if (!response.ok) throw new Error('권한 변경 실패');
      return response.json();
    })
    .then(jsondata => {
      const data = jsondata?.data;
      if (!data) throw new Error('권한 변경 실패');

      setShowAlertMsg({ type: 'success', message: '권한이 성공적으로 변경되었습니다.' });
      const newGranted = Array.isArray(data.roles) ? [...data.roles] : [...pendingRoles];
      setGrantedRoles(newGranted);
      setPendingRoles(newGranted);
    })
    .catch(error => {
      setShowAlertMsg({ type: 'error', message: error.message });
    })
    .finally(() => {
      setRoleDialogOpen(false);
    });
  };

  const handleChangePage = (_e, value) => {
    if (pagination.currentPage === value) return;
    setPage(value);
    //navigate(`/mypage/welfare-point/${value}`);
  };

  const handleSearch = (q) => {
    setPage(1);
    setKeyword(q.trim());
    //navigate(`/mypage/welfare-point/1`);
  };

  const tableRows = useMemo(
    () =>
      rows.map((row, index) => {
        const amt = Number(row.amount ?? 0);
        const when = row.occurrenceAt ? new Date(row.occurrenceAt) : null;
        return {
          no: (pagination.currentPage - 1) * pagination.pageSize + (index + 1),
          occurrenceAt: when ? DateFormat(when, 'yyyy-MM-dd hh:mm:ss') : '',
          occurrenceType: row.strOccurrenceType ?? row.occurrenceType ?? '',
          beforePoint: Number(row.beforeValue ?? 0).toLocaleString(),
          amount: (
            <span
              style={{
                color: amt < 0 ? colors.red[500] : colors.green[600],
                fontWeight: 'bold',
              }}
            >
              {amt.toLocaleString()}
            </span>
          ),
          afterPoint: Number(row.afterValue ?? 0).toLocaleString(),
          description: row.description ?? '',
        };
      }),
    [rows, pagination]
  );

  const hasData = rows.length > 0;

  const renderNoneRecord = () => {
    return (
      <Box
        sx={{
          padding: '40px 0',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 600,
        color: '#666',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: '16px',
        backgroundColor: '#fafafa',
      }}
    >
      조회된 이력이 없습니다.
    </Box>
    );
  };

  const renderRecords = () => {
    return (
      <>
        {/* <SearchBar onSearch={handleSearch} placeholder="이력 상세 검색" mb={2} /> */}
        <Typography sx={{ fontWeight: 700, fontSize: '1.2em' }} gutterBottom>복지포인트 이력</Typography>
        <CommonTable tableHeader={tableHeader} rows={tableRows} />
        <CommonPagination
        page={pagination.currentPage}
        count={pagination.totalPages}
        onChange={handleChangePage}
      />
    </>
    );
  };

  // 적용 버튼 활성화 여부 (순서 무관 비교로 변경)
  const isChanged = (() => {
    const a = grantedRoles || [];
    const b = pendingRoles || [];
    if (a.length !== b.length) return true;
    const setA = new Set(a);
    for (const v of b) if (!setA.has(v)) return true;
    return false;
  })();

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Box sx={{ display: 'flex', width: '100%', boxSizing: 'border-box', maxWidth: '100%', overflowX: 'hidden', alignItems: 'flex-start', justifyContent: 'flex-start', p: 6, userSelect: 'none' }} >
        <BasicInfo data={data} grantedRoles={grantedRoles} onRoleEdit={onRoleEdit} />

        <Dialog open={roleDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth sx={{userSelect:'none'}}>
          <DialogTitle>권한 편집</DialogTitle>
          <DialogContent sx={{ display: 'flex', gap: 2, minHeight: 300 }}>
            <RoleList title={'전체 권한'} fullList={availableRoles} selectedGranted={selectedAvailable} setSelectedGranted={setSelectedAvailable} />
            <EditButtonGroup handleGrant={handleGrant} handleRevoke={handleRevoke} isSelectedAvailable={selectedAvailable.length === 0} isSelectedGranted={selectedGranted.length === 0} />
            <RoleList title={'부여된 권한'} fullList={pendingRoles} selectedGranted={selectedGranted} setSelectedGranted={setSelectedGranted} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>닫기</Button>
            <Button variant="contained" color="primary" onClick={handleApplyRoles} disabled={!isChanged}>적용</Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box sx={{ p: 2, width: '70%', height: '100%', display: 'flex', flexDirection: 'column', gap: 1, userSelect: 'none'}}  >
        {renderRecords()}
      </Box>

      {showAlertMsg !== null && (
        <Alert severity={showAlertMsg.type} sx={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 1300 }} onClose={() => setShowAlertMsg(null)} >
          {showAlertMsg.message}
        </Alert>
      )}
      </Box>
  );
};

const normalize = (raw) => {
  const d = raw?.data ?? raw ?? {};
  const records = Array.isArray(d.records)
    ? d.records
    : Array.isArray(d.content)
    ? d.content
    : Array.isArray(d.items)
    ? d.items
    : [];
  const totalPages = d.totalPages ?? d.page?.totalPages ?? d.total_pages ?? 0;
  const total =
    d.total ?? d.totalElements ?? d.total_count ?? records.length ?? 0;
  const pageNo0 = d.currentPage ?? d.number ?? 0; // 0-based
  const pageSize = d.pageSize ?? d.size ?? d.per_page ?? 10;
  return {
    records,
    pagination: { totalPages, total, currentPage: pageNo0 + 1, pageSize },
  };
};

const tableHeader = [
  { header: '번호', field: 'no' },
  { header: '발생일시', field: 'occurrenceAt' },
  { header: '발생유형', field: 'occurrenceType' },
  { header: '이전 포인트', field: 'beforePoint' },
  { header: '변화 포인트', field: 'amount' },
  { header: '이후 포인트', field: 'afterPoint' },
  { header: '이력 상세', field: 'description' },
];

export default EmployeeLookAt;
