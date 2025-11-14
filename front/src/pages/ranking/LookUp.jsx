import React, { useEffect, useRef, useState } from 'react';
import rankLogo from '../../assets/challenges/rankLogo.png';
import { useAuth } from '../../auth/useAuth';
import Css from '../../define/styles/jgj/ranking/RankingCss';
import PageTitle from '../../define/styles/jgj/PageTitle';
import authFetch from '../../utils/authFetch';
import dayjs from 'dayjs';
import { Box } from '@mui/material';

const LookUp = () => {
  const [ranking, setRanking] = useState([]);
  const rowRefs = useRef([]);
  const { getEmpNo } = useAuth();
  const eno = Number(getEmpNo());

  useEffect(() => {
    const url = `/api/ranking`;
    const option = {};

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        setRanking(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleMyRankClick = () => {
    if (!eno) {
      alert('로그인 정보가 없습니다.');
      return;
    }

    // 내 아이디가 있는 index 찾기
    const myIndex = ranking.findIndex((item) => item.eno === eno);

    if (myIndex !== -1 && rowRefs.current[myIndex]) {
      rowRefs.current[myIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    } else {
      alert('순위 정보에서 내 계정을 찾을 수 없습니다.');
    }
  };

  const currentMonth = dayjs().month() + 1;

  return (
    <Css.Root>
      <Css.BorderedContainer maxWidth="lg">
        {/* 상단 로고 & 버튼 */}
        <Css.LogoWrapper>
          <Css.LogoImg src={rankLogo} alt="Ranking Logo" />
          <PageTitle>{currentMonth}월 랭킹 조회</PageTitle>
          <Css.ButtonWrapper>
            <Css.RankButton variant="contained" onClick={handleMyRankClick}>
              내 순위 보기
            </Css.RankButton>
          </Css.ButtonWrapper>
        </Css.LogoWrapper>

        {/* 헤더 */}
        <Css.HeadWrapper>
          <Css.Cell bold>순위</Css.Cell>
          <Css.Cell bold>아이디</Css.Cell>
          <Css.Cell bold>이름</Css.Cell>
          <Css.Cell bold>점수</Css.Cell>
          <Css.Cell bold>배지</Css.Cell>
          <Css.Cell bold>적립포인트</Css.Cell>
        </Css.HeadWrapper>

        <Css.Rows>
          {ranking.length === 0 ? (
            <Box
              sx={{
                padding: '40px 0',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 600,
                color: '#666',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: '16px',
                backgroundColor: '#fafafa',
              }}
            >
              랭킹 산정 기간이 아닙니다.
            </Box>
          ) : (
            ranking.map((item, index) => {
              const isMyRow = item.eno === eno;

              return (
                <Css.RowWrapper
                  key={item.empId}
                  ref={(el) => (rowRefs.current[index] = el)}
                  style={{
                    backgroundColor: isMyRow ? '#e4eef7' : 'transparent',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <Css.Cell bold>{item.rank}위</Css.Cell>
                  <Css.Cell>{item.empId}</Css.Cell>
                  <Css.Cell>{item.empName}</Css.Cell>
                  <Css.Cell bold>{item.score}</Css.Cell>
                  <Css.Cell>
                    <Css.Badge type={item.badge.toUpperCase()}>
                      {item.badge}
                    </Css.Badge>
                  </Css.Cell>
                  <Css.Cell>{item.amount.toLocaleString()}원</Css.Cell>
                </Css.RowWrapper>
              );
            })
          )}
        </Css.Rows>
      </Css.BorderedContainer>
    </Css.Root>
  );
};

export default LookUp;
