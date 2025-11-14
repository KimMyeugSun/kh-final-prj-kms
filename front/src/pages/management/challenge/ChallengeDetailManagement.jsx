import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import PageTitle from '../../../define/styles/jgj/PageTitle';
import Css from '../../../define/styles/jgj/challenge/ChallengeDetailCss';
import ChallengeParticipantModal from './modal/ChallengeParticipantModal.jsx';
import ChallengeUpdateModal from './modal/ChallengeUpdateModal.jsx';
import authFetch from '../../../utils/authFetch';
import { useAuth } from '../../../auth/useAuth';
import CommonSnackbar from '../../../components/commons/CommonSnackbar.jsx';

const { VITE_S3_URL, VITE_S3_CHALLENGE_IMG } = import.meta.env;

const ChallengeDetailManagement = () => {
  const { getEmpNo } = useAuth();
  const navigate = useNavigate();

  // url 파라미터에서 no 가져오기
  const { id } = useParams();
  const no = Number(id);

  // eno 가져오기
  const eno = Number(getEmpNo());

  // 챌린지 참가자 목록
  const [openParticipants, setOpenParticipants] = useState(false);
  const [ptLoading, setPtLoading] = useState(false);
  const [ptError, setPtError] = useState(null);
  const [ptKeyword, setPtKeyword] = useState('');
  const [ptPage, setPtPage] = useState({
    content: [],
    number: 0, // 현재 페이지 (0-base)
    size: 5, // 페이지 크기
    totalPages: 1, // 총 페이지 수
    totalElements: 0, // 총 건수
  });

  // 챌린지 상세조회
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 챌린지 수정
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    title: detail?.title ?? '',
    description: detail?.description ?? '',
    status: detail?.status ?? 'PLANNED',
    startDate: detail?.startDate ?? '',
    endDate: detail?.endDate ?? '',
    file: null,
  });

  // 스낵바
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    if (openUpdate && detail) {
      setUpdateForm({
        title: detail.title ?? '',
        description: detail.description ?? '',
        status: detail.status ?? 'PLANNED',
        startDate: detail.startDate ?? '',
        endDate: detail.endDate ?? '',
        file: null,
      });
    }
  }, [openUpdate, detail]);

  // 날짜 포맷 유틸
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

  // 챌린지 상세조회 fetch
  useEffect(() => {
    const url = `/api/challenge/${no}/${eno}`;
    const option = {};

    setLoading(true);
    setError(null);

    authFetch(url, option)
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
      .finally(() => {
        setLoading(false);
      });
  }, [no]);

  // detail에서 UI에 사용할 값 매핑
  const title = detail?.title ?? detail?.name ?? '챌린지';
  const desc = detail?.desc ?? detail?.description ?? '챌린지 설명이 없습니다.';

  const start = detail?.startDate ?? detail?.startAt;
  const end = detail?.endDate ?? detail?.endAt;
  const periodText =
    detail?.period ??
    (start && end
      ? `${fmt(start)} ~ ${fmt(end)} (${daysDiff(start, end)}일)`
      : '기간 정보 없음');

  // 챌린지 참가자 목록 보기 fetch
  const fetchParticipants = (opts = {}) => {
    const {
      page = ptPage.number,
      size = ptPage.size,
      keyword = ptKeyword,
    } = opts;

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('size', String(size));
    params.append('sort', 'no,desc');
    if (keyword && keyword.trim()) {
      params.set('keyword', keyword.trim());
    }

    setPtLoading(true);
    setPtError(null);

    return authFetch(
      `/management/api/challengeParticipant/${no}?${params.toString()}`
    )
      .then((resp) => resp.json())
      .then((result) => {
        const data = result.data;
        const normalized = (data.content ?? []).map((it) => ({
          eno: it.eno ?? null,
          empId: it.empId ?? '',
          empName: it.empName ?? '',
          _raw: it,
        }));

        setPtPage({
          content: normalized,
          number: data.number ?? page,
          size: data.size ?? size,
          totalPages: data.totalPages ?? 1,
          totalElements: data.totalElements ?? normalized.length,
        });
        setPtKeyword(keyword);

        return data;
      })
      .catch((err) => {
        console.error(err);
        setPtError(err);
        return null;
      })
      .finally(() => {
        setPtLoading(false);
      });
  };

  // 버튼 클릭 시 모달 열고 첫 페이지 불러오기
  const openParticipantsModal = () => {
    setOpenParticipants(true);
    fetchParticipants({ page: 0 });
  };

  // ImgUrl
  const buildChallengeImgUrl = (path) => {
    if (!path) return null;
    return VITE_S3_URL + VITE_S3_CHALLENGE_IMG + path;
  };

  const imageSrc = useMemo(
    () => buildChallengeImgUrl(detail?.url),
    [detail?.url]
  );

  // 챌린지 수정 처리
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 제출 핸들러
  const handleUpdateSubmit = () => {
    const fd = new FormData();
    fd.append('title', updateForm.title);
    fd.append('description', updateForm.description);
    fd.append('status', updateForm.status);
    fd.append('startDate', updateForm.startDate);
    fd.append('endDate', updateForm.endDate);
    if (updateForm.file) {
      fd.append('file', updateForm.file);
    }

    authFetch(`/management/api/challenge/${no}`, {
      method: 'PUT',
      body: fd,
    })
      .then((resp) => resp.json())
      .then((result) => {
        if (result.success) {
          setSnackbar({
            open: true,
            message: '챌린지가 수정되었습니다.',
            severity: 'success',
          });

          setDetail(result.data);
          setOpenUpdate(false);
        }
      })
      .catch((err) => console.log(err));
  };

  // 삭제 메서드
  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    const url = `/api/challenge/${no}`;
    const option = {
      method: 'DELETE',
    };

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.success) {
          setSnackbar({
            open: true,
            message: '챌린지가 삭제되었습니다.',
            severity: 'success',
          });
          navigate('/management/challenge/list');
        }
      })
      .catch((err) => console.log(err));
  };

  // 로딩/에러 처리
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

  return (
    <Css.Root>
      <Css.Container>
        <Css.Main>
          <Css.Content>
            <PageTitle>챌린지 상세조회</PageTitle>
            <Css.ActionsRow>
              <Css.Button className="list" onClick={openParticipantsModal}>
                챌린지 참가자 목록
              </Css.Button>
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
                  <Css.MetaItem
                    className="single"
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {statusChip(detail?.status)}
                  </Css.MetaItem>
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

              {eno === 0 && (
                <Css.UpDelBtns>
                  <Css.Button
                    className="edit"
                    onClick={() => {
                      setOpenUpdate(true);
                    }}
                  >
                    수정
                  </Css.Button>
                  <Css.Button className="delete" onClick={handleDelete}>
                    삭제
                  </Css.Button>
                </Css.UpDelBtns>
              )}
            </Css.Details>
          </Css.Content>
        </Css.Main>
      </Css.Container>

      <ChallengeParticipantModal
        open={openParticipants}
        onClose={() => {
          setOpenParticipants(false);
          setPtKeyword('');
        }}
        participants={ptPage.content}
        loading={ptLoading}
        error={ptError}
        keyword={ptKeyword}
        onSearch={(kw) => fetchParticipants({ page: 0, keyword: kw })}
        page={ptPage.number}
        pageSize={ptPage.size}
        totalPages={ptPage.totalPages}
        totalElements={ptPage.totalElements}
        onPageChange={(nextPage) => fetchParticipants({ page: nextPage })}
        onPageSizeChange={(nextSize) =>
          fetchParticipants({ page: 0, size: nextSize })
        }
        cno={no}
      />

      <ChallengeUpdateModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        form={updateForm}
        onChange={handleUpdateChange}
        onSubmit={handleUpdateSubmit}
        imageUrl={buildChallengeImgUrl(detail?.url)}
      />

      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Css.Root>
  );
};

export default ChallengeDetailManagement;
