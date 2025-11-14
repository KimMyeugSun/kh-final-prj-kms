import { useEffect, useState } from 'react';
import CommonTable from '../../components/commons/CommonTable.jsx';
import SearchBar from '../../components/commons/SearchBar.jsx';
import CategorySearchModal from './modals/CategorySearchModal.jsx';
import authFetch from '../../utils/authFetch';
import { useNavigate, useParams } from 'react-router-dom';
import CommonPagination from '../../components/commons/Pagination.jsx';
import { Box, CircularProgress } from '@mui/material';

export default function Search() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState([]);
  const { page: pageParam } = useParams();
  const page = Math.max(parseInt(pageParam ?? '1', 10), 1);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!pageParam) navigate('/club/search/page/1', { replace: true });
  }, [pageParam, navigate]);

  const devUrl = `/api/club/category/${page}`;

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    authFetch(devUrl)
      .then((resp) => resp.json())
      .then((datas) => {
        const data = datas.data;
        const changeDateRow = data.map((d) => ({
          ...d,
          updateAt: d.updateAt.split('T')[0],
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
  }, [page]);

  const handleChangePage = (event, value) => {
    if (page == value) return;
    navigate(`/club/search/page/${value}`);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSearch = (q) => {
    const next = q?.trim() ?? '';
    setQuery(next);
    if (next.length > 0) setOpen(true);
  };

  const tableHeader = [
    { header: '동호회 명', field: 'name' },
    { header: '동호회장', field: 'leaderName' },
    { header: '창설일', field: 'updateAt' },
  ];

  const results = rows.filter(
    (r) => r.name.includes(query) || r.leaderName.includes(query)
  );

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Box m={2} sx={{ userSelect: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SearchBar
          placeholder="동호회 이름을 작성해주세요"
          onSearch={handleSearch}
        />
        <CommonTable
          tableHeader={tableHeader}
          rows={rows}
          getRowLink={(row) => `/club/board/${row.no}/page/1`}
        />
        <CommonPagination
          page={page}
          count={count}
          onChange={handleChangePage}
        />
      </Box>
      <CategorySearchModal
        open={open}
        onClose={handleClose}
        query={query}
        results={results}
      />
    </>
  );
}
