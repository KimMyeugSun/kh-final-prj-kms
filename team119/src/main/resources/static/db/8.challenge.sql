TRUNCATE TABLE
  public.challenge_cert_record,
  public.challenge_participant,
  public.challenge
RESTART IDENTITY CASCADE;

-- 챌린지 추가
INSERT INTO challenge
(title, description, start_date, end_date, status, url)
VALUES
('요가 챌린지', '요가챌린지입니다 매일 30분씩 요가를 진행합시다! 이미지에 그려진 자세를 취하고 인증을 남겨주세요 ! 랭킹에 들어 포인트를 획득하세요!', DATE '2025-09-01', DATE '2025-09-30', 'ENDED', 'yoga.png');
INSERT INTO challenge
(title, description, start_date, end_date, status, url)
VALUES
('스쿼트 챌린지', '스쿼트 챌린지입니다 같이 진행해보아요 ~~~~~ 매일 스쿼트를 30회 3세트 진행하여 인증을 남겨주세요 랭킹을 산정하여 푸짐한 복지 포인트를 드립니다 !', DATE '2025-10-01', DATE '2025-10-31', 'ACTIVE', 'squat.png');
INSERT INTO challenge
(title, description, start_date, end_date, status, url)
VALUES
('런닝 챌린지', '같이 달려보아요 ~~~~~~~~~~ 달려라 달려 !!!!!', DATE '2025-11-01', DATE '2025-11-30', 'PLANNED', 'running.png');


-- 챌린지 참가자 추가 (cno = 2)
INSERT INTO public.challenge_participant
  (cno, eno, total_score, streak_count, joined_at, status, last_participant_date, end_rank)
VALUES
(2, 1, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1000, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1001, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1002, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1003, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1004, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1005, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1006, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1007, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1008, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1009, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1010, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1011, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1012, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1013, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1014, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1015, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1016, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1017, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1018, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1019, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1020, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1021, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1022, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0),
(2, 1023, 0, 0, CURRENT_TIMESTAMP, 'ACTIVE', NULL, 0);


-- 챌린지 인증 추가
WITH bounds AS (
  SELECT DATE '2025-10-01' AS start_d,
         LEAST(DATE '2025-10-31', CURRENT_DATE - 1) AS end_d
)
INSERT INTO public.challenge_cert_record (cpno, content, url, is_approved, created_at)
SELECT
  cp.no AS cpno,
  '오늘도 인증합니다.' AS content,
  'cert.png' AS url,
  CASE WHEN random() < 0.8 THEN 'Y' ELSE 'N' END AS is_approved,
  pick.d
    + ((floor(random()*24))::int || ' hours')::interval
    + ((floor(random()*60))::int || ' minutes')::interval AS created_at
FROM public.challenge_participant cp
CROSS JOIN bounds b
CROSS JOIN LATERAL (SELECT 3 + (random()*3)::int AS k) k
CROSS JOIN LATERAL (
  SELECT d::date
  FROM (
    SELECT (b.start_d + gs.n) AS d
    FROM generate_series(0, (b.end_d - b.start_d)) gs(n)
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.challenge_cert_record c
      WHERE c.cpno = cp.no
        AND c.created_at::date = (b.start_d + gs.n)
    )
    ORDER BY random()
    LIMIT k.k
  ) pick_unique
) AS pick(d)
WHERE cp.cno = 2
  AND b.end_d >= b.start_d;


-- eno=1 사용자의 cno=2 챌린지 인증
WITH target AS (
  SELECT cp.no AS cpno
  FROM public.challenge_participant cp
  WHERE cp.cno = 2 AND cp.eno = 1
  ORDER BY cp.no DESC
  LIMIT 1
),
days AS (
  SELECT d::date AS day
  FROM generate_series(DATE '2025-10-01', DATE '2025-10-08', INTERVAL '1 day') AS gs(d)
)
INSERT INTO public.challenge_cert_record (cpno, content, url, is_approved, created_at)
SELECT
  t.cpno,
  '오늘도 인증합니다',
  'cert.png',
  'Y',
  d.day + TIME '09:00'
FROM target t
CROSS JOIN days d;


