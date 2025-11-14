import { CircularProgress } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authFetch from '../../../utils/authFetch';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
  Popper,
  Paper,
  List,
  ListItemButton,
} from '@mui/material';
import { useAuth } from '../../../auth/useAuth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditorToolbar from '../../../components/commons/EditorToolbar';
import CommonSnackbar from '../../../components/commons/CommonSnackbar';

// ★ dayjs 실제 사용하므로 import 추가
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

const HealthBoardDetail = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cno, setCno] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [exp, setIsExp] = useState(false);
  const [expFrom, setExpFrom] = useState(null);
  const [expTo, setExpTo] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // 해시태그 인풋 상태
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef(null); // 입력 캐럿/치환용 (유지)
  const fieldRef = useRef(null); // ★ Popper 앵커용 (신규, TextField root)

  const [suggestions, setSuggestions] = useState([]);
  const [openSuggest, setOpenSuggest] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const bno = location.href.split('/').pop();
  const editorRef = useRef();
  const { getEmpNo } = useAuth();
  const eno = getEmpNo();

  const navigate = useNavigate();
  const itemRefs = useRef([]); // 추천 항목 DOM 참조 저장

  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, suggestions]);

  // 카테고리 및 태그리스트 불러오기
  useEffect(() => {
    const devUrlCategory = `/management/api/health/category`;
    authFetch(devUrlCategory)
      .then((resp) => (resp.ok ? resp.json() : undefined))
      .then((data) => {
        if (data?.data) setCategoryList(data.data);
      });

    const devUrlTag = `/api/public/tag/list`;
    authFetch(devUrlTag)
      .then((resp) => (resp.ok ? resp.json() : undefined))
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('태그 데이터 없음');
        
        if (data?.tags) setTagList(data.tags);
      });
  }, []);

  const norm = (s) => s.replace(/\s|[-_]/g, '').toLowerCase();

  // 커서 앞의 마지막 #조각을 찾아 반환
  const getHashtagFragmentAtCaret = (text, caretPos) => {
    const left = text.slice(0, caretPos);
    const match = left.match(/(^|\s)(#([^\s#]*))$/);
    if (!match) return null;
    const fragmentWithHash = match[2];
    const fragment = match[3] || '';
    const start = left.length - fragmentWithHash.length;
    const end = left.length;
    return { start, end, fragment, withHash: fragmentWithHash };
  };

  // tagInput 변경 시 추천어 계산 + selectedTags 자동 추출
  const handleTagInputChange = (e) => {
    const text = e.target.value;
    setTagInput(text);

    const caret = e.target.selectionStart ?? text.length;
    const frag = getHashtagFragmentAtCaret(text, caret);

    if (frag) {
      const q = frag.fragment.trim();
      const base =
        q.length === 0
          ? tagList
          : tagList.filter((t) => norm(t).includes(norm(q)));

      const opts = base.sort((a, b) => {
        if (q.length === 0) return a.localeCompare(b);
        const sa = norm(a).startsWith(norm(q));
        const sb = norm(b).startsWith(norm(q));
        return sa === sb ? 0 : sa ? -1 : 1;
      });

      setSuggestions(opts);
      setOpenSuggest(opts.length > 0);
      setActiveIndex(0);
    } else {
      setOpenSuggest(false);
      setSuggestions([]);
    }

    const tags = Array.from(
      new Set((text.match(/#[^\s#]+/g) || []).map((s) => s.slice(1)))
    );
    setSelectedTags(tags);
  };

  const replaceFragment = (fullTag) => {
    const el = tagInputRef.current;
    if (!el) return;

    const caret = el.selectionStart ?? tagInput.length;
    const frag = getHashtagFragmentAtCaret(tagInput, caret);
    if (!frag) return;

    const before = tagInput.slice(0, frag.start);
    const after = tagInput.slice(frag.end);

    const newLeft = `${before}#${fullTag} `;
    const next = newLeft + after;

    setTagInput(next);
    setOpenSuggest(false);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newLeft.length, newLeft.length);
    });

    const tags = Array.from(
      new Set((next.match(/#[^\s#]+/g) || []).map((s) => s.slice(1)))
    );
    setSelectedTags(tags);
  };

  const handleTagKeyDown = (e) => {
    if (!openSuggest) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (suggestions.length > 0) {
        e.preventDefault();
        replaceFragment(suggestions[activeIndex] ?? suggestions[0]);
        setOpenSuggest(false);
      }
    } else if (e.key === 'Escape') {
      setOpenSuggest(false);
    }
  };

  const chipColors = [
    '#FFCDD2',
    '#F8BBD0',
    '#E1BEE7',
    '#D1C4E9',
    '#C5CAE9',
    '#BBDEFB',
    '#B2EBF2',
    '#C8E6C9',
    '#DCEDC8',
    '#FFF9C4',
    '#FFE0B2',
    '#FFCCBC',
  ];
  const hashString = (s) => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
    return h >>> 0;
  };
  const colorForTag = (tag) => {
    if (!tag) return chipColors[0];
    const idx = hashString(tag) % chipColors.length;
    return chipColors[idx];
  };

  const handleCancel = () => {
    authFetch(`/api/template-delete/${getEmpNo()}`, { method: 'DELETE' })
      .catch((err) => console.error('임시 이미지 삭제 중 오류 발생:', err))
      .finally(() => {
        navigate(`/management/health_board/1`);
      });
  };

  // 게시글 삭제
  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    const url = `/management/api/health/board/${bno}`;
    const option = {
      method: 'DELETE',
    };

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.success) {
          setSnackbar({
            open: true,
            message: '게시글이 삭제되었습니다.',
            severity: 'success',
          });
          navigate(`/management/health_board/1`);
        } else {
          setSnackbar({
            open: true,
            message: '게시글 삭제가 실패했습니다.',
            severity: 'error',
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // 게시글 불러오기
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    const devUrl = `/management/api/health/board/${bno}`;

    authFetch(devUrl)
      .then((resp) => {
        if (!resp.ok) throw new Error('게시글 조회에 실패했습니다.');
        return resp.json();
      })
      .then((json) => {
        if (ignore) return;
        const data = json.data;
        console.log(data);

        setTitle(data.title);
        setContent(data.content);
        setCno(data.cno);
        setIsExp(data.exp);
        setExpFrom(data.expFrom ? dayjs(data.expFrom) : null);
        setExpTo(data.expTo ? dayjs(data.expTo) : null);
        setSelectedTags(data.tags || []);
        setTagInput(
          data.tags && data.tags.length > 0
            ? data.tags.map((tag) => `#${tag}`).join(' ')
            : ''
        );
      })
      .catch((err) => {
        if (!ignore) console.log(err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [bno]);

  // 게시글 수정
  const handleSubmit = () => {
    const validTagSet = new Set(tagList.map((t) => norm(t)));
    const invalidTags = (selectedTags || []).filter(
      (t) => !validTagSet.has(norm(t))
    );

    if (invalidTags.length > 0) {
      setSnackbar({
        open: true,
        message: `${invalidTags.join(', ')} 는 등록되지 않은 태그입니다.`,
        severity: 'warning',
      });
      tagInputRef.current?.focus();
      return;
    }
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const uploadedFiles = editorRef.current?.getUploadedImages() || null;

    const reqDto = exp
      ? {
          eno,
          title,
          content,
          cno,
          imgUrl: uploadedFiles,
          tags: selectedTags,
          exp,
          expFrom: expFrom ? expFrom.format('YYYY-MM-DD') : null,
          expTo: expTo ? expTo.format('YYYY-MM-DD') : null,
        }
      : {
          eno,
          title,
          content,
          cno,
          exp,
          imgUrl: uploadedFiles,
          tags: selectedTags,
        };
    console.log(reqDto);

    const devUrl = `/management/api/health/board/${bno}`;
    authFetch(devUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqDto),
    })
      .then((resp) => {
        if (resp.ok) {
          setSnackbar({
            open: true,
            message: '게시글이 수정되었습니다.',
            severity: 'success',
          });
          navigate(`/management/health_board/lookat/${bno}`);
        }
      })
      .catch((err) => {
        console.error('게시글 수정 중 오류 발생:', err);
        handleCancel();
      });
  };

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
          userSelect: 'none',
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box m={2} height="calc(100vh - 130px)" sx={{ userSelect: 'none' }}>
      <Box
        sx={{
          width: '100%',
          height: 'calc(100% - 130px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mt: 2,
        }}
      >
        <Stack direction={'row'} justifyContent={'left'} sx={{ width: '60%' }}>
          <FormControl sx={{ width: '20%' }}>
            <InputLabel id="health-category" size="small">
              카테고리
            </InputLabel>
            <Select
              labelId="health-category"
              id="health-category-select"
              value={cno}
              label="카테고리"
              onChange={(e) => setCno(e.target.value)}
              size="small"
            >
              {categoryList.map((c) => (
                <MenuItem key={c.cno} value={c.cno}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="제목"
            variant="outlined"
            value={title}
            size="small"
            onChange={(e) => setTitle(e.target.value)}
            sx={{ width: '60%', marginLeft: '10px' }}
          />
        </Stack>

        <Box sx={{ width: '60%' }}>
          <TextField
            ref={fieldRef} // ★ Popper 앵커는 root에
            inputRef={tagInputRef} // 캐럿/치환은 input에
            label="태그 입력 (예: #건강#요가)"
            variant="outlined"
            value={tagInput}
            size="small"
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyDown}
            fullWidth
          />

          <Popper
            open={openSuggest && !!fieldRef.current} // ★ anchor 존재할 때만 오픈
            anchorEl={fieldRef.current} // ★ 왼쪽 위로 튀는 문제 해결
            placement="bottom-start"
            style={{ zIndex: 1300 }}
          >
            <Paper
              elevation={3}
              sx={{
                mt: 0.5,
                minWidth: 240,
                maxWidth: 480,
                maxHeight: 320,
                overflowY: 'auto',
              }}
            >
              <List dense disablePadding>
                {suggestions.map((opt, idx) => (
                  <ListItemButton
                    ref={(el) => (itemRefs.current[idx] = el)}
                    key={opt}
                    selected={idx === activeIndex}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => replaceFragment(opt)}
                  >
                    <Chip
                      label={`#${opt}`}
                      sx={{
                        backgroundColor: colorForTag(opt),
                        color: 'black',
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Popper>

          <Typography variant="caption" sx={{ color: 'GrayText' }}>
            선택된 태그:{' '}
            {selectedTags.length
              ? selectedTags.map((t) => `#${t}`).join(' ')
              : '-'}
          </Typography>
        </Box>

        <Stack direction={'row'} justifyContent={'left'} sx={{ width: '60%' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={exp}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsExp(checked);
                  if (!checked) {
                    setExpFrom(null);
                    setExpTo(null);
                  }
                }}
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="GrayText">
                이용자 화면 게시 여부
              </Typography>
            }
            sx={{ color: 'GrayText' }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DatePicker
              format="YYYY/MM/DD"
              label="게시 시작일"
              slotProps={{ textField: { size: 'small' } }}
              disabled={!exp}
              value={expFrom}
              onChange={(newValue) => setExpFrom(newValue)}
            />
            <DatePicker
              format="YYYY/MM/DD"
              sx={{ marginLeft: '10px' }}
              label="게시 종료일"
              slotProps={{ textField: { size: 'small' } }}
              disabled={!exp}
              value={expTo}
              onChange={(newValue) => setExpTo(newValue)}
            />
          </LocalizationProvider>
        </Stack>

        <EditorToolbar
          sx={{ height: 'calc(100% - 200px)' }}
          ref={editorRef}
          value={content}
          onChange={setContent}
        />
      </Box>

      <Stack direction={'row'} justifyContent={'end'} sx={{ mt: 2, gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          수정
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          삭제
        </Button>
        <Button variant="outlined" color="info" onClick={handleCancel}>
          뒤로가기
        </Button>
      </Stack>

      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default HealthBoardDetail;
