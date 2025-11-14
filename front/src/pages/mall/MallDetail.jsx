import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PageTitle from '../../define/styles/jgj/PageTitle';
import Css from '../../define/styles/jgj/mall/MallDetailCss';
import authFetch from '../../utils/authFetch';
import { useAuth } from '../../auth/useAuth';
import CommonSnackbar from '../../components/commons/CommonSnackbar';

const { PageWrap, LAYOUT_WIDTH, BOX_SIZE, ImageBox, Img, InfoBox } = Css;
const { VITE_S3_URL, VITE_S3_PRODUCT_IMG } = import.meta.env;

const MallDetail = () => {
  const { getEmpNo } = useAuth();
  const eno = Number(getEmpNo());

  const { id } = useParams();
  const no = Number(id);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const fetchProduct = () => {
    const url = `/api/product/${no}`;
    const option = {};

    authFetch(url, option)
      .then((resp) => {
        return resp.json();
      })
      .then((result) => {
        setProduct(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 내 찜 여부 조회
  const fetchFavorites = () => {
    const url = `/api/favorite/${eno}`;
    authFetch(url)
      .then((resp) => resp.json())
      .then((result) => {
        const favNos = result.data || [];
        setFavorites(favNos.includes(no));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProduct();
    fetchFavorites();
  }, [no]);

  if (!product) {
    return (
      <PageWrap>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography variant="h5" fontWeight={700}>
            상품을 찾을 수 없습니다.
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            이전으로
          </Button>
        </Container>
      </PageWrap>
    );
  }

  // ImgUrl
  const buildImgUrl = (path) => {
    if (!path) return null;
    return VITE_S3_URL + VITE_S3_PRODUCT_IMG + path;
  };

  const handleAddCart = () => {
    const url = `/api/cartItem`;
    const obj = {
      eno: eno,
      productNo: no,
      quantity: quantity,
    };

    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    };

    authFetch(url, option)
      .then((resp) => {
        return resp.text();
      })
      .then((result) => {
        setSnackbar({
          open: true,
          message: '장바구니에 추가되었습니다.',
          severity: 'success',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 찜 등록/해제
  const handleToggleFavorite = () => {
    const url = `/api/favorite`;
    const obj = { eno, pno: no };

    if (!favorites) {
      // 찜 등록
      const option = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      };
      authFetch(url, option)
        .then((resp) => resp.json())
        .then(() => {
          setFavorites(true);
          setSnackbar({
            open: true,
            message: '찜 목록에 추가되었습니다.',
            severity: 'success',
          });
        })
        .catch((err) => console.log(err));
    } else {
      // 찜 해제
      const option = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      };
      authFetch(url, option)
        .then((resp) => resp.json())
        .then(() => {
          setFavorites(false);
          setSnackbar({
            open: true,
            message: '찜 목록에서 제거되었습니다.',
            severity: 'info',
          });
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <PageWrap>
      <Container maxWidth={false} sx={{ width: LAYOUT_WIDTH }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <PageTitle>상품 상세조회</PageTitle>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `${BOX_SIZE}px ${BOX_SIZE}px`,
            gap: 10,
            justifyContent: 'start',
          }}
        >
          <ImageBox>
            <Img src={buildImgUrl(product.url)} alt={product.name} />
          </ImageBox>

          <InfoBox elevation={0}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, fontSize: '1.8rem' }}
              >
                {product.name}
              </Typography>
              <IconButton
                onClick={handleToggleFavorite}
                sx={{ border: '1px solid rgba(0,0,0,0.08)' }}
              >
                {favorites ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Typography variant="h5" fontWeight={800}>
                {product.price.toLocaleString()}원
              </Typography>

              <Box
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: product.stock > 0 ? '#f7faf7' : '#fff5f5',
                  width: 'fit-content',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: product.stock > 0 ? 'success.main' : 'error.main',
                  }}
                >
                  남은 수량: {product.stock > 0 ? `${product.stock}개` : '품절'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                type="number"
                size="small"
                label="수량"
                value={quantity}
                onChange={(e) => {
                  const val = Math.max(
                    1,
                    Math.min(product.stock, Number(e.target.value))
                  );
                  setQuantity(val);
                }}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: 80 }}
              />
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={product.stock === 0}
                onClick={handleAddCart}
                startIcon={<AddShoppingCartIcon />}
              >
                장바구니 추가
              </Button>
            </Box>
          </InfoBox>
        </Box>
      </Container>
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </PageWrap>
  );
};

export default MallDetail;
