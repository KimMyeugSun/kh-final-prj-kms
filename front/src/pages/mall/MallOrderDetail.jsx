import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import PageTitle from '../../define/styles/jgj/PageTitle';
import { useParams } from 'react-router-dom';
import authFetch from '../../utils/authFetch';
import { useAuth } from '../../auth/useAuth';

// 샘플 데이터 (실제에선 props, useParams, API 호출 등으로 가져오면 됨)
const order = {
  id: 1,
  date: '2025-08-18',
  product: '비타민C 500mg 60정, 2개',
  address: '서울특별시 강남구 테헤란로 1234 KH 정보교육원, 5층 501호',
  price: 20000,
  receiver: '홍길동',
  phone: '010-1234-5678',
};

const MallOrderDetail = () => {
  const { id } = useParams();
  const no = Number(id);

  const { getEmpNo, getName } = useAuth();
  const eno = Number(getEmpNo());
  const name = getName();

  const [order, setOrder] = useState('');

  useEffect(() => {
    const url = `/api/order/${eno}/detail/${no}`;
    authFetch(url)
      .then((resp) => resp.json())
      .then((result) => {
        setOrder(result.data);
      })
      .catch((err) => console.error(err));
  }, [eno, id]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', py: 4 }}>
      <Container maxWidth="sm">
        <PageTitle>주문 상세 조회</PageTitle> <br />
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.12)',
          }}
        >
          {/* 주문 기본 정보 */}
          <Typography fontWeight={600} variant="h6" gutterBottom>
            주문번호 {order.no}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            주문일자: {new Date(order.createdAt).toLocaleDateString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* 상품 정보 */}
          <Typography fontWeight={600} gutterBottom>
            주문 상품
          </Typography>
          {order.items?.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography>
                {item.productName} ({item.quantity}개)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(item.price ?? 0).toLocaleString()} 원
              </Typography>
            </Box>
          ))}
          <Typography
            fontWeight={600}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <Typography fontWeight={600}>총 결제금액</Typography>
            <Typography fontWeight={600}>
              {(order.totalPrice ?? 0).toLocaleString()} 원
            </Typography>
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* 배송 정보 */}
          <Typography fontWeight={600} gutterBottom>
            배송지 정보
          </Typography>
          <Typography>받는 사람: {name || '미등록'}</Typography>
          <Typography>
            연락처:{' '}
            {order.phone
              ? order.phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3')
              : '미등록'}
          </Typography>
          <Typography>
            {' '}
            주소: {order.address} {order.addressDetail}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* 버튼 영역 */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                alert('교환/반품 신청 페이지로 이동합니다.');
              }}
            >
              교환, 반품 신청
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: '#1976d2' }}
              onClick={() => {
                alert('배송 조회 페이지로 이동합니다.');
              }}
            >
              배송 조회
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MallOrderDetail;
