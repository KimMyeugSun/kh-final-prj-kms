import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  CircularProgress,
  Typography,
} from '@mui/material';
import PageTitle from '../../../define/styles/jgj/PageTitle';
import authFetch from '../../../utils/authFetch';
import CommonTable from '../../../components/commons/CommonTable';
import SearchBar from '../../../components/commons/SearchBar';
import Pagination from '../../../components/commons/Pagination';
import dayjs from 'dayjs';

const MallOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // 전체 사원 주문 목록 조회 fetch
  const fetchOrders = (query = '', pageNum = 1) => {
    setLoading(true);
    let url = `/management/api/order?page=${pageNum - 1}&size=10`;
    if (query) url += `&keyword=${encodeURIComponent(query)}`;
    const option = {};

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        const data = result.data;
        const mapped = data.content.map((order) => ({
          no: order.no,
          eno: order.eno,
          empName: order.empName,
          createdAt: dayjs(order.createdAt).format('YYYY-MM-DD'),
          address: `${order.address} ${order.addressDetail || ''}`,
          phone: order.phone
            ? order.phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')
            : '미등록',
          totalPrice: `${order.totalPrice?.toLocaleString()} 원`,
        }));
        setOrders(mapped);
        setPage(data.number + 1);
        setTotalPages(data.totalPages);
        setSearchQuery(query);
      })
      .catch((err) => {
        console.error(err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  // 최초 로딩
  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSearch = (q) => {
    fetchOrders(q, 1);
  };

  // 공통 테이블 헤더 정의
  const tableHeader = [
    { header: '주문번호', field: 'no' },
    { header: '사번', field: 'eno' },
    { header: '사원명', field: 'empName' },
    { header: '연락처', field: 'phone' },
    { header: '주문일자', field: 'createdAt' },
    { header: '총 금액', field: 'totalPrice' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', py: 4, userSelect: 'none' }}>
      <Container maxWidth="lg">
        <PageTitle>전체 주문 관리</PageTitle> <br />
        <Box sx={{ mb: 2 }}>
          <SearchBar
            placeholder="사번 / 사원명 / 주문번호 / 주문일자"
            onSearch={handleSearch}
          />
        </Box>
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.12)',
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: orders.length === 0 ? 'center' : 'flex-start',
            alignItems: 'center',
          }}
        >
          {orders.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              조회된 주문 내역이 없습니다.
            </Typography>
          ) : (
            <>
              <CommonTable
                tableHeader={tableHeader}
                rows={orders}
                StickyHeaderSx={{ stickyHeader: true, maxHeight: 600 }}
                getRowLink={(row) => `/management/mall/order-detail/${row.no}`}
              />
              <Pagination
                page={page}
                count={totalPages}
                onChange={(e, newPage) => fetchOrders(searchQuery, newPage)}
              />
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default MallOrderManagement;
