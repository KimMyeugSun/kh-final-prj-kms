import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

const PageWrap = styled('div')({
  minHeight: '100vh',
  background: '#fff',
  paddingTop: 24,
  paddingBottom: 48,
  userSelect: 'none',
});

const LAYOUT_WIDTH = '70%';
const BOX_SIZE = 420;

const Frame = styled('div')({
  width: BOX_SIZE,
  height: BOX_SIZE,
  borderRadius: 4,
  border: '1px solid rgba(0,0,0,0.12)',
  overflow: 'hidden',
  background: '#fafafa',
});

const ImageBox = styled(Frame)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Img = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const InfoBox = styled(Card)({
  width: BOX_SIZE,
  border: '1px solid rgba(0,0,0,0.12)',
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

const MallDetailManagementCss = {
  PageWrap,
  LAYOUT_WIDTH,
  BOX_SIZE,
  ImageBox,
  Img,
  InfoBox,
};

export default MallDetailManagementCss;
