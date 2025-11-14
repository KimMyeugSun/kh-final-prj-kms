// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';
// import { useState } from 'react';
// import { Switch } from '@mui/material';
// import { Link } from 'react-router-dom';

// const SignIn = () => {
//   const [open, setOpen] = useState(false);
//   const [tab, setTab] = useState('normal');

//   const gotoSignUp = () => {
//     handleClose();
//   };

//   const handleChange = (event, newValue) => {
//     setTab(newValue);
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     const values = Object.fromEntries(formData.entries());

//     const userId = values.userId;
//     const userPwd = values.userPwd;

//     console.log(values);
//     //!< 여기에 로그인 처리 로직 추가
//     handleClose();
//   };

//   return (
//     <>
//       <Button variant="contained" onClick={handleClickOpen}>
//         로그인
//       </Button>

//       <Dialog open={open} onClose={handleClose}>
//         {/* <Box sx={{ width: '100%' }}>
//           <Tabs
//             value={tab}
//             onChange={handleChange}
//             aria-label="secondary tabs example"
//           >
//             <Tab value="normal" label="일반" />
//             <Tab value="admin" label="관리자" />
//           </Tabs>
//         </Box> */}
//         <DialogTitle>로그인</DialogTitle>
//         <DialogContent>
//           <form onSubmit={handleSubmit} id="sign-in-form">
//             <TextField
//               autoFocus
//               required
//               margin="dense"
//               label="User ID"
//               id="userId"
//               name="userId"
//               type="text"
//               fullWidth
//               variant="standard"
//             />
//             <TextField
//               autoFocus
//               required
//               margin="dense"
//               label="Password"
//               id="userPwd"
//               name="userPwd"
//               type="password"
//               fullWidth
//               variant="standard"
//             />
//           </form>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="error">
//             취소
//           </Button>
//           <Button type="submit" form="sign-in-form">
//             로그인
//           </Button>
//         </DialogActions>
//         <DialogContentText sx={{ m: 2 }}>
//           아직 회원이 아니신가요?{' '}
//           <Link to="/account/sign-up" onClick={gotoSignUp}>
//             회원가입
//           </Link>
//           을 해주세요.
//         </DialogContentText>
//       </Dialog>
//     </>
//   );
// };

// export default SignIn;

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
import { useAuth } from '../../auth/useAuth';

const SignIn = () => {
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
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPwd((s) => !s)}
                    edge="end"
                    size="large"
                  >
                    {showPwd ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
            {/* <Grid>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
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

export default SignIn;
