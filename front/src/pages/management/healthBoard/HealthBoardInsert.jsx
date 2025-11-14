import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/useAuth.jsx';
import EditorToolbar from '../../../components/commons/EditorToolbar.jsx';
import {
  Box,
  Button,
  Checkbox,
  Divider,
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useRef, useState } from 'react';
import authFetch from '../../../utils/authFetch.js';
import 'dayjs/locale/ko';

const HealthBoardInsert = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cno, setCno] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [exp, SetExp] = useState(false);
  const [expFrom, setExpFrom] = useState(null);
  const [expTo, setExpTo] = useState(null);

  // 해시태그 인풋 상태
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [openSuggest, setOpenSuggest] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const itemRefs = useRef([]); // 추천 항목 DOM 참조 저장
  useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, suggestions]);
  const editorRef = useRef();
  const navigate = useNavigate();
  const { getEmpNo } = useAuth();
  const eno = getEmpNo();

  //카테고리 및 태그리스트 불러오는 패치함수
  useEffect(() => {
    const devUrlCategory = `/management/api/health/category`;
    authFetch(devUrlCategory)
      .then((resp) => {
        if (!resp.ok) {
          return;
        } else {
          return resp.json();
        }
      })
      .then((data) => {
        if (data?.data) {
          console.log(data.data);

          setCategoryList(data.data);
        }
      });

    const devUrlTag = `/api/public/tag/list`;
    authFetch(devUrlTag)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('태그 데이터 없음');
        
        if (data?.tags) {
          console.log(data.tags);
          setTagList(data.tags);
        }
      });
  }, []);

  // === 해시태그 자동완성 유틸들 ===
  useEffect(() => {
    setAnchorEl(tagInputRef.current);
  }, []);

  // 커서 앞의 마지막 #조각을 찾아 반환
  const getHashtagFragmentAtCaret = (text, caretPos) => {
    const left = text.slice(0, caretPos);
    // 마지막 공백(혹은 문장 시작) 이후의 "#조각" 탐색
    const match = left.match(/(^|\s)(#([^\s#]*))$/);
    if (!match) return null;

    const fragmentWithHash = match[2]; // "#건"
    const fragment = match[3] || ''; // "건"
    const start = left.length - fragmentWithHash.length; // 조각 시작 위치(# 포함)
    const end = left.length; // caret 위치
    return { start, end, fragment, withHash: fragmentWithHash };
  };

  // tagInput 변경 시 추천어 계산 + selectedTags 자동 추출
  const handleTagInputChange = (e) => {
    const text = e.target.value;
    setTagInput(text);

    const caret = e.target.selectionStart ?? text.length;
    const frag = getHashtagFragmentAtCaret(text, caret);

    if (frag) {
      // ← 빈 fragment도 허용 (#만 입력해도 작동)
      const q = frag.fragment.trim();
      const norm = (s) => s.replace(/\s|[-_]/g, '').toLowerCase();

      // q가 없으면 전체 태그, 있으면 필터
      const base =
        q.length === 0
          ? tagList
          : tagList.filter((t) => norm(t).includes(norm(q)));

      // 전체 보기일 땐 가나다/알파벳 정렬, 검색 중이면 startsWith 우선
      const opts = base.sort((a, b) => {
        if (q.length === 0) return a.localeCompare(b);
        const sa = norm(a).startsWith(norm(q));
        const sb = norm(b).startsWith(norm(q));
        return sa === sb ? 0 : sa ? -1 : 1;
      });

      setSuggestions(opts); // ← .slice(0, 8) 제거: 전체 노출
      setOpenSuggest(opts.length > 0);
      setActiveIndex(0);
    } else {
      setOpenSuggest(false);
      setSuggestions([]);
    }

    // 입력문장에서 해시태그만 자동 추출해 selectedTags 업데이트
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

    // 치환하면서 뒤에 공백 하나(UX)
    const newLeft = `${before}#${fullTag} `;
    const next = newLeft + after;

    setTagInput(next);
    setOpenSuggest(false);

    // 커서 이동
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newLeft.length, newLeft.length);
    });

    // 치환 후 태그 다시 추출
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
  ]; // 간단 해시(djb2 변형)
  const hashString = (s) => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) {
      h = (h * 33) ^ s.charCodeAt(i);
    }
    // 음수 방지
    return h >>> 0;
  };

  const colorForTag = (tag) => {
    if (!tag) return chipColors[0];
    const idx = hashString(tag) % chipColors.length;
    return chipColors[idx];
  };

  // === 제출/취소 ===
  const handleSubmit = () => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const uploadedFiles = editorRef.current?.getUploadedImages() || null;

    console.log(uploadedFiles);

    const reqDto = exp
      ? {
          eno,
          title,
          content,
          cno,
          imgUrl: uploadedFiles,
          tags: selectedTags, // ← 해시태그 배열 포함
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
          tags: selectedTags, // ← 해시태그 배열 포함
        };

    console.log('REQ DTO :: ', reqDto);
    const devUrl = `/management/api/health/board/insert`;
    authFetch(devUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqDto),
    })
      .then((resp) => {
        if (resp.ok) {
          console.log('게시글 등록 성공');
          console.log(resp);
          navigate(`/management/health_board/1`);
        }
      })
      .catch((err) => {
        console.error('게시글 등록 중 오류 발생:', err);
        handleCancel();
      });
  };

  const handleCancel = () => {
    authFetch(`/api/template-delete/${getEmpNo()}`, {
      method: 'DELETE',
    })
      .then((resp) => {
        if (resp.ok) {
          console.log('임시 이미지 삭제 성공');
        }
      })
      .catch((err) => {
        console.error('임시 이미지 삭제 중 오류 발생:', err);
      })
      .finally(() => {
        navigate(-1);
      });
  };

  return (
    <Box m={2} height="calc(100vh - 130px)" sx={{ userSelect: 'none' }}>
      <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>
        건강 게시글 작성
      </Typography>
      <Divider />
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
              onChange={(e) => {
                setCno(e.target.value);
              }}
              size="small"
            >
              {categoryList.map((c) => {
                return (
                  <MenuItem key={c.cno} value={c.cno}>
                    {c.name}
                  </MenuItem>
                );
              })}
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

        <Box sx={{ width: '60%', position: 'relative' }}>
          <TextField
            inputRef={tagInputRef}
            label="태그 입력 (예: #건강#요가)"
            variant="outlined"
            value={tagInput}
            size="small"
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyDown}
            fullWidth
          />
          <Popper
            open={openSuggest}
            anchorEl={anchorEl}
            placement="bottom-start"
            style={{ zIndex: 1300 }}
          >
            <Paper
              elevation={3}
              sx={{
                mt: 0.5,
                minWidth: 240,
                maxWidth: 480,
                maxHeight: 320, // ← 높이 제한
                overflowY: 'auto', // ← 세로 스크롤
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
                    onClick={() => {
                      replaceFragment(opt);
                    }}
                  >
                    <Chip
                      label={`#${opt}`}
                      sx={{
                        backgroundColor: colorForTag(opt), // ← 고정 색상
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
                  SetExp(checked);
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
              onChange={(newValue) => {
                setExpFrom(newValue);
              }}
            />
            <DatePicker
              format="YYYY/MM/DD"
              sx={{ marginLeft: '10px' }}
              label="게시 종료일"
              slotProps={{ textField: { size: 'small' } }}
              disabled={!exp}
              value={expTo}
              onChange={(newValue) => {
                setExpTo(newValue);
              }}
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
          등록
        </Button>
        <Button variant="outlined" color="error" onClick={handleCancel}>
          취소
        </Button>
      </Stack>
    </Box>
  );
};

export default HealthBoardInsert;
