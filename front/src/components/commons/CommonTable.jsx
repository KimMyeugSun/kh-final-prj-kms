import React, { useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

/**
 * Mui 공용 테이블 컴포넌트
 * @param {Array} tableHeader { header: '헤더명', field: '데이터필드명', type: 'chips' } 배열
 * @param {Array} rows 데이터 배열
 * @param {number|string} selectedRowNo 선택된 행의 고유번호 (선택 사항)
 * @param {function} getRowLink 행 클릭 시 이동할 링크를 반환하는 함수, (row) => '/path' (선택 사항)
 * @param {boolean} useStickyHeader 헤더 고정 여부 (기본값: false)
 * @param {boolean} initSort 초기정렬 여부 [기본값: true] (false - 처음 로딩 시 정렬하지 않음)
 * @returns 
 * 
 * 사용 예제:
 * 
 * 행 클릭 이동 없음
 * <CommonTable tableHeader={tableHeader} rows={rows} />
 * 
 * 행 클릭 이동 있음
 * <CommonTable tableHeader={tableHeader} rows={rows} getRowLink={(row) => `/club/board/${row.no}`} />
 * 
 * 행 클릭 이동 있음 (예: 칩 타입 컬럼 포함)
 * const tableHeader = [
    { header: '순번', field: 'no' },
    { header: '이름', field: 'name' },
    { header: '권한', field: 'roles', type: 'chips' },
  ];

  const rows = [
    { no: 1, name: '홍길동', roles: [{label: 'ADMIN', color: 'error'}, {label: 'USER', color: 'success'}] },
    { no: 2, name: '김철수', roles: [{label: 'USER', color: 'success'}] },
    { no: 3, name: '박영희', roles: [] },
  ];
  //!< 사용 예제는 src/pages/management/empmanagement/EmployeeLookUp.jsx line:81 참고
 */
const CommonTable = ({
  tableHeader,
  rows,
  selectedRowNo = -1,
  getRowLink,
  StickyHeaderSx = null,
  initSort = true,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [orderBy, setOrderBy] = useState(
    initSort ? tableHeader[0].field ?? 'id' : null
  );
  const [order, setOrder] = useState('asc');

  // --- 타입 감지 유틸 ---
  const isNumeric = (v) =>
    typeof v === 'number' ||
    (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v)));
  const isDateLike = (v) =>
    typeof v === 'string' && /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.test(v);

  // --- 비교 함수 ---
  const compareCore = (aVal, bVal) => {
    const aU = aVal === null || aVal === undefined;
    const bU = bVal === null || bVal === undefined;
    if (aU && bU) return 0;
    if (aU) return -1;
    if (bU) return 1;

    if (isNumeric(aVal) && isNumeric(bVal)) {
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      return aNum - bNum;
    }

    if (isDateLike(aVal) && isDateLike(bVal)) {
      const toDate = (s) => {
        const [y, m, d] = s
          .replaceAll('/', '-')
          .replaceAll('.', '-')
          .split('-')
          .map(Number);
        return new Date(y, (m || 1) - 1, d || 1).getTime();
      };
      return toDate(aVal) - toDate(bVal);
    }

    return String(aVal).localeCompare(String(bVal));
  };

  const getComparator = (order, orderBy) => (a, b) => {
    const v = compareCore(a?.[orderBy], b?.[orderBy]);
    return order === 'asc' ? v : -v;
  };

  // --- 안정 정렬 (stable sort) ---
  const stableSort = (array, comparator) =>
    array
      .map((el, idx) => [el, idx])
      .sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      })
      .map((el) => el[0]);

  const sortedRows = useMemo(() => {
    if (!orderBy) return rows ?? [];
    return stableSort(rows ?? [], getComparator(order, orderBy));
  }, [rows, order, orderBy]);

  const handleHeaderClick = (field) => {
    if (!orderBy) {
      setOrderBy(field);
      setOrder('asc');
    } else if (orderBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  };

  const handleRowClick = (row) => {
    if (selectedRowNo === row.no) return;
    if (typeof getRowLink === 'function') {
      navigate(getRowLink(row));
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        ...(StickyHeaderSx && {
          maxHeight: StickyHeaderSx.maxHeight || 520,
          overflowY: 'auto',
        }),
      }}
    >
      <Table
        stickyHeader={StickyHeaderSx?.stickyHeader || false}
        aria-label="common table"
      >
        <TableHead>
          <TableRow>
            {tableHeader.map((col, i) => (
              <TableCell
                key={`head-${i}`}
                align="center"
                onClick={() => handleHeaderClick(col.field)}
                sx={{
                  userSelect: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontSize: '1.04rem',
                  fontWeight: '700',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                  color: theme.palette.common.white,
                  background: theme.palette.primary.main,
                  ...(StickyHeaderSx && {
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                  }),
                }}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row, rIdx) => (
            <TableRow
              key={`row-${rIdx}`}
              hover
              onClick={() => getRowLink && handleRowClick(row)}
              sx={{
                cursor:
                  typeof getRowLink === 'function' ? 'pointer' : 'default',
                backgroundColor:
                  selectedRowNo === row.no ? '#e3f2fd' : 'inherit',
              }}
              role={typeof getRowLink === 'function' ? 'link' : undefined}
              tabIndex={typeof getRowLink === 'function' ? 0 : undefined}
              onKeyDown={(e) => {
                if (
                  typeof getRowLink === 'function' &&
                  (e.key === 'Enter' || e.key === ' ')
                ) {
                  e.preventDefault();
                  handleRowClick(row);
                }
              }}
            >
              {tableHeader.map((col, cIdx) => (
                <TableCell key={`cell-${rIdx}-${cIdx}`} align="center">
                  {col.type === 'chips' ? (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {(Array.isArray(row[col.field])
                        ? row[col.field]
                        : []
                      ).map((chip, idx) => (
                        <Chip
                          key={idx}
                          label={chip.label}
                          size="small"
                          color={chip.color || 'default'}
                        />
                      ))}
                    </Stack>
                  ) : (
                    row?.[col.field] ?? ''
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable;
