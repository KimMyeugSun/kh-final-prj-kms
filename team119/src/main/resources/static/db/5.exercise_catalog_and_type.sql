INSERT INTO exercise_type (type_code, type_name) VALUES
('CARDIO','유산소'),
('STRENGTH','근력운동'),
('SPORTS','스포츠'),
('PILATES','필라테스·체조'),
('OTHER','그 외')
ON CONFLICT (type_code) DO NOTHING;

WITH v(exercise_name, energy_per_kg_hr, memo) AS (
  VALUES
('바벨 스쿼트', 6.00, NULL),
('다트', 2.50, NULL),
('야구 캐치볼', 2.50, NULL),
('당구', 2.50, NULL),
('요가', 2.50, NULL),
('하타 요가', 2.50, NULL),
('파워요가', 4.00, NULL),
('수리야 나마스까 요가', 3.30, NULL),
('나디소다나 요가', 2.00, NULL),
('스트레칭(가볍게)', 2.50, NULL),
('낚시', 3.00, NULL),
('대청소', 3.00, NULL),
('세차', 3.00, NULL),
('볼링', 3.00, NULL),
('유연체조', 3.50, NULL),
('타이치', 4.00, NULL),
('수중 에어로빅', 4.00, NULL),
('팔굽혀펴기(격렬하게)', 8.00, NULL),
('푸쉬업(가볍게)', 3.00, NULL),
('푸쉬업(격렬하게)', 8.00, NULL),
('런지(보통으로)', 3.80, NULL),
('레그 레이즈', 5.00, NULL),
('와일드 런지', 5.50, NULL),
('윗몸일으키기(가볍게)', 2.80, NULL),
('윗몸일으키기(격렬하게)', 8.00, NULL),
('크런치(가볍게)', 3.00, NULL),
('크런치(격렬하게)', 8.00, NULL),
('스쿼트', 5.50, NULL),
('탁구랠리', 4.00, NULL),
('태극권', 4.00, NULL),
('아쿠아로빅', 4.00, NULL),
('골프', 4.80, NULL),
('라인댄스', 7.80, NULL),
('싸이클론', 7.00, NULL),
('사이클론', 7.00, NULL),
('체스트 프레스', 5.00, NULL),
('제자리뛰기', 5.50, NULL),
('트랙걷기', 4.50, NULL),
('운동장 걷기', 4.50, NULL),
('배드민턴 랠리', 4.50, NULL),
('걷기', 4.50, NULL),
('농구슈팅 연습', 4.50, NULL),
('재즈댄스', 4.80, NULL),
('트위스트 댄스', 4.80, NULL),
('헬스(격렬하게)', 7.80, NULL),
('테니스 복식경기', 5.00, NULL),
('레프팅', 5.00, NULL),
('에어로빅(저강도)', 5.00, NULL),
('에어로빅(중강도)', 6.50, NULL),
('에어로빅(고강도)', 7.30, NULL),
('댄스(가볍게)', 4.50, NULL),
('살사댄스', 4.50, NULL),
('플라멩고', 4.50, NULL),
('포크댄스', 7.80, NULL),
('다이어트 댄스', 4.50, NULL),
('싸이클', 7.00, NULL),
('볼륨댄스', 5.50, NULL),
('스포츠댄스', 5.50, NULL),
('댄스스포츠', 5.50, NULL),
('탱고', 5.50, NULL),
('테니스 단식경기', 7.00, NULL),
('달리기/걷기', 6.00, NULL),
('재즈사이즈', 6.00, NULL),
('런닝머신(달리기)', 9.00, NULL),
('웨이트운동(보통으로) - 전신', 5.00, NULL),
('웨이트운동(가볍게) - 전신', 3.50, NULL),
('저항성운동(가볍게) - 전신', 3.50, NULL),
('보디빌딩(격렬하게)', 6.00, NULL),
('보디빌딩(가볍게)', 3.50, NULL),
('레그 프레스', 5.00, NULL),
('아령들기', 5.50, NULL),
('훌라후프', 5.50, NULL),
('캠핑', 2.50, NULL),
('케틀벨', 5.50, NULL),
('스텝박스', 5.50, NULL),
('계단내려가기', 3.00, NULL),
('계단오르기', 8.00, NULL),
('스크린골프', 4.00, NULL),
('턱걸이(보통으로)', 5.00, NULL),
('풀업(가볍게) - 상지(어깨)', 2.80, NULL),
('풀업(보통으로) - 상지(어깨)', 3.80, NULL),
('로프운동', 6.00, NULL),
('스키', 6.00, NULL),
('스키(가볍게)', 5.00, NULL),
('스키머신(보통으로)', 6.80, NULL),
('하이킹', 6.00, NULL),
('산책', 4.00, NULL),
('산행', 4.00, NULL),
('풋살', 8.00, NULL),
('족구', 5.50, NULL),
('에어로빅', 6.00, NULL),
('수상스키', 6.00, NULL),
('야구피칭', 6.00, NULL),
('수영(자유영)', 6.10, NULL),
('자유수영', 6.00, NULL),
('빠르게 걷기', 6.00, NULL),
('모래주머니 차고 걷기', 6.80, NULL),
('속보', 6.00, NULL),
('권투펀칭', 6.00, NULL),
('댄스(고강도)', 7.00, NULL),
('등산', 7.00, NULL),
('달리기', 7.00, NULL),
('고정식자전거타기(30~50 Watts)', 3.50, NULL),
('고정식자전거타기(90~100 Watts)', 6.80, NULL),
('고정식자전거타기(161~200 Watts)', 11.00, NULL),
('고정식자전거타기(약하게)', 5.50, NULL),
('자전거타기', 7.00, NULL),
('실내자전거타기(약하게)', 5.50, NULL),
('축구연습', 7.00, NULL),
('조깅', 7.00, NULL),
('런닝', 7.00, NULL),
('스피닝', 9.00, NULL),
('서키트 트레이닝(격렬하게)', 8.00, NULL),
('수영(배영)', 8.00, NULL),
('배구시합', 8.00, NULL),
('아이스하키', 8.00, NULL),
('농구시합', 8.00, NULL),
('줄넘기(빠르게)', 9.00, NULL),
('축구시합', 10.00, NULL),
('라켓볼 시합', 10.00, NULL),
('하프마라톤', 9.00, NULL),
('킥복싱', 10.00, NULL),
('암벽등반', 11.00, NULL),
('수영(접영)', 11.00, NULL),
('산악자전거(격렬하게)', 14.00, NULL),
('BMX 자전거타기', 8.50, NULL),
('캠프 단체훈련(예, 해병대 캠프 등)', 5.00, NULL),
('파워워킹', 6.00, NULL),
('모던댄스', 4.80, NULL),
('트래킹', 5.00, NULL),
('뛰기', 7.00, NULL),
('고정식자전거타기(보통으로)', 7.00, NULL),
('고정식자전거타기(51~89 Watts)', 4.80, NULL),
('고정식자전거타기(101~160 Watts)', 8.80, NULL),
('고정식자전거타기(201~270 Watts)', 14.00, NULL),
('실내자전거타기', 7.00, NULL),
('라켓볼연습', 7.00, NULL),
('축구 프리킥 차기', 7.00, NULL),
('비치발리볼', 8.00, NULL),
('맨손 줄넘기', 7.00, NULL),
('줄넘기(천천히)', 8.00, NULL),
('산악자전거(보통으로)', 8.50, NULL),
('프리스비 얼티메이트', 8.00, NULL),
('마라톤', 9.00, NULL),
('태권도', 10.00, NULL),
('스쿼시', 12.00, NULL),
('산악자전거 시합', 16.00, NULL),
('건강증진 비디오 게임 격렬하게(예, 위피트 등)', 7.20, NULL),
('커브스 30분 여성 순환운동', 3.50, NULL),
('팔굽혀펴기(가볍게)', 3.00, NULL),
('팔굽혀펴기(보통으로)', 5.00, NULL),
('푸쉬업(보통으로)', 5.00, NULL),
('니킥', 5.50, NULL),
('런지(격렬하게)', 8.00, NULL),
('사이드 런지', 5.50, NULL),
('윗몸일으키기(보통으로)', 3.80, NULL),
('복근운동(가볍게)', 2.80, NULL),
('복근운동(격렬하게)', 8.00, NULL),
('크런치(보통으로)', 5.00, NULL),
('점프 스쿼트', 6.00, NULL),
('코어운동', 4.50, NULL),
('렛풀다운', 5.00, NULL),
('헬스(보통으로)', 5.50, NULL),
('근력운동(전신)', 5.50, NULL),
('하체 근력운동', 5.00, NULL),
('웨이트운동(격렬하게) - 전신', 6.00, NULL),
('저항성운동(격렬하게) - 전신', 6.00, NULL),
('저항성운동(보통으로) - 전신', 5.00, NULL),
('보디빌딩(보통으로)', 5.00, NULL),
('바벨 숄더프레스', 5.50, NULL),
('브릿지', 3.50, NULL),
('리버스 컬', 5.00, NULL),
('턱걸이(가볍게)', 3.00, NULL),
('턱걸이(격렬하게)', 8.00, NULL),
('풀업(격렬하게) - 상지(어깨)', 8.00, NULL),
('서키트 트레이닝(보통으로)', 4.30, NULL),
('트램폴린(레크레이션적인)', 3.50, NULL),
('트램폴린(경쟁적인)', 4.50, NULL),
('타바타 운동', 8.00, NULL),
('발레(일반적인)', 5.00, NULL),
('발레(격렬하게)', 6.80, NULL),
('점핑운동(레크레이션적인)', 3.50, NULL),
('점핑운동(경쟁적인)', 4.50, NULL),
('검도', 6.00, NULL),
('펜싱', 6.00, NULL),
('암워킹', 6.00, NULL),
('런닝머신(걷기)', 4.50, NULL),
('승마운동기구', 5.00, NULL),
('시티드 로우', 5.00, NULL),
('국선도', 4.50, NULL),
('양팔줄당기기(야외운동기구)', 2.50, NULL),
('근력운동', 8.00, NULL),
('원 암 덤벨로우', 5.00, NULL),
('필라테스(기구)', 5.00, NULL),
('슬로우버피(일반적인)', 5.50, NULL),
('풀 스쿼트', 6.00, NULL),
('복근운동(보통으로)', 3.80, NULL),
('이클립스', 7.00, NULL),
('워킹', 4.50, NULL),
('헬스(가볍게)', 5.00, NULL),
('디스코 댄스', 7.80, NULL),
('줌바댄스', 5.00, NULL),
('상체 근력운동', 5.50, NULL),
('유도', 10.00, NULL),
('건강증진 비디오 게임 보통으로(예, 위피트 등)', 3.80, NULL),
('배드민턴 시합', 7.00, NULL),
('고정식자전거(격렬하게)', 10.50, NULL),
('런지(가볍게)', 2.80, NULL),
('스쿠버 다이빙', 6.00, NULL),
('복싱', 7.80, NULL),
('트위스트 런', 5.00, NULL),
('걷기(산책수준)', 3.00, NULL),
('워킹런지', 5.50, NULL),
('공중걷기', 3.50, NULL),
('프롭테라피', 3.80, NULL),
('박스점프', 5.50, NULL),
('암풀다운', 4.00, NULL),
('시티드로우', 4.00, NULL),
('스텝밀', 7.00, NULL),
('덤벨 바디 로테이션', 5.00, NULL),
('트라이셉스 푸시 다운', 5.00, NULL),
('뒤로 걷기', 3.00, NULL),
('수영(평영)', 5.30, NULL),
('실내 스케이팅', 7.00, NULL),
('레그 익스텐션', 5.00, NULL),
('이두 컬', 5.00, NULL),
('해머 컬', 5.00, NULL),
('덩키킥', 7.00, NULL),
('허리돌리기(야외운동기구)', 2.50, NULL),
('팔돌리기(야외운동기구)', 2.50, NULL),
('등허리지압기(야외운동기구)', 2.50, NULL),
('크로스 핏', 8.00, NULL),  
('마운팅클라이밍', 7.00, NULL),
('음파진동기', 2.50, NULL),
('와이드 스쿼트', 5.50, NULL),
('배구연습(일반적인)', 4.00, NULL),
('폼롤러', 3.00, NULL),
('인클라인 벤치 프레스', 5.00, NULL),
('스탠딩 카프 레이즈', 5.00, NULL),
('백 익스텐션', 3.50, NULL),
('버티기', 1.00, NULL),
('할로우 보디홀드', 3.00, NULL),
('천국의계단', 8.00, NULL),
('홈트레이닝-유산소운동', 7.00, NULL),
('프리테니스', 7.00, NULL),
('렛 풀 다운', 5.00, NULL),
('게이트볼', 3.00, NULL),
('킥 백', 5.00, NULL),
('사이드 밴드', 3.50, NULL),
('사이드 크런치', 4.00, NULL),
('산악mtB', 8.00, NULL),
('벤트 오버 레터럴 레이즈', 5.50, NULL),
('밸리댄스', 4.50, NULL),
('(윈드)서핑', 5.00, NULL),
('덤벨 프레스', 5.00, NULL),
('방송댄스', 7.00, NULL),
('리버스 팩 덱 플라이', 4.00, NULL),
('슈퍼맨자세', 5.00, NULL),
('조정(로잉머신)', 4.80, NULL),
('주짓수_시합, 격렬하게', 10.30, NULL),
('국민체조', 3.50, NULL),
('파크골프', 4.30, NULL),
('어시스트 풀업', 5.00, NULL),
('스포츠클라이밍', 7.00, NULL),
('인터벌 런닝', 8.00, NULL),
('수영(IM)', 8.00, NULL),
('힙 어브덕션', 5.00, NULL),
('점프 버피테스트', 8.50, NULL),
('행잉 레그레이즈', 10.00, NULL),
('세라밴드', 3.50, NULL),
('마운틴 클라이머', 7.00, NULL),
('슬릭부스트', 7.00, NULL),
('랫플다운', 4.00, NULL),
('팔굽혀매달리기', 5.00, NULL),
('폴댄스', 5.50, NULL),
('태보', 7.00, NULL),
('오리발 수영', 7.00, NULL),
('벤트 오버 바벨 로우', 5.50, NULL),
('제기차기', 3.00, NULL),
('플라잉 요가', 4.00, NULL),
('리어델트 머신', 5.00, NULL),
('케이블 크로스 오버', 5.00, NULL),
('맨발걷기', 4.50, NULL),
('씨름', 6.00, NULL),
('플랭크', 3.80, NULL),
('레그 컬', 5.00, NULL),
('루마니안 데드리프트', 5.00, NULL),
('앉아서 다리들기', 2.50, NULL),
('런닝머신(빠르게걷기)', 6.00, NULL),
('레터럴 레이즈', 5.00, NULL),
('승마(천천히)', 3.80, NULL),
('승마(빠르게)', 5.80, NULL),
('타바타운동', 9.00, NULL),
('마이마운틴', 5.50, NULL),
('로드자전거(중강도)', 8.00, NULL),
('누워서 걷기', 3.50, NULL),
('W익스텐션', 4.00, NULL),
('백 스쿼트', 6.00, NULL),
('15초인터벌트레이닝!', 8.80, NULL),
('스쿼트 덤벨 프레스', 7.00, NULL),
('고전무용', 6.00, NULL),
('평행봉', 5.50, NULL),
('스티프 레그 데드리프트', 8.00, NULL),
('수중 걷기', 3.50, NULL),
('덤벨 숄더프레스', 5.50, NULL),
('철봉매달리기', 3.80, NULL),
('트라이셉스 익스텐션', 5.00, NULL),
('펙덱 플라이', 5.50, NULL),
('벤치 프레스', 5.00, NULL),
('스케이팅', 7.00, NULL),
('짐볼운동', 3.80, NULL),
('108배', 2.00, NULL),
('덤벨 플라이', 5.50, NULL),
('버피테스트', 10.00, NULL),
('주짓수_훈련, 연습', 5.30, NULL),
('패들보드', 6.00, NULL),
('국궁', 4.30, NULL),
('기체조', 4.50, NULL),
('러시안트위스트', 4.00, NULL),
('일립티컬', 6.00, NULL),
('크로스 크런치', 4.50, NULL),
('아쉬탕가 요가', 5.00, NULL),
('슈퍼맨로우', 4.00, NULL),
('딥스', 5.50, NULL),
('악력기 운동', 1.30, NULL),
('버드독', 3.80, NULL),
('컨벤셔널 데드리프트', 8.00, NULL),
('탁구시합', 5.00, NULL),
('EMS트레이닝', 7.00, NULL),
('데드버그', 4.00, NULL),
('인라인스케이트', 5.00, NULL),
('사이드 플랭크', 3.80, NULL),
('고블릿 스쿼트', 5.50, NULL),
('AB 롤아웃', 8.00, NULL),
('SNPE', 5.00, NULL),
('로드바이크', 8.50, NULL),
('플로터킥', 5.00, NULL),
('사이드 레그레이즈', 4.00, NULL),
('벽 스쿼트', 5.00, NULL),
('TRX 운동', 7.00, NULL),
('월볼샷', 6.00, NULL),
('시티드 니업', 5.00, NULL),
('데드 리프트', 5.50, NULL),
('벤치딥스', 3.00, NULL),
('고양이자세', 3.50, NULL),
('프론트 풀다운', 4.00, NULL),
('픽시자전거', 8.00, NULL),
('노르딕워킹', 6.00, NULL),
('난타', 3.80, NULL),
('프론트 레이즈', 5.00, NULL),
('사이드 레터럴 레이즈', 5.00, NULL),
('제자리 걷기', 2.00, NULL),
('필라테스', 3.00, NULL),
('양팔벌려 제자리 뛰기(PT체조)', 3.00, NULL),
('정구 단식경기(일반적인)', 7.00, NULL),
('정구 복식경기', 5.00, NULL),
('(SUP)서핑', 6.00, NULL),
('딥다라인 댄스', 3.00, NULL),
('로우', 5.00, NULL),
('풀업(턱걸이)', 5.00, NULL),
('레그 킥 백', 5.00, NULL),
('프리다이빙', 7.00, NULL),
('힙 쓰러스트', 6.00, NULL),
('스플릿 스쿼트', 5.00, NULL),
('새천년체조', 3.50, NULL),
('번지피지오', 5.00, NULL),
('wty운동', 7.00, NULL),
('스텝퍼', 5.00, NULL)
)
INSERT INTO exercise_catalog (exercise_name, energy_per_kg_hr, memo, type_no)
SELECT
  v.exercise_name,
  v.energy_per_kg_hr,
  v.memo,
  CASE
    -- 1) 유산소
    WHEN v.exercise_name ~* '(걷기|워킹|파워워킹|속보|빠르게 ?걷기|제자리 ?걷기|트랙걷기|운동장 ?걷기|런닝머신\(?걷기\)?|러닝머신\(?걷기\)?|달리기|조깅|런닝|인터벌 ?런닝|하프마라톤|마라톤|등산|하이킹|트래킹|산행|노르딕워킹|자전거|실내자전거|고정식자전거|로드바이크|로드자전거|산악자전거|픽시자전거|일립티컬|엘립티컬|스텝퍼|스테퍼|스텝밀|마이마운틴|천국의계단|로잉|조정|로잉머신|아쿠아로빅|수중 ?걷기|수중 ?에어로빅|킥판|플로터킥|줄넘기|맨손 ?줄넘기|에어로빅(\(저강도\)|\(중강도\)|\(고강도\))?|재즈사이즈|다이어트 ?댄스|줌바|댄스\(가볍게\)|댄스\(고강도\)|디스코 ?댄스|라인댄스|모던댄스|방송댄스|스포츠댄스|트위스트 ?댄스|폴댄스|스케이팅|실내 ?스케이팅|인라인스케이트|스키머신|스키\(가볍게\)|스키|스케이트|\(SUP\)?서핑|서핑|패들보드|프리스비|프리테니스|홈트레이닝-유산소운동)'
      THEN (SELECT type_no FROM exercise_type WHERE type_code='CARDIO')

    -- 2) 근력
    WHEN v.exercise_name ~* '(스쿼트|백 ?스쿼트|와이드 ?스쿼트|점프 ?스쿼트|고블릿 ?스쿼트|스플릿 ?스쿼트|런지|사이드 ?런지|워킹 ?런지|니 ?킥|킥 ?백|레그 ?프레스|레그 ?익스텐션|레그 ?컬|레그 ?레이즈|힙 ?쓰러스트|힙 ?어브덕션|카프 ?레이즈|스탠딩 ?카프 ?레이즈|벤치 ?프레스|인클라인 ?벤치 ?프레스|덤벨 ?프레스|체스트 ?프레스|숄더 ?프레스|오버헤드 ?프레스|바벨|덤벨|케틀벨|케이블|케이블 ?크로스 ?오버|랫 ?풀 ?다운|랫풀다운|프론트 ?풀 ?다운|펙덱 ?플라이|덤벨 ?플라이|리버스 ?팩 ?덱 ?플라이|플라이|레터럴 ?레이즈|사이드 ?레터럴 ?레이즈|프론트 ?레이즈|리어델트 ?머신|시티드 ?로우|로우|원 ?암 ?덤벨로우|벤트 ?오버 ?바벨 ?로우|벤트 ?오버 ?레터럴 ?레이즈|리버스 ?컬|이두 ?컬|해머 ?컬|트라이셉스 ?익스텐션|트라이셉스 ?푸시 ?다운|백 ?익스텐션|등 ?허리 ?지압기|철봉매달리기|행잉 ?레그레이즈|코어운동|플랭크|사이드 ?플랭크|브릿지|버드독|슈퍼맨자세|슈퍼맨로우|AB ?롤아웃|짐볼운동|폼롤러|세라밴드|EMS트레이닝|크로스 ?핏|서키트 ?트레이닝|헬스|웨이트 ?운동|근력운동|보디빌딩|저항성운동|니업|시티드 ?니업|암워킹|데드)'
      THEN (SELECT type_no FROM exercise_type WHERE type_code='STRENGTH')

    -- 3) 스포츠
    WHEN v.exercise_name ~* '(축구|풋살|농구|배구|야구|테니스|정구|배드민턴|탁구|라켓볼|스쿼시|골프|파크골프|게이트볼|볼링|하키|아이스하키|럭비|핸드볼|씨름|검도|펜싱|유도|태권도|합기도|주짓수|킥복싱|복싱|국궁|수영|프리다이빙|스쿠버 ?다이빙|카누|카약|요트|비치발리볼|프리스비 ?얼티메이트|경기|평행봉|트램폴린\(경쟁적인\))'
      THEN (SELECT type_no FROM exercise_type WHERE type_code='SPORTS')

    -- 4) 필라테스/체조
    WHEN v.exercise_name ~* '(필라테스(\(기구\))?|요가|하타 ?요가|파워요가|아쉬탕가 ?요가|수리야 ?나마스까|타이치|태극권|체조|국민체조|새천년체조|PT체조|기체조|국선도|유연체조|스트레칭|SNPE|108배|명상)'
      THEN (SELECT type_no FROM exercise_type WHERE type_code='PILATES')

    -- 기타
    ELSE (SELECT type_no FROM exercise_type WHERE type_code='OTHER')
END
FROM v;


  -- 하체/전신
UPDATE EXERCISE_CATALOG SET MEMO='무릎 안쪽 모으지 말고 힙 뒤로' WHERE exercise_name='바벨 스쿼트';
UPDATE EXERCISE_CATALOG SET MEMO='가슴 펴고 무릎-발끝 일직선' WHERE exercise_name='스쿼트';
UPDATE EXERCISE_CATALOG SET MEMO='엉덩이 뒤로, 발바닥 전체 눌러서' WHERE exercise_name='와이드 스쿼트';
UPDATE EXERCISE_CATALOG SET MEMO='무릎 발끝 동일 방향. 보폭 고정' WHERE exercise_name='런지(보통으로)';
UPDATE EXERCISE_CATALOG SET MEMO='코어 조이고 천천히' WHERE exercise_name='런지(격렬하게)';
UPDATE EXERCISE_CATALOG SET MEMO='보폭 짧게, 균형 중시' WHERE exercise_name='런지(가볍게)';
UPDATE EXERCISE_CATALOG SET MEMO='측면 자극, 무릎 접지 말기' WHERE exercise_name='사이드 런지';
UPDATE EXERCISE_CATALOG SET MEMO='덤벨 가슴앞, 깊게 앉기.' WHERE exercise_name='고블릿 스쿼트';
UPDATE EXERCISE_CATALOG SET MEMO='점프 착지 조용히. 무릎 보호.' WHERE exercise_name='점프 스쿼트';
UPDATE EXERCISE_CATALOG SET MEMO='등 중립 유지, 허리 과신전 금지.' WHERE exercise_name='컨벤셔널 데드리프트';
UPDATE EXERCISE_CATALOG SET MEMO='햄스트링 당김 느끼며 힙힌지.' WHERE exercise_name='루마니안 데드리프트';
UPDATE EXERCISE_CATALOG SET MEMO='하체 고정, 고중량 주의.' WHERE exercise_name='스티프 레그 데드리프트';
UPDATE EXERCISE_CATALOG SET MEMO='발뒤꿈치로 밀기, 허리 뜨지 않기.' WHERE exercise_name='레그 프레스';
UPDATE EXERCISE_CATALOG SET MEMO='무릎 완전 잠그지 않기.' WHERE exercise_name='레그 익스텐션';
UPDATE EXERCISE_CATALOG SET MEMO='힙 말리지 않게.' WHERE exercise_name='레그 컬';
UPDATE EXERCISE_CATALOG SET MEMO='천천히 최상단 수축.' WHERE exercise_name='스탠딩 카프 레이즈';
UPDATE EXERCISE_CATALOG SET MEMO='등 대지 밀착, 힙 최상단 1초 정지.' WHERE exercise_name='힙 쓰러스트';
UPDATE EXERCISE_CATALOG SET MEMO='무릎 모이지 않게.' WHERE exercise_name='스플릿 스쿼트';
UPDATE EXERCISE_CATALOG SET MEMO='벽 기대고 90도 유지.' WHERE exercise_name='벽 스쿼트';

-- 가슴/등/어깨/팔
UPDATE EXERCISE_CATALOG SET MEMO='어깨 내리고 견갑 고정.' WHERE exercise_name='벤치 프레스';
UPDATE EXERCISE_CATALOG SET MEMO='하단 1초 정지, 반동 금지.' WHERE exercise_name='덤벨 프레스';
UPDATE EXERCISE_CATALOG SET MEMO='팔꿈치 너무 벌리지 않기.' WHERE exercise_name='인클라인 벤치 프레스';
UPDATE EXERCISE_CATALOG SET MEMO='가슴 스트레치, 과도한 하중 금지.' WHERE exercise_name='덤벨 플라이';
UPDATE EXERCISE_CATALOG SET MEMO='팔꿈치 손목 일직선.' WHERE exercise_name='체스트 프레스';
UPDATE EXERCISE_CATALOG SET MEMO='가슴 수축 집중, 반동 금지. 10~12회×3' WHERE exercise_name='펙덱 플라이';
UPDATE EXERCISE_CATALOG SET MEMO='광배로 당기고 팔로 끌지 않기. 8~12회×3' WHERE exercise_name='랫플다운';
UPDATE EXERCISE_CATALOG SET MEMO='가슴 열고 바를 복부로. 8~12회×3' WHERE exercise_name='벤트 오버 바벨 로우';
UPDATE EXERCISE_CATALOG SET MEMO='허리 고정, 팔꿈치 뒤로 당기기. 10~12회×3' WHERE exercise_name='시티드 로우';
UPDATE EXERCISE_CATALOG SET MEMO='어깨 으쓱 금지, 광배 수축. 8~12회×3' WHERE exercise_name='렛 풀 다운';
UPDATE EXERCISE_CATALOG SET MEMO='코어 단단히, 귀-어깨 멀어지게. 8~12회×3' WHERE exercise_name='바벨 숄더프레스';
UPDATE EXERCISE_CATALOG SET MEMO='반동 금지, 90도까지만. 12~15회×3' WHERE exercise_name='레터럴 레이즈';
UPDATE EXERCISE_CATALOG SET MEMO='어깨 끌어올리지 않기. 12~15회×3' WHERE exercise_name='사이드 레터럴 레이즈';
UPDATE EXERCISE_CATALOG SET MEMO='상완 전면 수축 느끼기. 10~12회×3' WHERE exercise_name='이두 컬';
UPDATE EXERCISE_CATALOG SET MEMO='손목 꺾지 않기. 10~12회×3' WHERE exercise_name='해머 컬';
UPDATE EXERCISE_CATALOG SET MEMO='팔꿈치 고정, 아래서 잠깐 정지. 10~12회×3' WHERE exercise_name='리버스 컬';
UPDATE EXERCISE_CATALOG SET MEMO='팔꿈치 벌어지지 않게. 10~12회×3' WHERE exercise_name='트라이셉스 푸시 다운';
UPDATE EXERCISE_CATALOG SET MEMO='상완 고정, 끝까지 펴주기. 10~12회×3' WHERE exercise_name='트라이셉스 익스텐션';
UPDATE EXERCISE_CATALOG SET MEMO='가슴 내리고 90도 이하. 6~10회×3' WHERE exercise_name='딥스';
UPDATE EXERCISE_CATALOG SET MEMO='광배로 몸 끌어올리기. 3~8회×3' WHERE exercise_name='풀업(턱걸이)';
UPDATE EXERCISE_CATALOG SET MEMO='보조 밴드 사용, 정복습. 8~10회×3' WHERE exercise_name='어시스트 풀업';
UPDATE EXERCISE_CATALOG SET MEMO='정지 1초, 반동 금지. 6~10회×3' WHERE exercise_name='벤치딥스';

-- 코어/복근
UPDATE EXERCISE_CATALOG SET MEMO='허리 뜨지 않게 복부 끌어당김. 12~15회×3' WHERE exercise_name='크런치(보통으로)';
UPDATE EXERCISE_CATALOG SET MEMO='목 당기지 말고 호흡 일정. 15~20회×3' WHERE exercise_name='윗몸일으키기(보통으로)';
UPDATE EXERCISE_CATALOG SET MEMO='반동 금지, 상복부 집중. 12~15회×3' WHERE exercise_name='레그 레이즈';
UPDATE EXERCISE_CATALOG SET MEMO='어깨-엉덩이 일직선 유지.' WHERE exercise_name='플랭크';
UPDATE EXERCISE_CATALOG SET MEMO='골반 중립 유지.' WHERE exercise_name='사이드 플랭크';
UPDATE EXERCISE_CATALOG SET MEMO='복부 당기며 천천히. 8~10회×3' WHERE exercise_name='AB 롤아웃';
UPDATE EXERCISE_CATALOG SET MEMO='대각선 수축, 허리 과신전 금지. 12~15회×3' WHERE exercise_name='크로스 크런치';
UPDATE EXERCISE_CATALOG SET MEMO='코어 고정, 팔·다리 교차. 10~12회×3' WHERE exercise_name='버드독';
UPDATE EXERCISE_CATALOG SET MEMO='흉곽 내리고 허리 밀착. ' WHERE exercise_name='할로우 보디홀드';
UPDATE EXERCISE_CATALOG SET MEMO='천천히 내려가 상복부 타겟. 10~12회×3' WHERE exercise_name='시티드 니업';
UPDATE EXERCISE_CATALOG SET MEMO='매달려 무릎 가슴쪽. 반동 금지. 8~12회×3' WHERE exercise_name='행잉 레그레이즈';

-- 푸시업 계열
UPDATE EXERCISE_CATALOG SET MEMO='견갑 고정, 몸통 일직선. 8~15회×3' WHERE exercise_name='푸쉬업(보통으로)';
UPDATE EXERCISE_CATALOG SET MEMO='무릎 대고 폼 우선. 10~15회×3' WHERE exercise_name='푸쉬업(가볍게)';
UPDATE EXERCISE_CATALOG SET MEMO='상체 하강 천천히, 폭 넓게. 6~12회×3' WHERE exercise_name='팔굽혀펴기(보통으로)';
UPDATE EXERCISE_CATALOG SET MEMO='코어 단단히, 반동 금지. 10~15회×3' WHERE exercise_name='팔굽혀펴기(가볍게)';
UPDATE EXERCISE_CATALOG SET MEMO='파워 유지, 실패 직전까지. 5~10회×3' WHERE exercise_name='팔굽혀펴기(격렬하게)';

-- 유산소/지구력
UPDATE EXERCISE_CATALOG SET MEMO='발뒤꿈치 과접지 금지' WHERE exercise_name='런닝';
UPDATE EXERCISE_CATALOG SET MEMO='호흡 3:3, 자세 곧게. ' WHERE exercise_name='조깅';
UPDATE EXERCISE_CATALOG SET MEMO='보폭 짧게, 팔 자연스윙' WHERE exercise_name='걷기';
UPDATE EXERCISE_CATALOG SET MEMO='경사 1~3%' WHERE exercise_name='런닝머신(달리기)';
UPDATE EXERCISE_CATALOG SET MEMO='속도 5~6km/h' WHERE exercise_name='런닝머신(걷기)';
UPDATE EXERCISE_CATALOG SET MEMO='케이던스 일정' WHERE exercise_name='실내자전거타기';
UPDATE EXERCISE_CATALOG SET MEMO='RPM 80±, 안장 높이 맞춤' WHERE exercise_name='스피닝';
UPDATE EXERCISE_CATALOG SET MEMO='무릎 통증 시 강도↓. ' WHERE exercise_name='스텝퍼';
UPDATE EXERCISE_CATALOG SET MEMO='리듬 일정, 손목 이완' WHERE exercise_name='줄넘기(천천히)';
UPDATE EXERCISE_CATALOG SET MEMO='착지 소리 최소화. ' WHERE exercise_name='줄넘기(빠르게)';
UPDATE EXERCISE_CATALOG SET MEMO='호흡 2:2, 1:1 인터벌' WHERE exercise_name='인터벌 런닝';
UPDATE EXERCISE_CATALOG SET MEMO='리듬 유지, 과신전 주의' WHERE exercise_name='일립티컬';
UPDATE EXERCISE_CATALOG SET MEMO='체간 세워 상하 대칭' WHERE exercise_name='노르딕워킹';
UPDATE EXERCISE_CATALOG SET MEMO='속보로 팔 크게' WHERE exercise_name='빠르게 걷기';
UPDATE EXERCISE_CATALOG SET MEMO='경사/속도 교차변경' WHERE exercise_name='천국의계단';
UPDATE EXERCISE_CATALOG SET MEMO='낮은 강도 지속, 회복용. ' WHERE exercise_name='산책';

-- 수영/레저
UPDATE EXERCISE_CATALOG SET MEMO='스트로크 길게, 호흡 교대. 20~30렙' WHERE exercise_name='수영(자유영)';
UPDATE EXERCISE_CATALOG SET MEMO='킥 리듬 일정, 허리 과신전 주의. 20렙' WHERE exercise_name='수영(배영)';
UPDATE EXERCISE_CATALOG SET MEMO='개구리킥 천천히, 글라이드. 20렙' WHERE exercise_name='수영(평영)';
UPDATE EXERCISE_CATALOG SET MEMO='돌핀킥 짧게, 상체 과사용 금지. 10~20렙' WHERE exercise_name='수영(접영)';
UPDATE EXERCISE_CATALOG SET MEMO='심박 관리, 안전 최우선' WHERE exercise_name='스쿠버 다이빙';

-- 격투/구기
UPDATE EXERCISE_CATALOG SET MEMO='가드 올리고 허리 회전.' WHERE exercise_name='복싱';
UPDATE EXERCISE_CATALOG SET MEMO='킥 후 복귀 빠르게.' WHERE exercise_name='킥복싱';
UPDATE EXERCISE_CATALOG SET MEMO='낮은 스탠스, 중심 낮추기. 3~5세트' WHERE exercise_name='태권도';
UPDATE EXERCISE_CATALOG SET MEMO='브릿지·가드 드릴 병행. 3~5세트' WHERE exercise_name='주짓수_훈련, 연습';
UPDATE EXERCISE_CATALOG SET MEMO='워밍업 충분, 낙법 숙지' WHERE exercise_name='유도';
UPDATE EXERCISE_CATALOG SET MEMO='풋워크 우선, 손목 이완' WHERE exercise_name='배드민턴 시합';
UPDATE EXERCISE_CATALOG SET MEMO='세컨드서비스 안정, 풋워크' WHERE exercise_name='테니스 단식경기';
UPDATE EXERCISE_CATALOG SET MEMO='공간침투·패스 연계 연습' WHERE exercise_name='축구시합';
UPDATE EXERCISE_CATALOG SET MEMO='리바운드 집중, 수비스텝' WHERE exercise_name='농구시합';
UPDATE EXERCISE_CATALOG SET MEMO='서브·리시브 루틴 확립' WHERE exercise_name='배구시합';
UPDATE EXERCISE_CATALOG SET MEMO='스윙 가속 말고 궤적. 라운드 관리' WHERE exercise_name='골프';

-- 전신 서킷/그룹
UPDATE EXERCISE_CATALOG SET MEMO='폼 유지 최우선, 과열 금지' WHERE exercise_name='서키트 트레이닝(격렬하게)';
UPDATE EXERCISE_CATALOG SET MEMO='리듬·가동성 중시, 과신전 금지' WHERE exercise_name='에어로빅(중강도)';
UPDATE EXERCISE_CATALOG SET MEMO='심박 70~85% 유지' WHERE exercise_name='헬스(보통으로)';

-- 유연/회복
UPDATE EXERCISE_CATALOG SET MEMO='호흡 4-4, 반동 금지.' WHERE exercise_name='스트레칭(가볍게)';
UPDATE EXERCISE_CATALOG SET MEMO='복식호흡, 통증 전까지만' WHERE exercise_name='요가';
UPDATE EXERCISE_CATALOG SET MEMO='정렬 중시, 무리 금지' WHERE exercise_name='하타 요가';
UPDATE EXERCISE_CATALOG SET MEMO='흔들림 최소, 코어 고정' WHERE exercise_name='필라테스';
UPDATE EXERCISE_CATALOG SET MEMO='근막 이완' WHERE exercise_name='폼롤러';
UPDATE EXERCISE_CATALOG SET MEMO='허리 과신전 금지' WHERE exercise_name='고양이자세';

-- 로잉/카디오 머신
UPDATE EXERCISE_CATALOG SET MEMO='순서: 다리→몸통→팔.' WHERE exercise_name='조정(로잉머신)';
UPDATE EXERCISE_CATALOG SET MEMO='저항 낮게, 리듬 유지' WHERE exercise_name='스키머신(보통으로)';
UPDATE EXERCISE_CATALOG SET MEMO='RPM 일정, 저항 3~6. ' WHERE exercise_name='싸이클';
UPDATE EXERCISE_CATALOG SET MEMO='RPM 일정, 저항 3~6.' WHERE exercise_name='사이클론';
UPDATE EXERCISE_CATALOG SET MEMO='RPM 일정, 저항 3~6.' WHERE exercise_name='싸이클론';

-- 레저/기타 가벼운 활동
UPDATE EXERCISE_CATALOG SET MEMO='가벼운 활동, 허리 스트레칭' WHERE exercise_name='낚시';
UPDATE EXERCISE_CATALOG SET MEMO='허리 보호대, 물 자주 마시기' WHERE exercise_name='대청소';
UPDATE EXERCISE_CATALOG SET MEMO='허리 굽히지 말고 무릎 사용' WHERE exercise_name='세차';

-- 버피/점프류 (강도 높음)
UPDATE EXERCISE_CATALOG SET MEMO='스쿼트-플랭크-점프 완전 가동.' WHERE exercise_name='버피테스트';
UPDATE EXERCISE_CATALOG SET MEMO='점프 낮춰 폼 우선.' WHERE exercise_name='점프 버피테스트';

-- 디폴트(아직 NULL 남은 항목 전부 기본 메모 채움)
UPDATE EXERCISE_CATALOG
SET MEMO='자세 우선·무리 금지·통증 시 즉시 중단'
WHERE MEMO IS NULL;

