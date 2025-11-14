import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import Groups3Icon from '@mui/icons-material/Groups3';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ScienceIcon from '@mui/icons-material/Science';
import FlagIcon from '@mui/icons-material/Flag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CampaignIcon from '@mui/icons-material/Campaign';
import HelpIcon from '@mui/icons-material/Help';

const generalMenuList = [
  {
    action: { type: 'navigate', path: 'dashboard' },
    label: '대시보드',
    icon: <HomeIcon />,
    useDivider: true,
  },
  {
    action: { type: 'navigate', path: 'mypage' },
    label: 'MyPage',
    icon: <PersonIcon />,
    useDivider: false,
    children: [
      {
        action: { type: 'navigate', path: 'mypage/health-checkup-history' },
        label: '개인 건강검진 이력',
      },
      // {
      //   action: { type: 'navigate', path: 'mypage/research-result' },
      //   label: '리서치 결과',
      // },
      {
        action: { type: 'navigate', path: 'mypage/welfare-point/1' },
        label: '복지포인트 이력',
      },
    ],
  },
  {
    action: { type: 'navigate', path: 'lifestyle' },
    label: '생활습관',
    icon: <ChecklistRtlIcon />,
    useDivider: false,
    children: [
      {
        action: { type: 'navigate', path: 'lifestyle/daily' },
        label: '일일목표',
      },
      {
        action: { type: 'navigate', path: 'lifestyle/food' },
        label: '음식',
      },
      {
        action: { type: 'navigate', path: 'lifestyle/workout' },
        label: '운동',
      },
    ],
  },
  {
    action: { type: 'navigate', path: 'ranking/lookup' },
    label: '랭킹',
    icon: <Groups3Icon />,
    useDivider: false,
  },
  {
    action: { type: 'navigate', path: 'club' },
    label: '동호회',
    icon: <DirectionsRunIcon />,
    useDivider: false,
    children: [
      {
        action: { type: 'navigate', path: 'club/search' },
        label: '동호회 찾기',
      },
      {
        action: { type: 'navigate', path: 'club/creation-request' },
        label: '동호회 창설 신청',
      },
    ],
  },
  {
    action: { type: 'navigate', path: 'research' },
    label: '리서치',
    icon: <ScienceIcon />,
    useDivider: false,
  },
  {
    action: { type: 'navigate', path: 'challenge/list' },
    label: '챌린지',
    icon: <FlagIcon />,
    useDivider: false,
  },
  {
    action: { type: 'modal', path: 'map' },
    label: '병의원/약국 찾기',
    icon: <MapIcon />,
    useDivider: false,
  },
  {
    action: { type: 'navigate', path: 'mall' },
    label: '지킴이몰',
    icon: <ShoppingCartIcon />,
    useDivider: false,
    children: [
      {
        action: { type: 'navigate', path: 'mall/list' },
        label: '상품목록',
      },
      {
        action: { type: 'navigate', path: 'mall/cart' },
        label: '장바구니',
      },
      {
        action: { type: 'navigate', path: 'mall/order-list' },
        label: '주문목록',
      },
      {
        action: { type: 'navigate', path: 'mall/favorites' },
        label: '찜한목록',
      },
    ],
  },
  {
    action: { type: 'navigate', path: 'notice/list/1' },
    label: '공지사항',
    icon: <CampaignIcon />,
    useDivider: false,
  },
  {
    action: { type: 'navigate', path: 'faq/list' },
    label: 'FAQ',
    icon: <HelpIcon />,
    useDivider: false,
  },
];

export default generalMenuList;
