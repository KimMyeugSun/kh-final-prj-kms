DO $$
DECLARE
  eno int;
  dno int;
  emp_id text;
  emp_name text;
  emp_pwd text := '1234';
  emp_position text;
  emp_phone text;
  emp_email text;
  emp_address text := '서울특별시, 강남구 ';
  emp_address_detail text := '테헤란로 123';
  surnames text[] := ARRAY['김','이','박','최','정','조','윤','장','임','오','송','한','신','변','추','노','마','공','지','우','곽','육','금','옥','남궁','편','황보','제갈','선우','하','서문','창','옹','종','엽','독고','묵','무'];
  pos_choices text[] := ARRAY['Employee','Associate','AssistantManager','Manager','SeniorManager','DepartmentHead','Director'];
BEGIN
  FOR eno IN 1000..1099 LOOP
    dno := ((eno - 1000) % 11) + 1;
    emp_id := 'tempId' || LPAD((eno - 999)::text,3,'0');

    -- Chairman은 한 명만 (예: eno=1008). 필요하면 다른 eno로 변경
    IF eno = 1008 THEN
      emp_position := 'Chairman';
  	ELSIF eno = 1010 THEN
	    emp_position := 'ChiefExecutiveOfficer';
    ELSE
      emp_position := pos_choices[1 + floor(random() * array_length(pos_choices, 1))];
    END IF;

    -- 이름: 랜덤 성 + 직급 한글표기
    emp_name := surnames[1 + floor(random() * array_length(surnames, 1))] ||
      CASE emp_position
        WHEN 'Employee' THEN '사원'
        WHEN 'Associate' THEN '주임'
        WHEN 'AssistantManager' THEN '대리'
        WHEN 'Manager' THEN '과장'
        WHEN 'SeniorManager' THEN '차장'
        WHEN 'DepartmentHead' THEN '부장'
        WHEN 'Director' THEN '임원'
        WHEN 'ChiefExecutiveOfficer' THEN 'ceo'
        WHEN 'Chairman' THEN '회장'
        ELSE emp_position
      END;

    -- 전화번호: 010-####-#### (eno 기반으로 생성하여 중복 최소화)
    emp_phone := '010-' || LPAD((eno % 10000)::text, 4, '0') || '-' || LPAD(((eno * 123) % 10000)::text, 4, '0');

    -- 이메일: 12자 랜덤 + @gmail.com
    emp_email := substring(md5(random()::text), 1, 12) || '@gmail.com';

    INSERT INTO public.employee (
      eno, dno, emp_id, emp_name, emp_pwd, emp_position,
      created_at, deleted_at, updated_at,
      emp_phone, emp_email, emp_address, emp_address_detail
    )
    VALUES (
      eno, dno, emp_id, emp_name, emp_pwd, emp_position,
      CURRENT_TIMESTAMP, NULL, NULL,
      emp_phone, emp_email, emp_address, emp_address_detail
    );
  END LOOP;

  COMMIT;
END$$;