import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CommonPagination from '../../../components/commons/Pagination';
import CommonTable from '../../../components/commons/CommonTable';
import authFetch from '../../../utils/authFetch';
import { useNavigate, useParams } from 'react-router-dom';
import ClubRequsetModal from './ClubRequsetModal';

const ClubCreationRequestM = () => {
  const navigate = useNavigate();
  const { page } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  const [selectedNo, setSelectedNo] = useState(null);
  const [detail, setDetail] = useState(null);

  // 목록 불러오기
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', Number(page));
    const devUrl = `/management/api/club/category/req?${params.toString()}`;

    authFetch(devUrl)
      .then((resp) => {
        if (!resp.ok) throw new Error('게시글 조회에 실패했습니다.');
        return resp.json();
      })
      .then((json) => {
        if (ignore) return;
        const data = json.data?.data ?? [];
        const changeDateRow = data.map((d) => ({
          ...d,
          updateAt: d.updateAt?.split('T')?.[0] ?? d.updateAt,
        }));
        console.log(changeDateRow);

        setRows(changeDateRow);
        setCount(json.totalPages ?? 0);
      })
      .catch(() => {
        if (!ignore) setRows([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page]);

  const handleClose = () => setOpen(false);

  const handleChangePage = (_e, value) => {
    if (page === value) return;
    navigate(`/management/creation-request-management/${value}`);
  };

  const tableHeader = [
    { header: '동호회 명', field: 'name' },
    { header: '동호회장', field: 'leaderName' },
    { header: '요청일', field: 'updateAt' },
  ];

  async function handleRowClick(row) {
    try {
      setSelectedNo(row.no);
      setOpen(true);
      setSearchLoading(true);

      const devUrl = `/management/api/club/category/req/${row.no}`;

      const resp = await authFetch(devUrl);
      if (!resp.ok) throw new Error('상세 조회 실패');

      const json = await resp.json();

      setDetail(json.data ?? json);
    } catch (e) {
      console.error(e);
      setDetail(null);
    } finally {
      setSearchLoading(false);
    }
  }
  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <ClubRequsetModal
        open={open}
        onClose={handleClose}
        loading={searchLoading}
        data={detail}
        no={selectedNo}
      />
      <Box height="calc(100vh - 130px)" sx={{ p: 2, userSelect: 'none' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>승인 페이지 목록</Typography>
        <Divider />
        <br />
        {rows.length === 0 ? (
          <Stack alignItems="center" mt={4}>
            <Typography color="text.secondary">
              승인 요청이 없습니다.
            </Typography>
          </Stack>
        ) : (
          <>
            <CommonTable
              tableHeader={tableHeader}
              rows={rows}
              getRowLink={handleRowClick}
            ></CommonTable>
            <CommonPagination
              page={page}
              count={count}
              onChange={handleChangePage}
            ></CommonPagination>
          </>
        )}
      </Box>
    </>
  );
};

export default ClubCreationRequestM;
