import { styled } from '@mui/material/styles';
import { Box, Button, Container, Paper } from '@mui/material';

const BorderedContainer = styled(Container)({
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '16px',
  padding: '32px',
  boxSizing: 'border-box',
});

/* ---------- 공통 셀 ---------- */
const Cell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'align' && prop !== 'bold',
})(({ align = 'center', bold = false }) => ({
  textAlign: align,
  fontSize: 14,
  fontWeight: bold ? 700 : 400,
}));

/* ---------- 레이아웃 ---------- */
const Root = styled(Box)({
  minHeight: '100vh',
  backgroundColor: '#fff',
  paddingTop: 48,
  paddingBottom: 48,
  userSelect: 'none',
});

const LogoWrapper = styled(Box)({
  position: 'relative',
  height: 160,
  marginBottom: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const LogoImg = styled('img')({
  width: 150,
  height: 150,
});

const ButtonWrapper = styled(Box)({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
});

const RankButton = styled(Button)({
  backgroundColor: '#2586D6',
  padding: '8px 24px',
  borderRadius: 999,
  fontWeight: 700,
  '&:hover': { backgroundColor: '#1f6cb0' },
});

/* ---------- 헤더 & 행 ---------- */
const grid = '1fr 2fr 2fr 2fr 2fr 2fr';

const HeadWrapper = styled(Box)({
  display: 'grid',
  gridTemplateColumns: grid,
  columnGap: 16,
  alignItems: 'center',
  padding: '12px 16px',
  fontWeight: 700,
  fontSize: 14,
  opacity: 0.8,
  marginBottom: 12,
});

const RowWrapper = styled(Paper)({
  display: 'grid',
  gridTemplateColumns: grid,
  columnGap: 16,
  alignItems: 'center',
  padding: '12px 16px',
  borderRadius: 999,
  backgroundColor: '#fff',
  fontSize: 14,
});

const Rows = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

/* ---------- 배지 ---------- */
const Badge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'type',
})(({ type }) => ({
  padding: '4px 12px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  backgroundColor:
    type === 'GOLD' ? '#ffe08a' : type === 'SILVER' ? '#e6e6e6' : '#f1c0a8',
  textAlign: 'center',
}));

const RankingCss = {
  BorderedContainer,
  Cell,
  Root,
  LogoWrapper,
  LogoImg,
  ButtonWrapper,
  RankButton,
  HeadWrapper,
  RowWrapper,
  Rows,
  Badge,
};

export default RankingCss;
