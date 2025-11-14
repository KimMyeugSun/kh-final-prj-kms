import React, { useState } from 'react';
import Modal from '../../../components/commons/Modal';
import { useAuth } from '../../../auth/useAuth';
import { Button, Typography } from '@mui/material';
import Profile from '../../../components/Profile';
import { makeImgProfileUrl } from '../../../utils/makeUrl';

/** * 프로필 수정 모달 컴포넌트
 * @param {boolean} isOpen - 모달 열림 상태
 * @param {function} setModalCtrl - 모달 열림 상태 변경 함수
 * 사용예시:
 * const [editModal, setEditModal] = useState(false);
 * <EditProfile isOpen={editModal} setModalCtrl={setEditModal} />
 */
const EditProfile = ({ isOpen, setModalCtrl }) => {
  const { getUser } = useAuth();
  const user = getUser();
  const [data, setData] = useState({
    empName: user?.name ?? '',
    empProfile: user?.profile ?? '',
    empDepartment: user?.employee?.empDepartment ?? '',
    empPosition: user?.employee?.empPosition ?? '',
    profile: user?.profile ?? '',
    tag: ['운동', '칼슘'], //!< 임시
    welfarePoints: 12000, //!< 임시
  });

  return (
    <>
      <Modal open={isOpen} onClose={() => setModalCtrl(false)} caption="프로필 수정">
        <Profile url={makeImgProfileUrl(data?.profile)} name={data?.empName} w={150} h={150} fs={75} />
      </Modal>

    </>
  );
};

export default EditProfile;
