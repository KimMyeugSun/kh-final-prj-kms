import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../define/styles/jgj/PageTitle';
import Css from '../../define/styles/jgj/challenge/ChallengeDetailCss';
import authFetch from '../../utils/authFetch';
import { useAuth } from '../../auth/useAuth';
import Chip from '@mui/material/Chip';
import CommonSnackbar from '../../components/commons/CommonSnackbar';

const { VITE_S3_URL, VITE_S3_CHALLENGE_IMG } = import.meta.env;

const ChallengeDetail = () => {
  const { getEmpNo } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();
  const no = Number(id);

  const eno = Number(getEmpNo());

  // 참가 상태
  const [joining, setJoining] = useState(false);

  // 상세 데이터
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 스낵바
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // 날짜 포맷
  const fmt = (d) => {
    if (!d) return '';
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return String(d);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };
  const daysDiff = (a, b) => {
    if (!a || !b) return '';
    const ms = Math.abs(new Date(b) - new Date(a));
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };

  // 상세조회
  useEffect(() => {
    const url = `/api/challenge/${no}/${eno}`;
    setLoading(true);
    setError(null);

    authFetch(url)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.success) {
          setDetail(result.data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [no, eno]);

  const title = detail?.title ?? detail?.name ?? '챌린지';
  const desc = detail?.desc ?? detail?.description ?? '챌린지 설명이 없습니다.';

  const start = detail?.startDate ?? detail?.startAt;
  const end = detail?.endDate ?? detail?.endAt;
  const periodText =
    detail?.period ??
    (start && end
      ? `${fmt(start)} ~ ${fmt(end)} (${daysDiff(start, end)}일)`
      : '기간 정보 없음');

  // 참여하기
  const handleJoin = () => {
    if (joining) return;
    setJoining(true);

    const url = '/api/challengeParticipant';
    const object = { cno: no, eno };

    authFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(object),
    })
      .then((resp) => resp.json())
      .then((result) => {
        if (result.success) {
          setSnackbar({
            open: true,
            message: '챌린지에 참여하셨습니다.',
            severity: 'success',
          });
          setDetail((prev) => ({
            ...prev,
            myStatus: 'ACTIVE',
          }));
        }
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: '챌린지 참여에 실패하였습니다.',
          severity: 'error',
        });
        console.error(err);
      })
      .finally(() => setJoining(false));
  };

  // 참여 취소
  const handleCancel = () => {
    const url = '/api/challengeParticipant/cancel';
    const object = { cno: no, eno };

    authFetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(object),
    })
      .then((resp) => resp.json())
      .then((result) => {
        if (result.success) {
          setSnackbar({
            open: true,
            message: '챌린지 참여가 취소되었습니다.',
            severity: 'success',
          });

          setDetail((prev) => ({
            ...prev,
            myStatus: 'CANCELLED',
          }));
        }
      })
      .catch((err) => console.log(err));
  };

  // 이미지
  const buildChallengeImgUrl = (path) => {
    if (!path) return null;
    return VITE_S3_URL + VITE_S3_CHALLENGE_IMG + path;
  };
  const imageSrc = useMemo(
    () => buildChallengeImgUrl(detail?.url),
    [detail?.url]
  );

  if (loading) {
    return (
      <Css.Root>
        <Css.Container>
          <Css.Main>
            <Css.Content>
              <PageTitle>챌린지 상세조회</PageTitle>
              <p>불러오는 중...</p>
            </Css.Content>
          </Css.Main>
        </Css.Container>
      </Css.Root>
    );
  }

  if (error) {
    return (
      <Css.Root>
        <Css.Container>
          <Css.Main>
            <Css.Content>
              <PageTitle>챌린지 상세조회</PageTitle>
              <p style={{ color: 'crimson' }}>
                데이터를 불러오지 못했습니다. {error.message}
              </p>
            </Css.Content>
          </Css.Main>
        </Css.Container>
      </Css.Root>
    );
  }

  const statusChip = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label="진행중" color="success" size="small" />;
      case 'PLANNED':
        return <Chip label="예정" color="default" size="small" />;
      case 'ENDED':
        return <Chip label="종료" color="error" size="small" />;
      default:
        return <Chip label="알 수 없음" size="small" />;
    }
  };

  return (
    <Css.Root>
      <Css.Container>
        <Css.Main>
          <Css.Content>
            <PageTitle>챌린지 상세조회</PageTitle>

            <Css.ActionsRow>
              {detail?.status === 'ACTIVE' && (
                <>
                  {detail?.myStatus === 'ACTIVE' && (
                    <>
                      <Css.Button
                        className="certify"
                        onClick={() =>
                          navigate(`/challenge/${no}/certify/${eno}`)
                        }
                      >
                        내 챌린지 인증
                      </Css.Button>

                      {detail?.myStatus === 'ACTIVE' && (
                        <Css.Button className="cancel" onClick={handleCancel}>
                          챌린지 참여 취소
                        </Css.Button>
                      )}
                    </>
                  )}

                  {detail?.myStatus !== 'ACTIVE' && (
                    <Css.Button
                      className="join"
                      onClick={handleJoin}
                      disabled={joining}
                    >
                      챌린지 참여
                    </Css.Button>
                  )}
                </>
              )}
            </Css.ActionsRow>

            {/* 이미지 */}
            <Css.ChallImage>
              <img src={imageSrc} alt={title} />
            </Css.ChallImage>

            {/* 세부사항 */}
            <Css.Details>
              <Css.Title>{title}</Css.Title>
              <br />

              <Css.MetaGrid>
                <Css.MetaItem className="single">
                  <label>기간</label>
                  <p>{periodText}</p>
                </Css.MetaItem>

                <Css.MetaItem>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {statusChip(detail?.status)}
                  </div>

                  {/* <div>
                    <label>참여자</label>
                    <p>{Number(participantCount).toLocaleString()}명</p>
                  </div> */}
                </Css.MetaItem>
              </Css.MetaGrid>

              <Css.Desc>
                {String(desc)
                  .split('\n')
                  .filter(Boolean)
                  .map((line, idx) => (
                    <p key={idx}>{line.trim()}</p>
                  ))}
              </Css.Desc>
            </Css.Details>
          </Css.Content>
        </Css.Main>
      </Css.Container>
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Css.Root>
  );
};

export default ChallengeDetail;
