import React, { useEffect, useState } from 'react';
import PageTitle from '../../define/styles/jgj/PageTitle';
import Css from '../../define/styles/jgj/challenge/ChallengeListCss';
import authFetch from '../../utils/authFetch';
import Chip from '@mui/material/Chip';

const { VITE_S3_URL, VITE_S3_CHALLENGE_IMG } = import.meta.env;

const ChallengeList = () => {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('ALL');

  const statusChip = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label="진행중" color="success" size="small" />;
      case 'PLANNED':
        return <Chip label="예정" color="default" size="small" />;
      case 'ENDED':
        return <Chip label="종료" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const fetchChallenge = () => {
    const url = '/api/challenge';
    const option = {};

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.success) {
          setList(result.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchChallenge();
  }, []);

  // ImgUrl
  const buildImgUrl = (path) => {
    if (!path) return null;
    const img = VITE_S3_URL + VITE_S3_CHALLENGE_IMG + path;
    return img;
  };

  // 챌린지 설명이 너무 긴 경우 잘라서 보여주기
  const cutDesc = (s, n = 30) =>
    typeof s === 'string' && s.length > n ? s.slice(0, n).trim() + '…' : s;

  // 필터링된 리스트
  const filteredList = list.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  return (
    <Css.Section>
      <header>
        <PageTitle>챌린지 목록 조회</PageTitle>
        <Css.ActionsRow>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Chip
              label="전체"
              color={filter === 'ALL' ? 'primary' : 'default'}
              variant={filter === 'ALL' ? 'filled' : 'outlined'}
              onClick={() => setFilter('ALL')}
            />
            <Chip
              label="진행중"
              color={filter === 'ACTIVE' ? 'success' : 'default'}
              variant={filter === 'ACTIVE' ? 'filled' : 'outlined'}
              onClick={() => setFilter('ACTIVE')}
            />
            <Chip
              label="예정"
              color={filter === 'PLANNED' ? 'default' : 'default'}
              variant={filter === 'PLANNED' ? 'filled' : 'outlined'}
              onClick={() => setFilter('PLANNED')}
            />
            <Chip
              label="종료"
              color={filter === 'ENDED' ? 'error' : 'default'}
              variant={filter === 'ENDED' ? 'filled' : 'outlined'}
              onClick={() => setFilter('ENDED')}
            />
          </div>
        </Css.ActionsRow>
      </header>

      <Css.CardGrid>
        {filteredList.map((c) => {
          const ended = c.status === 'ENDED';
          const CardTag = ended ? Css.EndCardLink : Css.CardLink;
          const src = buildImgUrl(c.url);

          return (
            <CardTag key={c.no} to={`/challenge/${c.no}`}>
              {src ? <Css.Thumb src={src} alt={c.title} /> : null}
              <Css.Divider />
              <Css.Title>{c.title}</Css.Title>
              <Css.Desc>{cutDesc(c.description)}</Css.Desc>
              <Css.Detail>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>
                    {c.startDate} {c.endDate ? `~ ${c.endDate}` : null}
                  </span>
                  {statusChip(c.status)}
                </div>
              </Css.Detail>
              {ended && (
                <Css.OverlayText>챌린지가 종료되었습니다.</Css.OverlayText>
              )}
            </CardTag>
          );
        })}
      </Css.CardGrid>
    </Css.Section>
  );
};

export default ChallengeList;
