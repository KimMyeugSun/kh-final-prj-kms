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
import NewspaperIcon from '@mui/icons-material/Newspaper';

const ManagementMenusList = [
  {
    action: { type: 'navigate', path: 'management/dashboard' },
    label: '대시보드',
    icon: <HomeIcon />,
    useDivider: true,
  },
  {
    action: { type: 'navigate', path: 'management/employee' },
    label: '사원 관리',
    icon: <PersonIcon />,
    useDivider: false,
    children: [
      {
        action: { type: 'navigate', path: 'management/employee/lookup/1' },
        label: '사원 목록 조회',
      },
    ],
  },
  {
    action: { type: 'navigate', path: 'management/club/report' },
    label: '동호회 관리',
    icon: <DirectionsRunIcon />,
    useDivider: false,
    children: [
      // {
      //   action: { type: 'navigate', path: 'management/club/report/1' },
      //   label: '동호회 신고 목록',
      // },
      {
        action: {
          type: 'navigate',
          path: 'management/club/creation-request-management/1',
        },
        label: '동호회 창설 요청 관리',
      },
    ],
  },
  // {
  //   action: { type: 'navigate', path: 'research-management' },
  //   label: '리서치 관리',
  //   icon: <ScienceIcon />,
  //   useDivider: false,
  // },
  {
    action: { type: 'navigate', path: 'management/challenge/list' },
    label: '챌린지 관리',
    icon: <FlagIcon />,
    useDivider: false,
  },
  {
    action: { type: 'navigate', path: 'management/mall' },
    label: '지킴이몰 관리',
    icon: <ShoppingCartIcon />,
    useDivider: false,
    children: [
      {
        action: { type: 'navigate', path: 'management/mall/list' },
        label: '상품 목록',
      },
      {
        action: { type: 'navigate', path: 'management/mall/order-list' },
        label: '주문 목록',
      },
    ],
  },
  {
    action: { type: 'navigate', path: '/management/health_board/1' },
    label: '건강게시판 관리',
    icon: <NewspaperIcon />,
    useDivider: false,
  },
  {
    action: { type: 'navigate', path: 'management/notice_faq' },
    label: '공지사항 & FAQ 관리',
    icon: <CampaignIcon />,
    useDivider: false,
    children: [
      {
        action: { type: 'navigate', path: '/management/notice_faq/notice/1' },
        label: '공지사항 목록',
      },
      {
        action: { type: 'navigate', path: '/management/notice_faq/faq/1' },
        label: 'FAQ 목록',
      },
    ],
  },
];

export default ManagementMenusList;
