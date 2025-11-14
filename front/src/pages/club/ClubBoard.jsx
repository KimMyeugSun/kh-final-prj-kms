import React, { useEffect, useRef, useState } from 'react';
import SearchBar from '../../components/commons/SearchBar';
import CommonTable from '../../components/commons/CommonTable';
import ClubSearchModal from '../club/modals/ClubSearchModal';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, CircularProgress } from '@mui/material';
import authFetch from '../../utils/authFetch';
import CommonPagination from '../../components/commons/Pagination';

const ClubBoard = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [searchResult, setSearchResult] = useState([]);

  const reqIdRef = useRef(0);
  const navigate = useNavigate();
  const { page: pageParam } = useParams();
  const { pathname } = window.location;
  const m = pathname.match(/^\/club\/board\/([^/]+)\/page\/(\d+)/);

  const cno = m?.[1] ?? null; // 문자열
  const pageFromPath = m?.[2] ? parseInt(m[2], 10) : null;
  const page = Math.max(parseInt(pageParam ?? pageFromPath ?? '1', 10), 1);

  useEffect(() => {
    if (!pageParam && cno)
      navigate(`/club/board/${cno}/page/1`, { replace: true });
  }, [pageParam, cno, navigate]);
  const devUrl = `/api/club/board/look-up/${cno}/${page}`;

  useEffect(() => {
    if (!cno || !page) return;
    let ignore = false;
    setLoading(true);
    authFetch(devUrl)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('게시글 조회에 실패했습니다.');
        } else {
          return resp.json();
        }
      })
      .then((datas) => {
        if (ignore) return;
        const data = datas.data;
        const changeDateRow = data.map((d) => ({
          ...d,
          createAt: d.createAt.split('T')[0],
        }));
        setRows(changeDateRow);
        setCount(datas.totalPages);
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
  }, [page, cno]);

  const handleClose = () => setOpen(false);

  const handleChangePage = (_e, value) => {
    if (page === value) return;
    navigate(`/club/board/${cno}/page/${value}`);
  };
  const handleSearch = (q) => {
    const currentId = ++reqIdRef.current;
    const next = (q ?? '').trim();

    setQuery(next);
    setSearchResult([]);
    setOpen(true);
    setSearchLoading(true);

    const reqDto = { cno, query: next };
    authFetch(`/api/club/board/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqDto),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error('검색에 실패했습니다');
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        if (currentId !== reqIdRef.current) return;
        setSearchResult(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (currentId === reqIdRef.current) setQuery('');
      })
      .finally(() => {
        if (currentId === reqIdRef.current) setSearchLoading(false);
      });
  };

  function handleSelect(selected) {
    navigate(`/club/board/${cno}/post/${selected.no}`);
  }

  const tableHeader = [
    { header: '제목', field: 'title' },
    { header: '작성자', field: 'writerName' },
    { header: '작성일', field: 'createAt' },
    { header: '조회수', field: 'hit' },
  ];

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <ClubSearchModal
        open={open}
        onClose={handleClose}
        onSelect={handleSelect}
        query={query}
        rows={searchResult}
        loading={searchLoading}
      ></ClubSearchModal>

      <SearchBar
        placeholder={'검색할 단어를 입력해주세요'}
        onSearch={handleSearch}
      />
      <br />
      <CommonTable
        tableHeader={tableHeader}
        rows={rows}
        getRowLink={(row) => `/club/board/${cno}/post/${row.no}`}
      ></CommonTable>
      <CommonPagination
        page={page}
        count={count}
        onChange={handleChangePage}
      ></CommonPagination>
      <Button
        onClick={() => {
          navigate(`/club/board/${cno}/insert`);
        }}
        variant="contained"
      >
        글쓰기
      </Button>
    </>
  );
};

export default ClubBoard;
