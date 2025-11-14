import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PageTitle from '../../../define/styles/jgj/PageTitle';
import Css from '../../../define/styles/jgj/mall/MallDetailCss';
import authFetch from '../../../utils/authFetch';
import ProductUpdateModal from './modal/ProductUpdateModal';

const { PageWrap, LAYOUT_WIDTH, BOX_SIZE, ImageBox, Img, InfoBox } = Css;
const { VITE_S3_URL, VITE_S3_PRODUCT_IMG } = import.meta.env;

const MallDetailManagement = () => {
  const { id } = useParams();
  const no = Number(id);

  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const fetchProduct = () => {
    const url = `/management/api/product/${no}`;
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

  useEffect(() => {
    fetchProduct();
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
                onClick={() => setLiked((v) => !v)}
                sx={{ border: '1px solid rgba(0,0,0,0.08)' }}
              >
                {liked ? (
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

            {/* 가격 + 재고 */}
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

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {/* 수정 버튼 */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setUpdateOpen(true)}
              >
                수정
              </Button>

              {/* 삭제 버튼 */}
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => {
                  if (window.confirm('정말 삭제하시겠습니까?')) {
                    const url = `/management/api/product/${product.no}`;
                    const option = { method: 'DELETE' };

                    authFetch(url, option)
                      .then((resp) => resp.json())
                      .then((result) => {
                        navigate('/management/mall/list');
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }
                }}
              >
                삭제
              </Button>
            </Box>
          </InfoBox>
        </Box>
      </Container>

      <ProductUpdateModal
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        product={product}
        onUpdated={() => {
          setUpdateOpen(false);
          fetchProduct();
        }}
      />
    </PageWrap>
  );
};

export default MallDetailManagement;
