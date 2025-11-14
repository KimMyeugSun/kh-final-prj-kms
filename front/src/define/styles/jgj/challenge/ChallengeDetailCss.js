import { styled } from '@mui/material/styles';

const Root = styled('div')({
  color: '#111827',
  display: 'flex',
  justifyContent: 'center',
  userSelect: 'none',
});

const Container = styled('div')({
  borderRadius: 13,
  background: '#fff',
  width: '80%',
  maxWidth: '1100px',
  padding: '24px 0',
  border: '1px solid rgba(0, 0, 0, 0.12)',
});

const Content = styled('div')({
  width: '80%',
  margin: '0 auto',
});

const Main = styled('main')({
  margin: '24px auto 72px',
  padding: '0 16px',
});

const ChallImage = styled('div')({
  width: '100%',
  overflow: 'hidden',
  margin: '0 auto',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
});

const Details = styled('section')({
  padding: 20,
  backgroundColor: '#FBF7F0',
  borderRadius: 11,
});

const Title = styled('h1')({
  fontSize: 'clamp(22px, 3.2vw, 32px)',
  fontWeight: 800,
  lineHeight: 1.2,
  margin: '16px 0 6px',
});

const ActionsRow = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  marginTop: 16,
  marginBottom: 20,
});

const Button = styled('button')({
  height: 40,
  padding: '0 16px',
  borderRadius: 12,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  color: '#fff',

  '&.join': {
    background: '#3DA85C',
  },
  '&.join:hover': {
    filter: 'brightness(0.95)',
  },
  '&.list': {
    background: '#F48A33',
  },
  '&.cancel': {
    background: '#F48A33',
  },
  '&.cancel:hover': {
    filter: 'brightness(0.95)',
  },
  '&.certify, &.edit': {
    background: '#2586D6',
  },
  '&.certify:hover': {
    filter: 'brightness(0.95)',
  },
  '&.delete': {
    background: '#DC2626',
  },
});

const MetaGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr auto', // 좌측: 기간 / 우측: 상태+참여자 묶음
  alignItems: 'center',
  gap: 12,
});

const MetaItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 32, // 상태-참여자 사이 간격
  '& label': {
    display: 'block',
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  '& p': {
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
  },
  '&.single': {
    // 기간처럼 단독으로 쓰이는 경우
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0,
  },
});

const Desc = styled('div')({
  marginTop: 14,
  color: '#374151',
  lineHeight: 1.6,
  '& p': {
    marginBottom: 12,
  },
});

/* === 추가: 수정/삭제 버튼 영역 === */
const UpDelBtns = styled('div')({
  marginTop: 24,
  display: 'flex',
  justifyContent: 'center',
  gap: 38,
});

const ChallengeListCss = {
  Root,
  Container,
  Content,
  Main,
  ChallImage,
  Details,
  Title,
  ActionsRow,
  Button,
  MetaGrid,
  MetaItem,
  Desc,
  UpDelBtns,
};

export default ChallengeListCss;
