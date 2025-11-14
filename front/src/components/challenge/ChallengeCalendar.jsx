import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateCalendar,
  PickersDay,
  PickersCalendarHeader,
} from '@mui/x-date-pickers';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/ko';
import { koKR } from '@mui/x-date-pickers/locales';

dayjs.extend(updateLocale);
dayjs.updateLocale('ko', { weekStart: 1 });

const ChallengeCalendar = ({ certMap = {}, onSelectDate }) => {
  const marked = useMemo(() => new Set(Object.keys(certMap || {})), [certMap]);

  const CELL_WIDTH = 120;
  const CELL_HEIGHT = 80;

  const today = dayjs();
  const monthStart = today.startOf('month');
  const monthEnd = today.endOf('month');

  const SquarePickersDay = styled(PickersDay)(({ theme }) => ({
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    borderRadius: 0,
    border: '1px solid rgba(0, 0, 0, 0.12)',
    margin: 0,
    fontSize: 0,
    '&.MuiPickersDay-today': {
      border: 'none',
      backgroundColor: '#e6e6e6',
    },

    '&&.Mui-selected': {
      border: '1px solid #dd1212',
      backgroundColor: '#fff',
    },
    '&&.Mui-selected:hover': {
      opacity: 0.5,
    },
  }));

  const CustomDateCalendar = styled(DateCalendar, {
    shouldForwardProp: (prop) => prop !== 'defaultCalendarMonth',
  })(({ theme }) => ({
    maxHeight: 620,
    width: 900,
    borderRadius: 13,
    border: '1px solid rgba(0, 0, 0, 0.12)',
    height: CELL_HEIGHT * 6 + 120,
    overflow: 'hidden',
    margin: '0 auto',

    '& .MuiDayCalendar-header': {
      display: 'grid',
      gridTemplateColumns: `repeat(7, ${CELL_WIDTH}px)`,
      justifyContent: 'center',
      gap: 0,
      padding: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    '& .MuiDayCalendar-weekDayLabel': {
      width: CELL_WIDTH,
      textAlign: 'center',
      padding: 0,
      margin: 0,
      fontWeight: 600,
      lineHeight: '40px',
      height: 40,
      fontSize: 17,
    },

    '& .MuiDayCalendar-weekDayLabel::after': {
      content: '"요일"',
    },

    '& .MuiDayCalendar-slideTransition': { minHeight: CELL_HEIGHT * 6 + 80 },
    '& .MuiDayCalendar-monthContainer': { overflow: 'visible' },

    // 이전/다음 월 이동 화살표 숨김
    '& .MuiPickersArrowSwitcher-root': {
      display: 'none',
    },

    // "2025년 9월" 라벨 스타일
    '& .MuiPickersCalendarHeader-label': {
      fontWeight: 700,
      color: '#494949',
      fontSize: '20px',
    },

    '& .MuiDayCalendar-weekDayLabel:nth-of-type(7)': {
      color: 'red',
    },
  }));

  const CustomCalendarHeader = (props) => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
        }}
      >
        <PickersCalendarHeader
          {...props}
          sx={{
            flex: 1,
            '& .MuiPickersCalendarHeader-label': {
              fontWeight: 700,
              color: '#494949',
              fontSize: '20px',
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: '#3DA85C' }} />
            <Typography variant="caption" color="text.secondary">
              승인완료
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: '#F48A33' }} />
            <Typography variant="caption" color="text.secondary">
              승인대기
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const Day = (props) => {
    const { day, outsideCurrentMonth, ...rest } = props;
    const key = day.format('YYYY-MM-DD');
    const cert = certMap[key];
    const isApproved = cert?.isApproved;

    return (
      <Box
        sx={{
          position: 'relative',
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
          display: 'inline-block',
        }}
      >
        <SquarePickersDay
          {...rest}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
        />
        {/* 날짜 숫자 */}
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: 4,
            left: 6,
            fontSize: 16,
            color: outsideCurrentMonth ? 'grey.400' : 'text.primary',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {day.date()}
        </Typography>

        {/* 인증 마크 */}
        {cert && (
          <CheckCircleIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 66,
              color: isApproved === 'N' ? '#F48A33' : '#3DA85C',
              pointerEvents: 'none',
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="ko"
      localeText={
        koKR.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <CustomDateCalendar
          onChange={(value) => onSelectDate && onSelectDate(value)}
          views={['day']}
          slots={{
            day: Day,
            calendarHeader: CustomCalendarHeader,
          }}
          disableFuture
          defaultCalendarMonth={today}
          minDate={monthStart}
          maxDate={monthEnd}
          showDaysOutsideCurrentMonth={false}
          slotProps={{
            calendarHeader: {
              format: 'YYYY년 M월',
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default ChallengeCalendar;
