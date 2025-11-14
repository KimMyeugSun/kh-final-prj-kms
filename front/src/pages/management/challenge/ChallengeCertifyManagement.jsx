import React, { useMemo, useState, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import ChallengeCalendar from '../../../components/challenge/ChallengeCalendar';
import ChallengeCertifyApprovalModal from './modal/ChellengeCertifyApprovalModal';
import PageTitle from '../../../define/styles/jgj/PageTitle';
import { useParams } from 'react-router-dom';
import authFetch from '../../../utils/authFetch';
import CommonSnackbar from '../../../components/commons/CommonSnackbar.jsx';
import { Box, Tooltip } from '@mui/material';

const { VITE_S3_URL, VITE_S3_CHALLENGE_CERT_IMG } = import.meta.env;

const ChallengeCertifyManagement = () => {
  // cno, eno
  const { cid, eid } = useParams();
  const cno = Number(cid);
  const eno = Number(eid);

  const [participant, setParticipant] = useState({ empId: '', empName: '' });
  const [certMap, setCertMap] = useState(() => ({}));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null); // YYYY-MM-DD
  const [existingCert, setExistingCert] = useState(null); // 수정/삭제용

  // 스낵바
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // 인증 기록 불러오기 fetch
  const fetchCertRecords = () => {
    if (!cno || !eno) {
      setSnackbar({
        open: true,
        message: '챌린지 번호 또는 사번을 확인해주세요.',
        severity: 'error',
      });
      return;
    }

    const url = `/api/challengeCertRecord/${cno}/participant/${eno}/cert-records`;

    authFetch(url)
      .then((resp) => resp.json())
      .then((result) => {
        const map = {};
        result.data.forEach((elem) => {
          const key = dayjs(elem.createdAt).format('YYYY-MM-DD');
          map[key] = {
            id: elem.no,
            content: elem.content,
            imageUrl: buildChallengeImgUrl(elem.url),
            createdAt: elem.createdAt,
            updatedAt: elem.updatedAt,
            isApproved: elem.isApproved,
          };
        });
        setCertMap(map);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // empId, empName 조회 fetch
  const fetchParticipantInfo = () => {
    const url = `/management/api/employee/${eno}/cert-info`;
    const option = {};

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.success) {
          setParticipant({
            empId: result.data.empId,
            empName: result.data.empName,
          });
        }
      });
  };

  useEffect(() => {
    fetchCertRecords();
    fetchParticipantInfo();
  }, []);

  const handleOpenForDate = useCallback(
    (dateObj) => {
      const key = dayjs(dateObj).format('YYYY-MM-DD');
      const cert = certMap[key];

      const isToday = dayjs(key).isSame(dayjs(), 'day');

      if (cert) {
        setSelectedKey(key);
        setExistingCert(cert);
        setModalOpen(true);
        return;
      }

      if (isToday) {
        setSelectedKey(key);
        setExistingCert(null);
        setModalOpen(true);
        return;
      }

      setSnackbar({
        open: true,
        message: '해당 날짜에는 등록된 인증이 없습니다.',
        severity: 'error',
      });
    },
    [certMap]
  );

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setExistingCert(null);
    setSelectedKey(null);
  }, []);

  // 관리자 승인/승인취소 fetch
  const approve = (certId) => {
    const url = `/management/api/challengeCertRecord/approve-cert/${certId}`;
    authFetch(url, { method: 'PUT' })
      .then((resp) => resp.text())
      .then(() => {
        setCertMap((prev) => {
          const newMap = { ...prev };
          const key = selectedKey;
          if (newMap[key]) {
            newMap[key] = {
              ...newMap[key],
              isApproved: newMap[key].isApproved === 'Y' ? 'N' : 'Y',
            };
          }
          return newMap;
        });

        setSnackbar({
          open: true,
          message: '챌린지 인증 승인/승인취소가 처리되었습니다.',
          severity: 'success',
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 캘린더에 줄 데이터
  const calendarData = useMemo(() => certMap, [certMap]);

  const buildChallengeImgUrl = (path) => {
    if (!path) return null;
    return VITE_S3_URL + VITE_S3_CHALLENGE_CERT_IMG + path;
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: 16,
          width: '70%',
          height: 700,
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 8,
          boxSizing: 'border-box',
          padding: 16,
        }}
      >
        <PageTitle>
          {participant.empName ? (
            <>
              <Tooltip title={`ID: ${participant.empId}`} arrow>
                <Box
                  component="span"
                  sx={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    px: 2,
                    py: 0.5,
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {participant.empName}
                </Box>
              </Tooltip>
              &nbsp;님의 챌린지 인증 관리
            </>
          ) : (
            '챌린지 인증 관리'
          )}
        </PageTitle>
        <ChallengeCalendar
          certMap={calendarData}
          onSelectDate={handleOpenForDate}
        />
        <ChallengeCertifyApprovalModal
          open={modalOpen}
          onClose={handleClose}
          dateKey={selectedKey}
          existing={!!existingCert}
          existingCert={existingCert}
          onApprove={approve}
        />
      </div>

      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
};

export default ChallengeCertifyManagement;
