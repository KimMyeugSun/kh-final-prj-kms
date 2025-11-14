import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TermsOfUse from './terms/TermsOfUse';
import PrivacyPolicy from './terms/PrivacyPolicy';
import { StepButton } from '@mui/material';
import { useState } from 'react';
import SignUpForm from './form/SignUpForm';
import authFetch from '../../utils/authFetch';
import { useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE}` || 'http://localhost:8080';

const SignUp = () => {
  const steps = [
    {
      label: '이용 약관',
      render: (onDone) => <TermsOfUse onAgree={onDone} />,
    },
    {
      label: '개인정보 처리방침',
      render: (onDone) => <PrivacyPolicy onAgree={onDone} />,
    },
    {
      label: '개인정보 입력',
      render: (onDone) => (<SignUpForm onAgree={onDone} onSave={handleSave} formData={formData} />),
    },
    {
      // 완료 요약 (actionable 아님)
      label: '가입 완료',
      render: () => (
        <>
          {allStepsCompleted() ? (
            <>
              <Typography variant="h7" color="primary">모든 단계를 완료했습니다. 가입하기 버튼을 눌러 회원가입을 완료하세요.</Typography>
              <br />
              <Button variant="contained" onClick={onSignUp}>가입하기</Button>
            </>) 
          : (<Typography variant="h5" color="primary">아직 필수 단계가 완료되지 않았습니다.</Typography>)}
        </>
      ),
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [formData, setFormData] = useState(undefined);

  const actionableStepsCount = steps.length - 1; // 마지막 한 개 제외
  const completedSteps = () => Object.keys(completed).length;
  const allStepsCompleted = () => completedSteps() === actionableStepsCount;

  const handleComplete = (index) => {
    setCompleted((prev) => ({ ...prev, [index]: true }));
    const lastActionableIndex = steps.length - 2; // 표시용 바로 전 인덱스

    if (index === lastActionableIndex) {
      setActiveStep(steps.length - 1);
      return;
    }

    for (let i = 0; i <= lastActionableIndex; ++i) {
      if (!(i in { ...completed, [index]: true })) {
        setActiveStep(i);
        return;
      }
    }
    
    setActiveStep(steps.length - 1);
  };

  const handleSave = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    setFormData(formData);
  };

  const handleStep = (step) => () => setActiveStep(step);

  const onSignUp = () => {
    authFetch(`${API_BASE_URL}/sign-up`, {
      method: 'POST',
      body: formData,
    }).then((res) => {
      if (!res.ok){
        return res.json().then((errjson) => {
          throw new Error(errjson.errorMsg || '회원가입에 실패했습니다.');
        });
      }

    if(currentPath.includes('/management'))
      navigate('/management');
    else
      navigate('/');
    });
  };

  const onCancel = () => {
    const currentPath = location.pathname;
    if(currentPath.includes('/management'))
      navigate('/management');
    else
      navigate('/');
  }

  return (
    <Box sx={{ maxWidth: '80%', padding: 4, margin: 'auto' }}>
      <Button variant='contained' color="error" size='small' onClick={onCancel}>취소</Button>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => {
          const content = step.render(() => handleComplete(index));
          return (
            <Step key={step.label} completed={!!completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                {step.label}
              </StepButton>
              <StepContent>{content}</StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default SignUp;
