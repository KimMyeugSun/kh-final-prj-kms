import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Avatar,
  Stack,
  Badge,
  Select,
  MenuItem,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

const SignUpForm = ({ onAgree, onSave, formData }) => {
  const [values, setValues] = useState({
    id: formData?.get('id') || '',
    password: formData?.get('password') || '',
    name: formData?.get('name') || '',
    confirmPwd: formData?.get('confirmPwd') || '',
    phone: formData?.get('phone') || '',
    email: formData?.get('email') || '',
    address: formData?.get('address') || '',
    addressDetail: formData?.get('addressDetail') || '',
    position: formData?.get('position') || '',
    department: formData?.get('department') || '',
    profile: formData?.get('profile') || null,
  });

  // 비밀번호 유효성 검사 상태
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // profile image state
  const [profileFile, setProfile] = useState(values?.profile || null);
  const [profilePreview, setProfilePreview] = useState( formData?.profilePreview || null );
  const fileInputRef = useRef(null);

  const [alertMsg, setAlertMsg] = useState(null);
  
  // 부서 목록 상태
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);

  const [grades, setGrades] = useState([]);
  const [gradeLoading, setGradeLoading] = useState(false);

  const loadDaumPostcode = () => {
    return new Promise((resolve) => {
      if (window.daum && window.daum.Postcode) {
        resolve(window.daum.Postcode);
      } else {
        const script = document.createElement('script');
        script.src =
          '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = () => resolve(window.daum.Postcode);
        document.body.appendChild(script);
      }
    });
  };

  useEffect(() => {
    setDeptLoading(true);
    fetch(`${API_BASE}/api/public/department/look-up`)
      .then((res) => {
        if (!res.ok) throw new Error('부서 목록을 불러오지 못했습니다.');
        return res.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('부서 데이터 없음');

        setDepartments(
          Array.isArray(data.departmentNames) ? data.departmentNames : []
        );
        setAlertMsg(null);
      })
      .catch((err) => {
        setDepartments([]);
        setAlertMsg({ severity: 'error', message: '부서 목록을 불러오지 못했습니다.' });
      })
      .finally(() => setDeptLoading(false));
  }, []);

  useEffect(() => {
    setGradeLoading(true);
    fetch(`${API_BASE}/api/public/grade/look-up`)
      .then((res) => {
        if (!res.ok) throw new Error('직급 목록을 불러오지 못했습니다.');
        return res.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('직급 데이터 없음');
        setGrades(
          Array.isArray(data.empGradeNameList) ? data.empGradeNameList : []
        );
        setAlertMsg(null);
      })
      .catch((err) => {
        setGrades([]);
        setAlertMsg({ severity: 'error', message: '직급 목록을 불러오지 못했습니다.' });
      })
      .finally(() => setGradeLoading(false));
  }, []);

  const handleProfileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return;

    setProfile(f);

    const reader = new FileReader();
    reader.onload = (ev) => setProfilePreview(ev.target.result);
    reader.readAsDataURL(f);

    setValues((s) => ({ ...s, profile: f }));
  };

  const removeProfile = () => {
    setProfile(null);
    setProfilePreview('');
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const [showPassword, setShowPassword] = useState(false);
  // const [error, setError] = useState('');

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    const errors = {
      length: password.length >= 8 && password.length <= 20,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(Boolean);
  };

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [key]: value }));
    
    // 비밀번호 실시간 검증
    if (key === 'password') {
      validatePassword(value);
    }
    
    setAlertMsg(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !values.id ||
      !values.password ||
      !values.name ||
      !values.confirmPwd ||
      !values.phone ||
      !values.email ||
      !values.address ||
      !values.addressDetail ||
      !values.position ||
      !values.department
    ) {
      setAlertMsg({ severity: 'error', message: '모든 필드를 입력하세요.' });
      return;
    }
    
    // 비밀번호 유효성 검사
    if (!validatePassword(values.password)) {
      setAlertMsg({ severity: 'error', message: '비밀번호가 형식에 맞지 않습니다.' });
      return;
    }
    
    if (values.password !== values.confirmPwd) {
      setAlertMsg({ severity: 'error', message: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    if (typeof onSave === 'function')
      onSave({ ...values, profileFile, profilePreview });
    if (typeof onAgree === 'function') onAgree();
  };

  const handleAddressSearch = () => {
    loadDaumPostcode().then((Postcode) => {
      new Postcode({
        oncomplete: (data) => {
          const roadAddr = data.roadAddress;
          const jibunAddr = data.jibunAddress;
          const zonecode = data.zonecode;

          setValues((prev) => ({
            ...prev,
            address: `${roadAddr || jibunAddr} (${zonecode})`,
          }));

          // setTimeout(() => {
          //   const detailInput = document.querySelector('#detailAddress');
          //   if (detailInput) detailInput.focus();
          // }, 100);
        },
      }).open();
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 420, mx: 'auto', p: 2, userSelect: 'none' }}>
      {alertMsg && (
        <Alert severity={alertMsg.severity} onClose={() => setAlertMsg(null)}> {alertMsg.message} </Alert>
      )}

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            profilePreview ? (
              <IconButton
                onClick={removeProfile}
                size="small"
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                aria-label="Remove profile image"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            ) : null
          }
        >
          <Avatar
            src={profilePreview}
            sx={{
              width: 64,
              height: 64,
              bgcolor: profilePreview ? undefined : 'primary.main',
            }}
            alt={values.id || 'User'}
          >
            {!profilePreview && (values.id ? values.id[0]?.toUpperCase() : '')}
          </Avatar>
        </Badge>

        <Box>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleProfileChange} style={{ display: 'none' }} id="profile-file-input" />
          <label htmlFor="profile-file-input">
            <IconButton color="primary" component="span" aria-label="Upload profile image" >
              <PhotoCamera />
            </IconButton>
          </label>
          <Typography variant="body2" color="text.secondary">
            프로필 사진 등록 (권장: JPG/PNG)
          </Typography>
        </Box>
      </Stack>

      <TextField label="아이디" value={values.id} onChange={handleChange('id')} fullWidth margin="normal" required autoComplete="userid" size='small' />
      <TextField label="이름" type="text" value={values.name} onChange={handleChange('name')} fullWidth margin="normal" required autoComplete="username" size='small' />
      
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%', mt: 2 }}>
        <FormControl variant="outlined" required sx={{ flex: 1 }}>
          <InputLabel htmlFor="비밀번호" size='small'>비밀번호</InputLabel>
          <OutlinedInput
            id="비밀번호"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            label="비밀번호"
            autoComplete="new-password"
            error={values.password && !Object.values(passwordErrors).every(Boolean)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((s) => !s)}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            size='small'
          />
        </FormControl>
        
        <Box sx={{ minWidth: 160, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {passwordErrors.length && passwordErrors.hasLetter && passwordErrors.hasNumber && passwordErrors.hasSpecial ? 
          (<Typography variant="caption" color={'primary'}>Done</Typography>) :
          (<>
              {!passwordErrors.length && (<Typography variant="caption" color={'error.main'}>(8~20자 길이)</Typography>)}
              {!passwordErrors.hasLetter && (<Typography variant="caption" color={'error.main'}>(영문자 포함)</Typography>)}
              {!passwordErrors.hasNumber && (<Typography variant="caption" color={'error.main'}>(숫자 포함)</Typography>)}
              {!passwordErrors.hasSpecial && (<Typography variant="caption" color={'error.main'}>(특수문자 포함)</Typography>)}
            </>)}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%', mt: 2 }}>
        <FormControl variant="outlined" required sx={{ flex: 1 }} disabled={values.password === ''}>
          <InputLabel htmlFor="비밀번호 확인" size='small'>비밀번호 확인</InputLabel>
          <OutlinedInput
            type={showPassword ? 'text' : 'password'}
            value={values.confirmPwd}
            onChange={handleChange('confirmPwd')}
            label="비밀번호 확인"
            autoComplete="new-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((s) => !s)}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            size='small'
          />
        </FormControl>
        <Box sx={{ minWidth: 160 }}>
          {values.confirmPwd && values.password !== values.confirmPwd && (<Typography variant="caption" color={'error.main'}>비밀번호가 일치하지 않습니다.</Typography>)}
        </Box>
      </Box>

      <TextField label="이메일" type="email" value={values.email} onChange={handleChange('email')}  fullWidth margin="normal" required size='small' />
      <TextField label="헨드폰" type="tel" value={values.phone} onChange={handleChange('phone')}  fullWidth margin="normal" required size='small' />

      <FormControl fullWidth margin="normal">
        <TextField
          label="주소"
          value={values.address}
          size="small"
          slotProps={{
            input: {
              placeholder: '주소를 검색해주세요',
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddressSearch}>
                    <SearchOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </FormControl>
      {/* <TextField label="주소" type="text" value={values.address} onChange={handleChange('address')}  fullWidth margin="normal" required /> */}
      <TextField id="detailAddress" label="상세 주소" type="text" value={values.addressDetail || ''} onChange={handleChange('addressDetail')}  fullWidth margin="normal" size='small' />
      <FormControl fullWidth margin="normal" size='small'>
        <InputLabel size='small'>부서</InputLabel>
        <Select id="department" value={values.department ?? ''} label="부서" onChange={handleChange('department')} disabled={deptLoading} size='small'>
          <MenuItem value="" disabled>
            <em>부서 선택</em>
          </MenuItem>
          {departments.map((dept, index) => (
            <MenuItem key={index} value={dept}>
              {dept}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel size='small'>직급</InputLabel>
        <Select id="position" value={values.position ?? ''} label="직급" onChange={handleChange('position')} disabled={gradeLoading} size='small'>
          <MenuItem value="" disabled>
            <em>직급 선택</em>
          </MenuItem>
          {grades.map((grade, index) => (
            <MenuItem key={index} value={grade}>
              {grade}
            </MenuItem>
          ))}
        </Select>
      </FormControl>



      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>다음</Button>
    </Box>
  );
};

export default SignUpForm;
