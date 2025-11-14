import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const Section = styled('section')({
  maxWidth: 1200,
  margin: '40px auto',
  padding: '0 20px',
  userSelect: 'none',
});

const ActionsRow = styled('div')({
  display: 'flex',
  gap: 12,
  marginTop: 12,
  marginBottom: 24,
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
});

const CardGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 20,
});

const CardLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  border: `3px solid ${theme.palette.divider}`,
  borderRadius: 12,
  padding: 16,
  color: theme.palette.text.primary,
  textDecoration: 'none',
  boxShadow: theme.shadows[2],
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const Thumb = styled('img')({
  width: '100%',
  height: 160,
  borderRadius: 8,
  objectFit: 'contain',
});

const Title = styled('h3')({
  margin: 0,
  fontSize: 18,
  fontWeight: 700,
  textAlign: 'center',
});

const Desc = styled('p')({
  margin: '4px 0 0',
  fontSize: 14,
  lineHeight: 1.4,
});

const Detail = styled('div')({
  marginTop: 'auto',
  fontSize: 13,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

const DetailTop = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Divider = styled('hr')(({ theme }) => ({
  width: '100%',
  border: `1px solid ${theme.palette.divider}`,
  margin: '12px 0',
}));

const EndCardLink = styled(CardLink)({
  position: 'relative',
  color: 'black',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    zIndex: 1,
    pointerEvents: 'none',
  },
});

const OverlayText = styled('div')({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#000000',
  fontWeight: 900,
  fontSize: 20,
  textAlign: 'center',
  zIndex: 2,
  transform: 'translateY(-50px)',
});

const ChallengeListCss = {
  Section,
  ActionsRow,
  CardGrid,
  CardLink,
  Thumb,
  Title,
  Desc,
  Detail,
  DetailTop,
  Divider,
  EndCardLink,
  OverlayText,
};

export default ChallengeListCss;
