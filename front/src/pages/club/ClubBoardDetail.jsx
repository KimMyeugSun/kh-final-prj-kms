import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  TextField,
  Tooltip,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import authFetch from '../../utils/authFetch';
import CommonPagination from '../../components/commons/Pagination';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import ReportModal from './modals/ReportModal';
import CommonSnackbar from '../../components/commons/CommonSnackbar';

const ClubBoardDetail = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [cTotalPages, setCTotalPages] = useState(1);
  const [commentValue, setCommentValue] = useState('');
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [cPage, setCPage] = useState(Number(searchParams.get('page') || 1));
  const { getEmpNo } = useAuth();
  const [able, setAble] = useState(true);
  const eno = getEmpNo();
  const [write, setWrite] = useState('');
  const handleClose = () => setOpen(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // 댓글 등록 후 리렌더링을 위해 댓글 불러오는 패치를 따로 함수로 뺌(게시글 상세조회, 댓글 등록 후 사용됨)
  async function fetchComments(page = cPage) {
    const cResp = await authFetch(`/api/club/comment/${postId}?page=${page}`);
    if (!cResp.ok) throw new Error('댓글 조회 실패');
    const cData = await cResp.json();
    const cDataAddBc = (Array.isArray(cData.data) ? cData.data : []).map(
      (comment) => {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return { ...comment, color: `rgb(${red}, ${green}, ${blue})` };
      }
    );
    setComments(cDataAddBc);
    setCTotalPages(Number(cData.totalPages ?? 1));
  }

  // --- 게시글 + 댓글 로딩
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);

        // 게시글 조회
        const postResp = await authFetch(`/api/club/board/${postId}/${eno}`);
        if (!postResp.ok) throw new Error('게시글 조회 실패');
        const postData = await postResp.json();
        setData(postData);

        setLiked(postData.liked);
        // 댓글 조회
        await fetchComments(cPage);
      } catch (e) {
        if (!ignore) {
          console.error(e);
          setData({});
          setLiked(false);
          setComments([]);
          setCTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [postId, cPage]);

  // --- 게시글 좋아요 토글
  async function handleLikePost() {
    setAble(false);
    const devUrl = `/api/club/board/like/${postId}`;
    const option = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eno),
    };
    authFetch(devUrl, option)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('좋아요를 못 눌렀어요');
        } else {
          return resp.text();
        }
      })
      .then(() => {
        setLiked((prev) => !prev);
        setData((d) => ({
          ...d,
          likeCnt: d.likeCnt + (liked ? -1 : 1),
        }));
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setAble(true);
      });
  }

  // --- 댓글 좋아요
  async function handleLikeComment(id) {
    setAble(false);
    try {
      const resp = await authFetch(
        `/api/club/board/${postId}/comments/${id}/like`,
        { method: 'POST' }
      );
      if (!resp.ok) throw new Error('댓글 좋아요 실패');
      setComments((list) =>
        list.map((c) =>
          c.no === id ? { ...c, likeCnt: (c.likeCnt ?? 0) + 1 } : c
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setAble(true);
    }
  }

  // --- 댓글 등록
  async function handleSubmitComment() {
    const text = commentValue.trim();
    const commentReqDto = {
      eno: eno,
      bno: postId,
      comment: text,
    };
    if (!text) {
      setSnackbar({
        open: true,
        message: '댓글이 비어있습니다.',
        severity: 'error',
      });
      return;
    }
    const devUrl = `/api/club/comment`;
    const option = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentReqDto),
    };
    authFetch(devUrl, option)
      .then((resp) => {
        if (!resp.ok) throw new Error('댓글 등록 실패');
        else {
          return resp.text();
        }
      })
      .then((data) => {
        alert(data);
        setCommentValue('');
        const sp = new URLSearchParams(searchParams);
        sp.set('page', '1');
        setSearchParams(sp);
        setCPage(1);
        fetchComments(1);
      })
      .catch((e) => {
        console.error(e);
        alert('댓글 등록에 실패했어요.');
      });
  }
  // --- 수정 창으로 변경하기
  function changeEditMode() {
    setWrite(data.content ?? '');
    setEditMode(true);
  }
  // 수정 내용
  function handleChange(evt) {
    setWrite(evt.target.value);
  }
  // 수정
  function onEdit(evt) {
    evt.preventDefault();
    const eno = getEmpNo();

    if (write.length <= 0 || write.length > 1001) {
      openSnack('내용이 없거나 너무 길게 작성했습니다', 'warning');
      return;
    }
    const reqDto = {
      content: write,
      eno: eno,
    };
    const devUrl = `/api/club/board/${postId}`;
    const option = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqDto),
    };

    authFetch(devUrl, option)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('게시글 수정에 실패했습니다.');
        } else {
          return resp.json();
        }
      })
      .then((data) => {
        setSnackbar({
          open: true,
          message: data.msg,
          severity: 'success',
        });
        setTimeout(() => {
          navigate(0);
        }, 800);
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: '수정에 실패했습니다.',
          severity: 'error',
        });
        console.log(err);
      })
      .finally(() => {
        setEditMode(false);
      });
  }

  // --- 삭제
  async function onDelete() {
    if (!confirm('정말 삭제하시겠어요?')) return;
    const reqDto = { eno: eno };
    try {
      const resp = await authFetch(`/api/club/board/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqDto),
      });
      if (!resp.ok) throw new Error('삭제 실패');
      const data = resp.json();
      data.then(({ msg, cno }) => {
        openSnack(msg, 'success');
        navigate(`/club/board/${cno}/page/1`);
      });
    } catch (e) {
      openSnack('삭제에 실패했습니다', 'error');
      console.error(e);
    }
  }

  // --- 페이지 변경
  function handleChangePage(_e, value) {
    if (cPage === value) return;
    setCPage(value);
    const sp = new URLSearchParams(searchParams);
    sp.set('page', String(value));
    setSearchParams(sp);
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (editMode) {
    return (
      <>
        <Stack direction={'column'}>
          <Stack direction={'row'}>
            <Typography
              variant="subtitle1"
              sx={{ minWidth: 96, color: 'text.secondary' }}
            >
              게시글 제목 :
            </Typography>
            <Typography variant="subtitle1"> &nbsp; {data.title}</Typography>
          </Stack>
          <br />
          <TextField
            multiline
            rows={4}
            name="content"
            onChange={handleChange}
            value={write}
          />
          <br />
          <Stack flexDirection={'row'} justifyContent={'end'}>
            <Button variant="contained" onClick={onEdit}>
              저장하기
            </Button>
            &nbsp;
            <Button
              variant="contained"
              onClick={() => {
                setEditMode(false);
                setWrite('');
              }}
            >
              취소하기
            </Button>
          </Stack>
        </Stack>
        <CommonSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        />
      </>
    );
  }

  // 신고하기
  const handleReportPost = () => {
    setSnackbar({
      open: true,
      message: '댓글이 신고되었습니다.',
      severity: 'success',
    });
  };

  return (
    <>
      <ReportModal
        open={open}
        onClose={handleClose}
        loading={loading}
      ></ReportModal>

      <Stack spacing={2}>
        <CommonSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        />
        <Button
          sx={{ placeSelf: 'start' }}
          color="info"
          onClick={() => {
            navigate(-1);
          }}
        >
          뒤로가기
        </Button>
        <Paper sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent={'space-between'}
            sx={{ mb: 1 }}
          >
            <Stack direction={'row'}>
              <Typography
                variant="subtitle1"
                sx={{ minWidth: 96, color: 'text.secondary' }}
              >
                게시글 제목 :
              </Typography>
              <Typography variant="subtitle1"> &nbsp; {data.title}</Typography>
            </Stack>

            <Stack direction={'row'}>
              <Typography
                variant="subtitle2"
                sx={{ minWidth: 96, color: 'text.secondary' }}
              >
                작성자 : &nbsp;
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ minWidth: 96, color: 'text.secondary' }}
              >
                {data.writerName}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ position: 'relative' }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 1, position: 'absolute', right: '3px', top: '3px' }}
            >
              {data.createAt.split('T')[0]}&nbsp;
              {data.createAt.split('T')[1].split('.')[0]}
            </Typography>
          </Stack>

          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-line', minHeight: 120, mt: 2 }}
          >
            {data.content}
          </Typography>

          {eno == data.eno ? (
            <Stack
              direction="row"
              alignItems={'center'}
              style={{ placeSelf: 'end' }}
            >
              <IconButton size="small" color="error">
                <FavoriteIcon />
              </IconButton>
              &nbsp;
              <Typography variant="body2">{data.likeCnt}</Typography>
            </Stack>
          ) : (
            <div style={{ placeSelf: 'end' }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mt: 1, position: 'relative' }}
              >
                <Tooltip title="좋아요">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleLikePost}
                    disabled={!able}
                    onDoubleClick={() => {
                      return false;
                    }}
                  >
                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
                <Typography variant="body2">{data.likeCnt}</Typography>

                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

                <Tooltip title="신고하기">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <ReportProblemOutlinedIcon color="warning" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </div>
          )}
        </Paper>

        {/* 댓글 영역 */}
        <Typography variant="subtitle1">댓글</Typography>
        <Paper sx={{ p: 1 }}>
          <List disablePadding>
            {comments.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                아직 댓글이 없어요.
              </Typography>
            )}
            {comments.map((c) => (
              <React.Fragment key={c.no}>
                <ListItem alignItems="flex-start" disableGutters sx={{ py: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: c.color }}>
                      {c.writerName?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2">
                          {c.writerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {c.createdAt.split('T')[0]}&nbsp;
                          {c.createdAt.split('T')[1].split('.')[0]}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: 'pre-line', mt: 0.5 }}
                      >
                        {c.comment}
                      </Typography>
                    }
                  />
                  <Stack
                    direction={'row'}
                    alignItems="center"
                    sx={{ ml: 1, mt: 1.2 }}
                  >
                    {eno == c.eno ? (
                      <IconButton color="error">
                        <FavoriteIcon />
                        <br />
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleLikeComment(c.no)}
                        disabled={!able}
                        onDoubleClick={() => {
                          return false;
                        }}
                      >
                        {(c.likeCnt ?? 0) > 0 ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    )}

                    <Typography variant="caption" sx={{ marginTop: '5px' }}>
                      {c.likeCnt ?? 0}
                    </Typography>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ mx: 1, marginTop: '10px', height: '20px' }}
                    />
                    {eno == c.eno ? (
                      <Tooltip title="삭제하기">
                        <IconButton size="small" onClick={onDelete}>
                          <DeleteOutlineIcon color="warning" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="신고하기">
                        <IconButton size="small" onClick={handleReportPost}>
                          <ReportProblemOutlinedIcon color="warning" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>

          <CommonPagination
            page={cPage}
            count={cTotalPages}
            onChange={handleChangePage}
          />

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              placeholder="댓글을 입력하세요"
              multiline
              minRows={1}
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
            />
            <Button variant="contained" onClick={handleSubmitComment}>
              등록
            </Button>
          </Stack>
        </Paper>

        {String(eno) === String(data.eno) && (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={changeEditMode}>
              수정하기
            </Button>
            <Button variant="contained" color="error" onClick={onDelete}>
              삭제하기
            </Button>
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default ClubBoardDetail;
