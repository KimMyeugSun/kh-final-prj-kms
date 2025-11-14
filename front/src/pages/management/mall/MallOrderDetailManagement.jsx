import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import PageTitle from '../../../define/styles/jgj/PageTitle';
import { useParams } from 'react-router-dom';
import authFetch from '../../../utils/authFetch';
import dayjs from 'dayjs';

const MallOrderDetail = () => {
  const { id } = useParams();
  const no = Number(id);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`/management/api/order/detail/${no}`)
      .then((resp) => resp.json())
      .then((result) => {
        setOrder(result.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Typography color="text.secondary">
          주문 정보를 불러올 수 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', py: 4 }}>
      <Container maxWidth="md">
        <PageTitle>주문 상세 조회</PageTitle> <br />
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.12)',
          }}
        >
          {/* 주문 기본 정보 */}
          <Typography variant="h6" fontWeight={600} gutterBottom>
            주문번호 {order.no}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            주문일자: {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm')}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* 주문자/배송 정보 */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            주문자 정보
          </Typography>
          <Typography>사번: {order.eno}</Typography>
          <Typography>사원명: {order.empName}</Typography>
          <Typography>
            연락처:{' '}
            {order.phone
              ? order.phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')
              : '미등록'}
          </Typography>
          <Typography>
            주소: {order.address} {order.addressDetail}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* 상품 정보 */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            주문 상품
          </Typography>
          {order.items?.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography>
                {item.productName} ({item.quantity}개)
              </Typography>
              <Typography>{item.price.toLocaleString()} 원</Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* 총 금액 */}
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ textAlign: 'right', mt: 2 }}
          >
            총 결제금액: {order.totalPrice?.toLocaleString()} 원
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default MallOrderDetail;
