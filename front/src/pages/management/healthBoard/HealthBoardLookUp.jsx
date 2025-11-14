import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CommonPagination from '../../../components/commons/Pagination';
import SearchBar from '../../../components/commons/SearchBar';
import CommonTable from '../../../components/commons/CommonTable';
import HealthBoardSearchModal from './HealthBoardSearchModal';
import authFetch from '../../../utils/authFetch';

const HealthBoardLookUp = () => {
  const navigate = useNavigate();
  const { page } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [searchResult, setSearchResult] = useState([]);
  const [query, setQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const reqIdRef = useRef(0);

  function handleSelect(selected) {
    navigate(`/management/health_board/lookat/${selected.bno}`);
  }
  const handleClose = () => setOpen(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', Number(page));
    const devUrl = `/management/api/health/board?${params.toString()}`;

    authFetch(devUrl)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('게시글 조회에 실패했습니다.');
        } else {
          return resp.json();
        }
      })
      .then((json) => {
        if (ignore) return;
        const data = json.data.data;
        const changeDateRow = data.map((d) => ({
          ...d,
          createdAt: d.createdAt.split('T')[0],
        }));
        setRows(changeDateRow);
        setCount(json.totalPages);
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
  }, [page]);

  const tableHeader = [
    { header: '순번', field: 'bno' },
    { header: '카테고리', field: 'categoryName' },
    { header: '제목', field: 'title' },
    { header: '작성일', field: 'createdAt' },
  ];

  const handleChangePage = (_e, value) => {
    if (page === value) return;
    navigate(`/management/health_board/${value}`);
  };

  const handleSearch = (q) => {
    const currentId = ++reqIdRef.current;
    const next = (q ?? '').trim();

    setQuery(next);
    setSearchResult([]);
    setOpen(true);
    setSearchLoading(true);

    const reqDto = { query: next };
    authFetch(`/management/api/health/board/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqDto),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error('검색에 실패했습니다');
        return resp.json();
      })
      .then((data) => {
        if (currentId !== reqIdRef.current) return;
        console.log(data.data);

        setSearchResult(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => {
        if (currentId === reqIdRef.current) setQuery('');
      })
      .finally(() => {
        if (currentId === reqIdRef.current) setSearchLoading(false);
      });
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <HealthBoardSearchModal
        open={open}
        onClose={handleClose}
        onSelect={handleSelect}
        query={query}
        rows={searchResult}
        loading={searchLoading}
      ></HealthBoardSearchModal>

      <Box height="calc(100vh - 130px)" sx={{ p: 2, userSelect: 'none' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>건강 게시글 목록</Typography>
        <Divider />
        <br />
        <SearchBar
          placeholder={'검색할 단어를 입력해주세요'}
          onSearch={handleSearch}
        />
        <br />
        <CommonTable
          tableHeader={tableHeader}
          rows={rows}
          getRowLink={(row) => `/management/health_board/lookat/${row.bno}`}
        ></CommonTable>
        <CommonPagination
          page={page}
          count={count}
          onChange={handleChangePage}
        ></CommonPagination>
        <Button
          onClick={() => {
            navigate(`/management/health_board/insert`);
          }}
          variant="contained"
        >
          글쓰기
        </Button>
      </Box>
    </>
  );
};

export default HealthBoardLookUp;
