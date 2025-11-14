import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Button,
  Paper,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CommonTable from '../../components/commons/CommonTable';
import PageTitle from '../../define/styles/jgj/PageTitle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import authFetch from '../../utils/authFetch';

const { VITE_S3_URL, VITE_S3_PRODUCT_IMG } = import.meta.env;
const SHIPPING_FEE = 3000;

export default function MallCart() {
  const { getEmpNo } = useAuth();
  const eno = Number(getEmpNo());

  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // 장바구니 목록 조회
  const fetchCart = () => {
    const url = `/api/cartItem/${eno}`;
    authFetch(url)
      .then((resp) => resp.json())
      .then((result) => {
        setCartItems(result.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCart();
  }, [eno]);

  const productsTotal = useMemo(
    () => cartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0),
    [cartItems]
  );
  const totalPrice = productsTotal + SHIPPING_FEE;

  const buildImgUrl = (path) => {
    if (!path) return null;
    return VITE_S3_URL + VITE_S3_PRODUCT_IMG + path;
  };

  // 장바구니 수량 변경 fetch
  const updateQuantity = (cartItemNo, newQty) => {
    if (newQty < 1) return;
    const url = `/api/cartItem/${cartItemNo}`;
    const option = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty }),
    };

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.success) {
          fetchCart();
        }
      })
      .catch((err) => console.log(err));
  };

  // 삭제
  const handleDelete = (no) => {
    const url = `/api/cartItem/${no}`;
    authFetch(url, { method: 'DELETE' })
      .then((resp) => resp.json())
      .then(() => {
        setCartItems((prev) => prev.filter((it) => it.no !== no));
      })
      .catch((err) => console.log(err));
  };

  const tableHeader = [
    { header: '이미지', field: 'image' },
    { header: '상품명', field: 'name' },
    { header: '수량', field: 'qty' },
    { header: '배송유형', field: 'ship' },
    { header: '가격', field: 'price' },
    { header: '삭제', field: 'actions' },
  ];

  const rows = cartItems.map((item) => ({
    image: (
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2,
          overflow: 'hidden',
          background: '#f7f8fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
        }}
      >
        <img
          src={buildImgUrl(item.productUrl)}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    ),
    name: item.productName,
    qty: (
      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
        <IconButton
          size="small"
          onClick={() => updateQuantity(item.no, item.quantity - 1)}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <TextField
          value={item.quantity}
          onChange={(e) => updateQuantity(item.no, Number(e.target.value) || 1)}
          size="small"
          inputProps={{
            min: 1,
            style: { textAlign: 'center', width: '36px', padding: '2px 0' },
          }}
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '0.875rem',
              padding: '2px 0',
            },
            '& .MuiOutlinedInput-root': {
              height: 30,
            },
          }}
        />
        <IconButton
          size="small"
          onClick={() => updateQuantity(item.no, item.quantity + 1)}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
    ship: '일반배송',
    price: `${(item.price * item.quantity).toLocaleString()}원`,
    actions: (
      <IconButton onClick={() => handleDelete(item.no)}>
        <DeleteIcon />
      </IconButton>
    ),
  }));

  const handleOrder = () => {
    const cartItemIds = cartItems.map((item) => item.no);
    navigate('/mall/payment', { state: { cartItemIds } });
  };
  const handleCancel = () => window.history.back();

  return (
    <Box
      sx={{ minHeight: '100vh', background: '#fff', py: 4, userSelect: 'none' }}
    >
      <Container maxWidth="md">
        <PageTitle>장바구니</PageTitle>
        <br />

        <CommonTable tableHeader={tableHeader} rows={rows} />

        {/* 비어있을 때 */}
        {cartItems.length === 0 && (
          <Typography
            color="error"
            align="center"
            mt={2}
            sx={{ fontWeight: 'bold' }}
          >
            장바구니가 비어 있어 주문할 수 없습니다.
          </Typography>
        )}

        {/* 합계 */}
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            px: 2,
            py: 2,
            bgcolor: '#fff',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 1.5,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
            flexWrap="wrap"
            rowGap={1}
          >
            <Typography>
              총 상품금액 {productsTotal.toLocaleString()}원
            </Typography>
            <Typography>+</Typography>
            <Typography>배송비 {SHIPPING_FEE.toLocaleString()}원</Typography>
            <Typography>=</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              총 결제금액 : {totalPrice.toLocaleString()}원
            </Typography>
          </Box>
        </Paper>

        {/* 버튼 */}
        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            onClick={handleOrder}
            disabled={cartItems.length === 0}
          >
            주문
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel}>
            취소
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
