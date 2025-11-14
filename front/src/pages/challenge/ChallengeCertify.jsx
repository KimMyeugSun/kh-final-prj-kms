import React, { useMemo, useState, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import ChallengeCalendar from '../../components/challenge/ChallengeCalendar';
import ChallengeCertifyModal from '../../components/challenge/ChallengeCertifyModal';
import PageTitle from '../../define/styles/jgj/PageTitle';
import { useParams } from 'react-router-dom';
import authFetch from '../../utils/authFetch';
import CommonSnackbar from '../../components/commons/CommonSnackbar';

const { VITE_S3_URL, VITE_S3_CHALLENGE_CERT_IMG } = import.meta.env;
const todayKey = () => dayjs().format('YYYY-MM-DD');

const ChallengeCertify = () => {
  // cno, eno
  const { cid, eid } = useParams();
  const cno = Number(cid);
  const eno = Number(eid);

  const [certMap, setCertMap] = useState(() => ({}));
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null); // YYYY-MM-DD
  const [existingCert, setExistingCert] = useState(null); // 수정/삭제용

  // snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // 인증 기록 불러오기 fetch
  useEffect(() => {
    if (!cno || !eno) {
      setSnackbar({
        open: true,
        message: '챌린지 번호 또는 사번을 확인해주세요.',
        severity: 'error',
      });
      return;
    }

    const url = `/api/challengeCertRecord/${cno}/participant/${eno}/cert-records`;
    const option = {};

    authFetch(url, option)
      .then((resp) => {
        return resp.json();
      })
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
        console.log(err);
      });
  }, [cno, eno]);

  const handleOpenForDate = useCallback(
    (dateObj) => {
      const key = dayjs(dateObj).format('YYYY-MM-DD');
      const cert = certMap[key];

      const isToday = dayjs(key).isSame(dayjs(), 'day');
      const isPast = dayjs(key).isBefore(dayjs(), 'day');

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
        severity: 'warning',
      });
    },
    [certMap]
  );

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setExistingCert(null);
    setSelectedKey(null);
  }, []);

  // 챌린지 인증 등록 fetch
  const handleCreate = (form) => {
    const url = '/api/challengeCertRecord';
    const fd = new FormData();
    fd.append('cno', cno);
    fd.append('eno', eno);
    fd.append('content', form.content);
    if (form.file) {
      fd.append('file', form.file);
    }

    const option = {
      method: 'POST',
      body: fd,
    };

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        const data = result.data;
        const key = dayjs(data.createdAt).format('YYYY-MM-DD');
        setCertMap((prev) => ({
          ...prev,
          [key]: {
            id: data.no,
            content: data.content,
            imageUrl: buildChallengeImgUrl(data.url),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            isApproved: data.isApproved,
          },
        }));
        setSnackbar({
          open: true,
          message: '챌린지 인증이 등록되었습니다.',
          severity: 'success',
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 챌린지 인증 수정 fetch
  const handleUpdate = (form) => {
    if (!selectedKey) return;
    const cert = certMap[selectedKey];
    if (!cert || !cert.id) return;

    const url = `/api/challengeCertRecord/${cert.id}`;
    const fd = new FormData();
    fd.append('cno', cno);
    fd.append('eno', eno);
    fd.append('content', form.content);
    if (form.file) {
      fd.append('file', form.file);
    }

    const option = {
      method: 'PUT',
      body: fd,
    };

    authFetch(url, option)
      .then((resp) => {
        return resp.json();
      })
      .then((result) => {
        const key = selectedKey ?? todayKey();
        const data = result.data;
        setCertMap((prev) => ({
          ...prev,
          [key]: {
            id: prev[key]?.id ?? data.no,
            content: data.content,
            imageUrl: buildChallengeImgUrl(data.url),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            isApproved: data.isApproved,
          },
        }));
        setSnackbar({
          open: true,
          message: '챌린지 인증이 수정되었습니다.',
          severity: 'success',
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 챌린지 인증 삭제 fetch
  const handleDelete = () => {
    if (!selectedKey) return;
    const cert = certMap[selectedKey];
    if (!cert || !cert.id) return;

    authFetch(`/api/challengeCertRecord/${cert.id}`, {
      method: 'DELETE',
    })
      .then((resp) => resp.text())
      .then((result) => {
        setCertMap((prev) => {
          const newMap = { ...prev };
          delete newMap[selectedKey];
          return newMap;
        });

        setSnackbar({
          open: true,
          message: '챌린지 인증이 삭제되었습니다.',
          severity: 'success',
        });
        handleClose();
      })
      .catch((err) => {
        console.error(err);
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
        <PageTitle>내 챌린지 인증</PageTitle>
        <ChallengeCalendar
          certMap={calendarData}
          onSelectDate={handleOpenForDate}
        />
        <ChallengeCertifyModal
          open={modalOpen}
          onClose={handleClose}
          dateKey={selectedKey}
          existing={!!existingCert}
          existingCert={existingCert}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
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

export default ChallengeCertify;
