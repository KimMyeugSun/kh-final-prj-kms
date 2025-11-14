import { Route } from 'react-router-dom';
import ManagementGate from '../pages/management/ManagementGate';

//!< 관리자 페이지
//!< 대시보드
import ManagerDashboard from '../pages/management/dashboard/ManagerDashboard';

//!< 직원 조회
import EmployeeLookUp from '../pages/management/empmanagement/EmployeeLookUp';
import EmployeeLookAt from '../pages/management/empmanagement/EmployeeLookAt';

//!< 챌린지 관리
import ChallengeListManagement from '../pages/management/challenge/ChallengeListManagement';
import ChallengeDetailManagement from '../pages/management/challenge/ChallengeDetailManagement';
import ChallengeCertifyManagement from '../pages/management/challenge/ChallengeCertifyManagement';

//!< 지킴이몰 관리
import MallListManagement from '../pages/management/mall/MallListManagement';
import MallDetailManagement from '../pages/management/mall/MallDetailManagement';
import MallOrderManagement from '../pages/management/mall/MallOrderManagement';
import MallOrderDetailManagement from '../pages/management/mall/MallOrderDetailManagement';

//!< 공지사항
import ManagmentNoticeBoardList from '../pages/management/notice_faq/notice/ManagementNoticeBoardList';
import ManagementNoticeBoardInsert from '../pages/management/notice_faq/notice/ManagementNoticeBoardInsert';
import ManagementNoticeBoardLookAt from '../pages/management/notice_faq/notice/ManagementNoticeBoardLookAt';
// import ManagementNoticeBoardEdit from '../pages/management/notice_faq/notice/ManagementNoticeBoardEdit';

//!< FAQ
import ManagementFaqList from '../pages/management/notice_faq/faq/ManagementFaqList';
import ManagementFaqInsert from '../pages/management/notice_faq/faq/ManagementFaqInsert';
import ManagementFaqLookAt from '../pages/management/notice_faq/faq/ManagementFaqLookAt';
import ManagementFaqEdit from '../pages/management/notice_faq/faq/ManagementFaqEdit';

// 건강게시판
import HealthBoardLookUp from '../pages/management/healthBoard/HealthBoardLookUp';
import HealthBoardInsert from '../pages/management/healthBoard/HealthBoardInsert';
import HealthBoardDetail from '../pages/management/healthBoard/HealthBoardDetail';
// 동호회 관리
import ClubCreationRequestM from '../pages/management/club/ClubCreationRequestM';
import ClubReport from '../pages/management/club/ClubReport';

const managementRoutes = [
  <Route path="/management" element={<ManagementGate />}>
    <Route index element={<ManagerDashboard />} />
    <Route path="/management/dashboard" element={<ManagerDashboard />} />
    <Route path="/management/employee">
      <Route index element={<EmployeeLookUp />} />
      <Route path="lookup/:page" element={<EmployeeLookUp />} />
      <Route path="lookat/:eno" element={<EmployeeLookAt />} />
    </Route>
    {/* 챌린지 */}
    <Route path="/management/challenge">
      <Route path="list" index element={<ChallengeListManagement />} />
      <Route path=":id" element={<ChallengeDetailManagement />} />
      <Route
        path=":cid/certify/:eid"
        element={<ChallengeCertifyManagement />}
      />
    </Route>
    {/* 지킴이몰 */}
    <Route path="/management/mall">
      <Route index element={<MallListManagement />} />
      <Route path="list" element={<MallListManagement />} />
      <Route path=":id" element={<MallDetailManagement />} />
      <Route path="order-list" element={<MallOrderManagement />} />
      <Route path="order-detail/:id" element={<MallOrderDetailManagement />} />
    </Route>
    {/* 공지사항 관리 */}
    <Route path="/management/notice_faq">
      <Route index element={<ManagmentNoticeBoardList />} />
      <Route path="notice/:page" element={<ManagmentNoticeBoardList />} />
      <Route path="notice/insert" element={<ManagementNoticeBoardInsert />} />
      <Route path="notice/lookat/:id" element={<ManagementNoticeBoardLookAt />} />
      {/* <Route path="notice/edit/:id" element={<ManagementNoticeBoardEdit />} /> */}
      <Route path="faq/:page" element={<ManagementFaqList />} />
      <Route path="faq/lookat/:id" element={<ManagementFaqLookAt />} />
      <Route path="faq/insert" element={<ManagementFaqInsert />} />
      <Route path="faq/edit/:id" element={<ManagementFaqEdit />} />
    </Route>
    {/* 건강게시판 */}
    <Route path="/management/health_board">
      <Route index element={<HealthBoardLookUp />} />
      <Route path=":page" element={<HealthBoardLookUp />} />
      <Route path="insert" element={<HealthBoardInsert />} />
      <Route path="lookat/:no" element={<HealthBoardDetail />} />
    </Route>
    {/* 동호회 관리 */}
    <Route
      path="/management/club/creation-request-management/:page"
      element={<ClubCreationRequestM />}
    />
    <Route path="/management/club/report/:page" element={<ClubReport />} />
  </Route>,
];

export default managementRoutes;
