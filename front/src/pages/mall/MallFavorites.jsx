import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import PageTitle from '../../define/styles/jgj/PageTitle';
import Css from '../../define/styles/jgj/mall/MallListCss';
import { useAuth } from '../../auth/useAuth';
import authFetch from '../../utils/authFetch';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommonSnackbar from '../../components/commons/CommonSnackbar';
import { useNavigate } from 'react-router-dom';

const { VITE_S3_URL, VITE_S3_PRODUCT_IMG } = import.meta.env;
const {
  PageWrap,
  ProdCard,
  SquareThumb,
  ThumbImg,
  Split,
  CONTAINER_SX,
  GRID_COLUMNS,
  GRID_GAP,
  TITLE_TYPO_SX,
  PRICE_WRAP_SX,
  PRICE_TYPO_SX,
  HeartButton,
} = Css;

export default function MallFavorites() {
  const { getEmpNo } = useAuth();
  const eno = Number(getEmpNo());

  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    fetchFavorites();
  }, [eno]);

  const fetchFavorites = () => {
    const url = `/api/favorite/${eno}/products`;
    authFetch(url)
      .then((resp) => resp.json())
      .then((result) => {
        setFavorites(result.data || []);
      })
      .catch((err) => console.error(err));
  };

  const handleCardClick = (id) => {
    navigate(`/mall/${id}`);
  };

  // 찜 해제
  const handleToggleFavorite = (pno) => {
    const url = `/api/favorite`;
    const obj = { eno, pno };

    const option = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    };

    authFetch(url, option)
      .then((resp) => resp.json())
      .then(() => {
        setFavorites((prev) => prev.filter((p) => p.no !== pno));
        setSnackbar({
          open: true,
          message: '찜 목록에서 제거되었습니다.',
          severity: 'info',
        });
      })
      .catch((err) => console.error(err));
  };

  const buildImgUrl = (path) => {
    if (!path) return null;
    return VITE_S3_URL + VITE_S3_PRODUCT_IMG + path;
  };

  return (
    <PageWrap>
      <Container maxWidth={false} sx={CONTAINER_SX}>
        <Box sx={{ mb: 3 }}>
          <PageTitle>내가 찜한 상품</PageTitle>
        </Box>

        {favorites.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            찜한 상품이 없습니다.
          </Typography>
        ) : (
          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gridTemplateColumns: GRID_COLUMNS,
              columnGap: GRID_GAP,
              rowGap: GRID_GAP,
            }}
          >
            {favorites.map((p) => (
              <ProdCard key={p.no} onClick={() => handleCardClick(p.no)}>
                <HeartButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(p.no);
                  }}
                >
                  <FavoriteIcon color="error" />
                </HeartButton>

                <SquareThumb>
                  <ThumbImg src={buildImgUrl(p.url)} alt={p.name} />
                </SquareThumb>

                <Split />

                <Typography sx={TITLE_TYPO_SX}>{p.name}</Typography>

                <Box sx={PRICE_WRAP_SX}>
                  <Typography sx={PRICE_TYPO_SX}>
                    {p.price.toLocaleString()}
                  </Typography>
                </Box>
              </ProdCard>
            ))}
          </Box>
        )}
      </Container>

      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </PageWrap>
  );
}
