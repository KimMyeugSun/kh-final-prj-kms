import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import PageTitle from '../../define/styles/jgj/PageTitle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import authFetch from '../../utils/authFetch';

export default function MallOrderList() {
  const { getEmpNo } = useAuth();
  const eno = Number(getEmpNo());
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const url = `/api/order/${eno}`;

    authFetch(url)
      .then((resp) => resp.json())
      .then((result) => {
        const data = result.data;
        const mapped = data.map((order) => ({
          id: order.no,
          date: new Date(order.createdAt).toLocaleDateString(),
          product:
            order.items && order.items.length > 0
              ? `${order.items[0].productName}${
                  order.items.length > 1
                    ? ` 외 ${order.items.length - 1}개`
                    : ''
                }`
              : '상품 없음',
          address: `${order.address} ${order.addressDetail || ''}`,
          price: order.totalPrice,
        }));
        setOrders(mapped);
      })
      .catch((err) => {
        console.error('주문 목록 조회 실패:', err);
      });
  }, [eno]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', py: 4, userSelect: 'none' }}>
      <Container maxWidth="md">
        <PageTitle>주문 목록</PageTitle> <br />
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.12)',
          }}
        >
          {orders.map((order) => (
            <Box
              key={order.id}
              sx={{
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                pb: 2,
                mb: 2,
                cursor: 'pointer',
                '&:last-child': {
                  borderBottom: 'none',
                  mb: 0,
                  pb: 0,
                },
              }}
              onClick={() => navigate(`/mall/order-detail/${order.id}`)}
            >
              <Typography fontWeight={600}>{order.date}</Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                  mt: 1,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography>{order.product}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.address}
                  </Typography>
                </Box>

                <Typography fontWeight={600}>
                  {order.price.toLocaleString()} 원
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(
                        `주문번호 ${order.id} 교환/반품 신청 페이지로 이동합니다.`
                      );
                    }}
                  >
                    교환, 반품 신청
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ bgcolor: '#1976d2' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(
                        `주문번호 ${order.id} 배송 조회 페이지로 이동합니다.`
                      );
                    }}
                  >
                    배송 조회
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
}
