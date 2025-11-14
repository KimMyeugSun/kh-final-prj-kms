import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../../auth/useAuth';

const ManagementSignIn = () => {
  const { signIn } = useAuth();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signIn(id, password);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, userSelect: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Avatar sx={{ bgcolor: 'transparent', width: 56, height: 56 }}>
            <Box
              component="img"
              src="/favicons/android-icon-144x144.png" // 실제 파일명으로 변경
              alt="logo"
              sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Avatar>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, lineHeight: 1 }}
            >
              우리건강 지킴이 일일구
            </Typography>
            <Typography variant="caption" color="text.secondary">
              관리자 로그인...
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="userId"
            label="아이디"
            name="userId"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoFocus
            autoComplete="username"
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="userPwd"
            label="Password"
            type={showPwd ? 'text' : 'password'}
            id="userPwd"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPwd((s) => !s)}
                  edge="end"
                  size="large"
                >
                  {showPwd ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          {/* <FormControlLabel
            control={
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                color="primary"
              />
            }
            label="Remember me"
            sx={{ mt: 1 }}
          /> */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.3,
              textTransform: 'none',
            }}
          >
            Sign in
          </Button>

          <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
            <Grid>
              <Typography variant="body2" component="span" sx={{ mr: 1 }}>계정이 없으신가요?</Typography>
              <Link href="/sign-up" variant="body2">회원가입</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ManagementSignIn;
