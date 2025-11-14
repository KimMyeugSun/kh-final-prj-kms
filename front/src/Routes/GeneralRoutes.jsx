import UserGate from '../pages/UserGate';
import { Navigate, Route } from 'react-router-dom';

//!< 페이지's import
//!< 대시보드
import DashBoard from '../pages/dashboard/DashBoard';

//!< 마이페이지's import
import HealthCheckupHistory from '../pages/mypage/HealthCheckupHistory';
import ResearchResult from '../pages/mypage/ResearchResult';
import WelfarePoint from '../pages/mypage/WelfarePoint';

//!< 랭킹's import
import LookUp from '../pages/ranking/LookUp';
import Reward from '../pages/ranking/Reward';

//!< 동호회's import
import Search from '../pages/club/Search';
import ClubBoard from '../pages/club/ClubBoard';
import CreationRequest from '../pages/club/CreationRequest';
import ClubBoardDetail from '../pages/club/ClubBoardDetail';
import BoardInsert from '../pages/club/BoardInsert';

//!< 리서치's import
import Research from '../pages/research/Research';

//!< 지킴이몰's import
import MallList from '../pages/mall/MallList';
import MallDetail from '../pages/mall/MallDetail';
import MallCart from '../pages/mall/MallCart';
import MallPayment from '../pages/mall/MallPayment';
import MallOrderList from '../pages/mall/MallOrderList';
import MallOrderDetail from '../pages/mall/MallOrderDetail';
import MallFavorites from '../pages/mall/MallFavorites';

//!< 생활습관's import
import Daily from '../pages/lifestyle/Daily';
import WorkOutMain from '../pages/lifestyle/workout/WorkoutMain';
import FoodMain from '../pages/lifestyle/food/FoodMain';
import FoodSearchResult from '../pages/lifestyle/food/FoodSearchResult';
import WorkoutSearchResult from '../pages/lifestyle/workout/WorkoutSearchResult';
import WorkoutDetail from '../pages/lifestyle/workout/WorkoutDetail';
import FoodDetail from '../pages/lifestyle/food/FoodDetail';

//!< 챌린지's import
import ChallengeList from '../pages/challenge/ChallengeList';
import ChallengeDetail from '../pages/challenge/ChallengeDetail';
import ChallengeCertify from '../pages/challenge/ChallengeCertify';

//!< 공지사항, FAQ import
import NoticeList from '../pages/notice/NoticeList';
import NoticeLookAt from '../pages/notice/NoticeLookAt';
import FaqList from '../pages/faq/FaqList';
import HealthBoardDetailUser from '../pages/healthBoard/HealthBoardDetailUser';

const generalRoutes = [
  <Route path="/" element={<UserGate />}>
    <Route index element={<DashBoard />} />

    <Route path="/dashboard" element={<DashBoard />} />

    <Route path="/mypage">
      <Route index element={<HealthCheckupHistory />} />
      <Route path="health-checkup-history" element={<HealthCheckupHistory />} />
      <Route path="research-result" element={<ResearchResult />} />
      <Route path="welfare-point/:page" element={<WelfarePoint />} />
    </Route>

    <Route path="/lifestyle">
      <Route index element={<Daily />} />
      <Route path="daily" element={<Daily />} />
      <Route path="food" element={<FoodMain />} />
      <Route path="food/search" element={<FoodSearchResult />} />
      <Route path="food/:foodName" element={<FoodDetail />} />
      <Route path="workout" element={<WorkOutMain />} />
      <Route path="workout/search" element={<WorkoutSearchResult />} />
      <Route path="workout/:workoutName" element={<WorkoutDetail />} />
    </Route>

    <Route path="/ranking">
      <Route path="lookup" element={<LookUp />} />
      <Route path="reward" element={<Reward />} />
    </Route>

    {/*동호회 게시판*/}
    <Route path="/club/search">
      <Route index element={<Search />} />
      <Route path="page/:page" element={<Search />} />
    </Route>
    <Route path="/club/board">
      <Route path=":category">
        <Route index element={<ClubBoard />} />
        <Route path="page/:page" element={<ClubBoard />} />
        <Route path="post/:postId" element={<ClubBoardDetail />} />
        <Route path="insert" element={<BoardInsert />} />
      </Route>
    </Route>
    <Route path="/club/creation-request" element={<CreationRequest />} />
    {/* 리서치 */}
    <Route path="/research">
      <Route index element={<Navigate to="LIFESTYLE" replace />} />
      <Route path=":category" element={<Research />} />
    </Route>

    {/* 챌린지 */}
    <Route path="/challenge">
      <Route path="list" index element={<ChallengeList />} />
      <Route path=":id" element={<ChallengeDetail />} />
      <Route path=":cid/certify/:eid" element={<ChallengeCertify />} />
    </Route>

    {/* 지킴이몰 */}
    <Route path="/mall">
      <Route path="list" index element={<MallList />} />
      <Route path=":id" element={<MallDetail />} />
      <Route path="cart" element={<MallCart />} />
      <Route path="payment" element={<MallPayment />} />
      <Route path="order-list" element={<MallOrderList />} />
      <Route path="order-detail/:id" element={<MallOrderDetail />} />
      <Route path="favorites" element={<MallFavorites />} />
    </Route>
    {/* 건강게시판 */}
    <Route path="/healthBoard/:no" element={<HealthBoardDetailUser />}></Route>
    <Route path="/notice">
      <Route index element={<NoticeList />} />
      <Route path="list/:page" element={<NoticeList />} />
      <Route path="lookat/:id" element={<NoticeLookAt />} />
    </Route>
    <Route path="/faq">
      <Route index element={<FaqList />} />
      <Route path="list" element={<FaqList />} />
    </Route>
  </Route>,
];

export default generalRoutes;
