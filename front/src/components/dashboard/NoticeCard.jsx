import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CardShell from './CardShell';

import CommonTable from '../commons/CommonTable';
import authFetch from '../../utils/authFetch';
import { DateFormat } from '../../define/DateFormat';

export default function NoticeCard({ fixedHeight, size=5 }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    authFetch(`/api/noticeboard/x-latest?size=${size}`)
      .then((res) => res.json())
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('공지사항 데이터 없음');
        
        setRows(
          data.rows.map((row) => ({
            no: row.no,
            title: row.title,
            // date: DateFormat(new Date(row.createdAt), 'yyyy-MM-dd HH:mm:ss'),
            views: row.viewCount,
          }))
      );
      });
  }, []);

  return (
    <CardShell
      title="공지"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...(fixedHeight ? { height: fixedHeight } : {}),
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden'}}>
        <CommonTable
          tableHeader={tableHeader} 
          rows={rows}
          StickyHeaderSx={{ maxHeight: 320, stickyHeader: true }}
          initSort={false}
          getRowLink={(row) => `/notice/lookat/${row.no}`}
        />
      </Box>
    </CardShell>
  );
}
const tableHeader = [
  { field: 'no', header: 'no' },
  { field: 'title', header: '제목' },
  // { field: 'date', header: '작성일' },
  { field: 'views', header: '조회수' },
];