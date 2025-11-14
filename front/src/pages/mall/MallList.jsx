import React, { useEffect, useState } from 'react';
import { Box, Container, IconButton, Typography, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PageTitle from '../../define/styles/jgj/PageTitle';
import SearchBar from '../../components/commons/SearchBar';
import Css from '../../define/styles/jgj/mall/MallListCss';
import { useAuth } from '../../auth/useAuth';
import authFetch from '../../utils/authFetch';
import AddIcon from '@mui/icons-material/Add';
import CommonSnackbar from '../../components/commons/CommonSnackbar';

const { VITE_S3_URL, VITE_S3_PRODUCT_IMG } = import.meta.env;
const {
  PageWrap,
  ProdCard,
  HeartButton,
  SquareThumb,
  ThumbImg,
  Split,
  CONTAINER_SX,
  GRID_COLUMNS,
  GRID_GAP,
  TITLE_TYPO_SX,
  PRICE_WRAP_SX,
  PRICE_TYPO_SX,
  CartAddButton,
} = Css;

export default function Mall() {
  const { getEmpNo } = useAuth();
  const eno = Number(getEmpNo());

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // 상품 찜하기
  const handleToggleFavorite = (pno) => {
    let isFavorite = favorites[pno] || false;

    const url = `/api/favorite`;
    const obj = {
      eno: eno,
      pno: pno,
    };

    if (!isFavorite) {
      // 찜 등록
      const option = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      };

      authFetch(url, option)
        .then((resp) => {
          return resp.json();
        })
        .then((result) => {
          setFavorites((prev) => ({ ...prev, [pno]: true }));
          setSnackbar({
            open: true,
            message: '찜 목록에 추가되었습니다.',
            severity: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // 찜 해제
      const option = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      };
      authFetch(url, option)
        .then((resp) => {
          return resp.json();
        })
        .then((result) => {
          setFavorites((prev) => ({ ...prev, [pno]: false }));
          setSnackbar({
            open: true,
            message: '찜 목록에서 제거되었습니다.',
            severity: 'info',
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleCardClick = (id) => {
    navigate(`/mall/${id}`);
  };

  const goCart = () => navigate('/mall/cart');

  // 상품 목록 조회 fetch
  const fetchProducts = () => {
    const url = `/api/product`;
    const option = {};

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        setProducts(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 내 찜 목록 번호 조회 fetch
  const fetchFavorites = () => {
    authFetch(`/api/favorite/${eno}`)
      .then((resp) => {
        return resp.json();
      })
      .then((result) => {
        const favMap = {};
        result.data.forEach((pno) => {
          favMap[pno] = true;
        });
        setFavorites(favMap);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  const handleSearch = (q) => {
    setKeyword(q?.trim() || '');
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );

  // ImgUrl
  const buildImgUrl = (path) => {
    if (!path) return null;
    return VITE_S3_URL + VITE_S3_PRODUCT_IMG + path;
  };

  // 장바구니 추가
  const handleAddToCart = (productNo) => {
    const url = `/api/cartItem`;
    const obj = {
      eno: eno,
      productNo: productNo,
      quantity: 1,
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
        return resp.json();
      })
      .then((data) => {
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

  return (
    <PageWrap>
      <Container maxWidth={false} sx={CONTAINER_SX}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            columnGap: GRID_GAP,
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}
          >
            <Box sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
              <PageTitle>지킴이몰</PageTitle>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <SearchBar
                placeholder="상품을 검색하세요"
                onSearch={handleSearch}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Badge badgeContent={cartCount} color="error" overlap="circular">
              <IconButton onClick={goCart} aria-label="장바구니로 이동">
                <ShoppingCartIcon fontSize="large" />
              </IconButton>
            </Badge>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gridTemplateColumns: GRID_COLUMNS,
            columnGap: GRID_GAP,
            rowGap: GRID_GAP,
            justifyContent: 'start',
          }}
        >
          {filteredProducts.map((p) => (
            <ProdCard key={p.no} onClick={() => handleCardClick(p.no)}>
              <HeartButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(p.no);
                }}
              >
                {favorites[p.no] ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
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

              <CartAddButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(p.no);
                }}
              >
                <AddIcon />
              </CartAddButton>
            </ProdCard>
          ))}
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
}
