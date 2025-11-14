import React, { useEffect, useMemo, useState } from 'react';
import CommonTable from '../../components/commons/CommonTable';
import SearchBar from '../../components/commons/SearchBar';
import authFetch from '../../utils/authFetch';
import { useAuth } from '../../auth/useAuth';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import CommonPagination from '../../components/commons/Pagination';
import { DateFormat } from '../../define/DateFormat';
import { colors } from '../../define/styles/Color';
import { Box, Divider, Typography, Alert } from '@mui/material';

// --- API 응답 형태 정규화 ---
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

// --- 컴포넌트 ---
const WelfarePoint = () => {
  const { getEmpNo } = useAuth();
  const { page } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [keyword, setKeyword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const enoRaw = getEmpNo?.();
    const eno = Number(enoRaw);
    if (!enoRaw || Number.isNaN(eno) || eno <= 0) return;

    // URL 쿼리에서 keyword 추출
    const searchParams = new URLSearchParams(location.search);
    const kw = searchParams.get('keyword') ?? '';
    setKeyword(kw);

    const pageIndex = page ? parseInt(page, 10) - 1 : 0;
    const params = new URLSearchParams();
    params.set('page', pageIndex);
    params.set('size', '10');
    if (kw) params.set('keyword', kw);

    const url = `/api/welfare-point-record/${eno}?${params.toString()}`;

    (async () => {
      try {
        setErrMsg('');
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
        setErrMsg('복지 포인트 내역 조회 중 오류가 발생했습니다.');
      }
    })();
  }, [page, location.search, getEmpNo]);

  // 페이지 변경 시
  const handleChangePage = (_e, value) => {
    if (pagination.currentPage === value) return;

    const params = new URLSearchParams(location.search);
    const kw = params.get('keyword');
    const query = kw ? `?keyword=${encodeURIComponent(kw)}` : '';
    navigate(`/mypage/welfare-point/${value}${query}`);
  };

  // 검색 실행 시
  const handleSearch = (q) => {
    const trimmed = q.trim();
    const query = trimmed ? `?keyword=${encodeURIComponent(trimmed)}` : '';
    navigate(`/mypage/welfare-point/1${query}`);
  };

  // 테이블 렌더용 데이터 가공
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

  return (
    <Box sx={{ p: 2, userSelect: 'none' }}>
      <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>
        복지 포인트 이력
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <SearchBar
        onSearch={handleSearch}
        placeholder="이력 상세 검색"
        defaultValue={keyword}
      />
      <Box sx={{ mb: 2 }} />

      {errMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errMsg}
        </Alert>
      )}

      {!errMsg && !hasData ? (
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
      ) : null}

      {!errMsg && hasData && (
        <>
          <CommonTable tableHeader={tableHeader} rows={tableRows} />
          <CommonPagination
            page={pagination.currentPage}
            count={pagination.totalPages}
            onChange={handleChangePage}
          />
        </>
      )}
    </Box>
  );
};

// --- 테이블 헤더 정의 ---
const tableHeader = [
  { header: '번호', field: 'no' },
  { header: '발생일시', field: 'occurrenceAt' },
  { header: '발생유형', field: 'occurrenceType' },
  { header: '이전 포인트', field: 'beforePoint' },
  { header: '변화 포인트', field: 'amount' },
  { header: '이후 포인트', field: 'afterPoint' },
  { header: '이력 상세', field: 'description' },
];

export default WelfarePoint;
