import { styled } from '@mui/material/styles';
import { Card, IconButton } from '@mui/material';

const PageWrap = styled('div')({
  minHeight: '100vh',
  background: '#fff',
  paddingTop: 24,
  paddingBottom: 48,
  userSelect: 'none',
});

const ProdCard = styled(Card)({
  borderRadius: 16,
  border: '1px solid rgba(0, 0, 0, 0.12)',
  width: 280,
  height: 300,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '16px',
  cursor: 'pointer',
  position: 'relative',
});

const HeartButton = styled(IconButton)({
  position: 'absolute',
  top: 8,
  right: 8,
  background: '#fff',
  padding: 4,
  borderRadius: '50%',
  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  '&:hover': {
    background: '#f8f8f8',
  },
});

const SquareThumb = styled('div')({
  width: 180,
  height: 180,
  background: '#fff',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 8,
});

const ThumbImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  borderRadius: 11,
});

const Split = styled('div')(({ theme }) => ({
  marginTop: 12,
  height: 2,
  background: theme.palette.divider,
  width: '80%',
  borderRadius: 2,
}));

const CONTAINER_SX = { width: '70%' };
const GRID_COLUMNS = 'repeat(3, 280px)';
const GRID_GAP = 10;

const TITLE_TYPO_SX = { fontWeight: 700, mt: 2, textAlign: 'center' };
const PRICE_WRAP_SX = { mt: 1, alignSelf: 'flex-end', pr: 2 };
const PRICE_TYPO_SX = { fontWeight: 700 };

const CartAddButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 8,
  right: 8,
  background: '#fff',
  padding: 6,
  borderRadius: '50%',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  opacity: 0,
  transition: 'opacity 0.2s',
  '&:hover': {
    background: theme.palette.grey[100],
  },
  '.MuiCard-root:hover &': {
    opacity: 1,
  },
}));

const MallListCss = {
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
};

export default MallListCss;
