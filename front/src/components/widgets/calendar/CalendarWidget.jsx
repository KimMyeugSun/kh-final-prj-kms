import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ko from 'date-fns/locale/ko';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';
import './CalendarWidget.css';

const TYPE_COLORS = {
  meal: '#f59e0b', // 식사: 주황
  workout: '#3b82f6', // 운동: 파랑
  research: '#10b981', // 리서치: 초록 (아직 미구현)
};

const locales = { ko };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

// 헤더 라벨 형식 지정: "2025년 10월"
const formats = {
  monthHeaderFormat: (date, _culture, l) => l.format(date, 'yyyy년 M월', 'ko'),
};

const getTypeKey = (evt) => {
  const v = (evt.type || evt.kind || evt.category || '')
    .toString()
    .toLowerCase()
    .trim();
  if (['meal', '식사', 'food', '음식'].includes(v)) return 'meal';
  if (['workout', '운동', 'exercise'].includes(v)) return 'workout';
  if (['research', '리서치'].includes(v)) return 'research';
  return null;
};

export default function CalendarWidget({
  events = [],
  onEdit,
  style,
  onRange,
}) {
  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <Calendar
        culture="ko"
        localizer={localizer}
        views={['month']} // 월만 사용
        defaultView="month"
        formats={formats} // ← 헤더 형식 적용 (2025년 10월)
        selectable={false} // 빈날 클릭 추가 금지
        drilldownView={null} // 일/주로 드릴다운 방지
        popup
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(e) => onEdit && onEdit(e)}
        onRangeChange={(range) => {
          // month view일 때 range = { start: Date, end: Date }
          const start = range.start || range[0];
          const end = range.end || range[1];
          onRange && onRange(start, end);
        }}
        messages={{
          month: '월',
          week: '주',
          day: '일',
          today: '오늘',
          previous: '이전',
          next: '다음',
          showMore: (c) => `+${c} 더보기`,
          date: '날짜',
          time: '시간',
          event: '일정',
          noEventsInRange: '해당 범위에 일정이 없습니다.',
        }}
        eventPropGetter={(evt) => {
          const key = getTypeKey(evt);
          const bg = evt.color || (key ? TYPE_COLORS[key] : '#2D7DF6');
          return {
            style: {
              backgroundColor: bg,
              borderRadius: 8,
              border: 'none',
              color: '#fff',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
            },
          };
        }}
      />
    </div>
  );
}
