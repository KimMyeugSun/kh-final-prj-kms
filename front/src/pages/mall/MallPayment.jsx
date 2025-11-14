import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PageTitle from '../../define/styles/jgj/PageTitle';
import { useAuth } from '../../auth/useAuth';
import authFetch from '../../utils/authFetch';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CommonSnackbar from '../../components/commons/CommonSnackbar';

// 다음 주소검색 api
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

// 공통 행
const FormRow = ({ label, children }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 2,
      gap: 2,
    }}
  >
    <Box sx={{ width: 100, flexShrink: 0 }}>
      <Typography sx={{ lineHeight: '40px' }}>{label}</Typography>
    </Box>
    <Box sx={{ flex: 1 }}>{children}</Box>
  </Box>
);

export default function MallPayment() {
  const { getEmpNo, getPhone, getAddress, getAddressDetail } = useAuth();
  const eno = Number(getEmpNo());

  const location = useLocation();
  const cartItemIds = location.state?.cartItemIds || [];

  const { rawUser, getUser, setUser, getName } = useAuth();
  const welfarePoint = getUser().employee.empWelfarePoints;

  const [name, setName] = useState(getName());
  const [phone, setPhone] = useState(getPhone() || '');
  const [address, setAddress] = useState(getAddress() || '');
  const [addressDetail, setAddressDetail] = useState(getAddressDetail() || '');
  const [deliveryRequest, setDeliveryRequest] = useState('');
  const [benefitPoint, setBenefitPoint] = useState('0');
  const [totalPrice, setTotalPrice] = useState(0);
  const pointBalance = welfarePoint;

  const navigate = useNavigate();
  const SHIPPING_FEE = 3000;

  const formatCurrency = (n) =>
    (n ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const parseCurrency = (s) =>
    Number(String(s).replaceAll(',', '').replace(/[^\d]/g, '')) || 0;

  const handlePointChange = (e) => {
    const num = parseCurrency(e.target.value);
    setBenefitPoint(formatCurrency(num));
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    const autoUse = Math.min(totalPrice, pointBalance);
    setBenefitPoint(formatCurrency(autoUse));
  }, [totalPrice, pointBalance]);

  // 서버에서 계산한 총 결제금액 조회
  useEffect(() => {
    const url = `/api/cartItem/totalPrice?nos=${cartItemIds.join(',')}`;
    const option = {};

    if (cartItemIds.length > 0) {
      authFetch(url, option)
        .then((res) => res.json())
        .then((result) => {
          setTotalPrice(result.data + SHIPPING_FEE);
        })
        .catch((err) => console.error(err));
    }
  }, [cartItemIds]);

  const handleAddressSearch = () => {
    loadDaumPostcode().then((Postcode) => {
      new Postcode({
        oncomplete: (data) => {
          const roadAddr = data.roadAddress; // 도로명 주소
          const jibunAddr = data.jibunAddress; // 지번 주소
          const zonecode = data.zonecode; // 우편번호

          setAddress(`${roadAddr || jibunAddr} (${zonecode})`);

          setTimeout(() => {
            const detailInput = document.querySelector('#detailAddress');
            if (detailInput) detailInput.focus();
          }, 100);
        },
      }).open();
    });
  };

  const handlePay = () => {
    const url = `/api/order`;
    const object = {
      eno: eno,
      totalPrice: totalPrice,
      phone: phone,
      address: address,
      addressDetail: addressDetail,
      items: cartItemIds,
    };
    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(object),
    };

    authFetch(url, option)
      .then((resp) => {
        return resp.json();
      })
      .then((result) => {
        const welfarePoints = { ...rawUser };
        welfarePoints.employee.empWelfarePoints = result.data.welfarePoints;
        setUser(welfarePoints);
        setSnackbar({
          open: true,
          message: '결제가 완료되었습니다.',
          severity: 'success',
        });
        navigate('/mall/order-list');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleCancel = () => window.history.back();

  const canPay = useMemo(() => {
    // 잔액이 결제금액보다 크거나 같을 때만 결제 가능
    return pointBalance >= totalPrice;
  }, [pointBalance, totalPrice]);

  return (
    <Box sx={{ bgcolor: '#fff', py: 4 }}>
      <Container maxWidth="md">
        <PageTitle>상품 결제</PageTitle> <br />
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.12)',
            bgcolor: '#fff',
            minHeight: 380,
            paddingTop: '100px',
          }}
        >
          {/* 주문자명 */}
          <FormRow label="주문자명">
            <TextField
              fullWidth
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormRow>

          {/* 전화번호 */}
          <FormRow label="전화번호">
            <TextField
              fullWidth
              size="small"
              value={phone}
              onChange={(e) => {
                const onlyNum = e.target.value.replace(/[^0-9]/g, '');
                setPhone(onlyNum);
              }}
              placeholder="숫자만 입력 가능합니다 (최대 11자리)"
              inputProps={{ maxLength: 11 }}
            />
          </FormRow>

          {/* 주소 */}
          <FormRow label="주소">
            <TextField
              fullWidth
              size="small"
              value={address}
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
          </FormRow>

          {/* 상세 주소 */}
          <FormRow label="상세 주소">
            <TextField
              id="detailAddress"
              fullWidth
              size="small"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
            />
          </FormRow>

          {/* 배송 요청사항 */}
          <FormRow label="배송 요청사항">
            <TextField
              fullWidth
              size="small"
              value={deliveryRequest}
              onChange={(e) => setDeliveryRequest(e.target.value)}
              placeholder="예: 부재 시 문 앞에 두세요"
            />
          </FormRow>

          {/* 총 결제 금액 */}
          <FormRow label="총 결제 금액">
            <Typography sx={{ fontWeight: 'bold', fontSize: 18 }}>
              {formatCurrency(totalPrice)} 원
            </Typography>
          </FormRow>

          {/* 복지 포인트 */}
          <FormRow label="복지 포인트">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                size="small"
                value={benefitPoint}
                disabled
                onChange={handlePointChange}
                sx={{ width: 200 }}
                slotProps={{
                  input: {
                    style: { textAlign: 'right' },
                  },
                }}
              />
              <Typography>잔액 : {formatCurrency(welfarePoint)}원</Typography>
            </Box>
          </FormRow>

          {/* 버튼 */}
          <Box
            sx={{
              mt: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handlePay}
                disabled={!canPay}
              >
                결제
              </Button>
              <Button variant="contained" color="error" onClick={handleCancel}>
                취소
              </Button>
            </Box>
            {!canPay && (
              <Typography
                sx={{
                  color: 'error.main',
                  mt: 1,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                잔액이 부족합니다.
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
