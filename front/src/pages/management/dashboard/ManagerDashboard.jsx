import * as React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import authFetch from '../../../utils/authFetch';
import { useEffect } from 'react';
import { useState } from 'react';
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(
  /\/$/,
  ''
);

export default function ManagerDashboard() {
  const [dept, setDept] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalEmp, setTotalEmp] = useState(0);

  const handleDeptChange = (event) => setDept(event.target.value);

  // 부서 목록
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/public/department/look-up`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('부서 데이터 없음');
        
        const list = Array.isArray(data?.departmentNames)
          ? data.departmentNames
          : [];
        setDepartments(list);
        if (list.length > 0) setDept(list[0]);
      })
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  // 전체 사원 수 (백 변경 없이 페이징 합산)
  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        const r1 = await authFetch('/management/api/employee/look-up/1');
        if (!r1.ok) throw new Error('lookup page1 fail');
        const p1 = await r1.json();

        // 조 보정
        // 기존에는 data 안 쪽에 들어있었음
        const root = p1?.data ?? {};
        const list1 = Array.isArray(root.data) ? root.data : [];
        const totalPages = Number(root.totalPages ?? 1);
        const pageSize = list1.length;

        if (totalPages <= 1) {
          if (!aborted) setTotalEmp(pageSize);
          return;
        }

        const rLast = await authFetch(
          `/management/api/employee/look-up/${totalPages}`
        );
        if (!rLast.ok) throw new Error('lookup last page fail');
        const pLast = await rLast.json();

        // 동일하게 구조 보정
        const rootLast = pLast?.data ?? {};
        const lastList = Array.isArray(rootLast.data) ? rootLast.data : [];
        const lastSize = lastList.length;

        const total = (totalPages - 1) * pageSize + lastSize;
        if (!aborted) setTotalEmp(total);
      } catch (err) {
        console.error('사원 수 조회 실패', err);
        if (!aborted) setTotalEmp(0);
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  // 상단 카드
  const cardStats = React.useMemo(
    () => [
      { label: '전체 사원 수', value: `${totalEmp}명` },
      { label: '흡연율 (%)', value: '20%' }, // 현재임시값..
      { label: '비만율 (%)', value: '25%' }, // 현재임시값..
      { label: '고혈압율 (%)', value: '15%' }, // 현재임시값..
    ],
    [totalEmp]
  );

  // ── [1] 사원별 위험도: 요인 리스트 포함(툴팁에서 보여줄 값) ─────────
  const barData = [
    {
      name: '김사원(1047)',
      risk: 7,
      factors: [
        '흡연',
        '비만',
        '수면부족',
        '고혈압',
        '스트레스',
        '과음',
        '운동부족',
      ],
    },
    {
      name: '이과장(1004)',
      risk: 6,
      factors: ['흡연', '비만', '수면부족', '과음', '운동부족', '고혈압'],
    },
    {
      name: '박대리(1092)',
      risk: 5,
      factors: ['비만', '수면부족', '스트레스', '운동부족', '당뇨전단계'],
    },
    {
      name: '최사원(1030)',
      risk: 4,
      factors: ['수면부족', '스트레스', '운동부족', '과음'],
    },
    {
      name: '오부장(1070)',
      risk: 3,
      factors: ['흡연', '운동부족', '스트레스'],
    },
  ];

  // ── 2 부서별 도넛 데이터(프론트 더미 맵) ─────────
  // 실제 연동 시 dept 바뀌면 해당 부서 API 호출해서 setPieData 하면 됨.
  const pieDataByDept = React.useMemo(
    () => ({
      프로그래밍: [
        { label: '건강', value: 25, color: '#4caf50' },
        { label: '흡연', value: 13, color: '#2196f3' },
        { label: '비만', value: 9, color: '#ff9800' },
        { label: '수면부족', value: 8, color: '#f44336' },
        { label: '고혈압', value: 7, color: '#9c27b0' },
        { label: '스트레스', value: 5, color: '#00acc1' },
        { label: '과음', value: 8, color: '#ef4abb' },
        { label: '운동부족', value: 13, color: '#0033ff' },
      ],
      디자인: [
        { label: '건강', value: 20, color: '#4caf50' },
        { label: '흡연', value: 14, color: '#2196f3' },
        { label: '비만', value: 9, color: '#ff9800' },
        { label: '수면부족', value: 7, color: '#f44336' },
        { label: '고혈압', value: 11, color: '#9c27b0' },
        { label: '스트레스', value: 17, color: '#00acc1' },
        { label: '과음', value: 8, color: '#ef4abb' },
        { label: '운동부족', value: 13, color: '#0033ff' },
      ],
      마케팅: [
        { label: '건강', value: 18, color: '#4caf50' },
        { label: '흡연', value: 20, color: '#2196f3' },
        { label: '비만', value: 12, color: '#ff9800' },
        { label: '수면부족', value: 10, color: '#f44336' },
        { label: '고혈압', value: 9, color: '#9c27b0' },
        { label: '스트레스', value: 8, color: '#00acc1' },
        { label: '과음', value: 8, color: '#ef4abb' },
        { label: '운동부족', value: 13, color: '#0033ff' },
      ],
      영업: [
        { label: '건강', value: 27, color: '#4caf50' },
        { label: '흡연', value: 17, color: '#2196f3' },
        { label: '비만', value: 8, color: '#ff9800' },
        { label: '수면부족', value: 4, color: '#f44336' },
        { label: '고혈압', value: 2, color: '#9c27b0' },
        { label: '스트레스', value: 8, color: '#00acc1' },
        { label: '과음', value: 8, color: '#ef4abb' },
        { label: '운동부족', value: 13, color: '#0033ff' },
      ],
    }),
    []
  );

  const pieData = React.useMemo(() => {
    // 선택된 부서에 데이터가 없으면 기본값(프로그래밍) 사용
    return pieDataByDept[dept] ?? pieDataByDept['프로그래밍'] ?? [];
  }, [dept, pieDataByDept]);

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        minHeight: '100vh',
        padding: '80px 100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      {/* 상단 카드 */}
      <Grid
        container
        spacing={6}
        justifyContent="center"
        alignItems="stretch"
        sx={{ maxWidth: '1600px', mb: 10 }}
      >
        {cardStats.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                textAlign: 'center',
                borderRadius: 4,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                py: 5,
                px: 3,
                height: '150px',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: 'text.secondary', fontSize: '1.15rem', mb: 1.5 }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    fontSize: '2.7rem',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 하단 2단 */}
      <Grid
        container
        spacing={8}
        justifyContent="center"
        alignItems="flex-start"
        sx={{ maxWidth: '1500px' }}
      >
        {/* 왼쪽 - 사원별 위험도 */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 3, ml: 1, color: '#333' }}
          >
            사원별 위험도
          </Typography>
          <Box
            sx={{
              borderRadius: 3,
              boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
              p: 4,
              background: '#fff',
            }}
          >
            <BarChart
              dataset={barData}
              xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
              series={[
                {
                  dataKey: 'risk',
                  label: '위험요인 수',
                  color: '#f4b183',
                  // 툴팁에 "n개 — 요인1, 요인2..." 형태로 노출
                  valueFormatter: (value, ctx) => {
                    const idx = ctx?.dataIndex ?? 0;
                    const factors = barData[idx]?.factors ?? [];
                    return `${value}개 — ${factors.join(', ')}`;
                  },
                },
              ]}
              tooltip={{ trigger: 'item' }}
              width={600}
              height={320}
            />
          </Box>
        </Grid>

        {/* 오른쪽 - 부서별 건강비율 */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                pr: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: '#333', flexShrink: 0 }}
              >
                부서별 건강비율
              </Typography>
              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel id="dept-select-label">부서 선택</InputLabel>
                <Select
                  labelId="dept-select-label"
                  id="dept-select"
                  value={dept}
                  label="부서 선택"
                  onChange={handleDeptChange}
                  disabled={loading}
                >
                  {departments.map((d, i) => (
                    <MenuItem key={i} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                borderRadius: 3,
                boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                p: 4,
                background: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PieChart
                series={[
                  {
                    data: pieData,
                    innerRadius: 60,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 5,
                    startAngle: 90,
                    endAngle: 450,
                    valueFormatter: (item) => `${item.value}명`,
                  },
                ]}
                width={380}
                height={320}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
