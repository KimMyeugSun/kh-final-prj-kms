import { Box, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CommonTable from '../../components/commons/CommonTable';
import CommonPagination from '../../components/commons/Pagination';
import authFetch from '../../utils/authFetch';
import { useParams } from 'react-router-dom';
import { DateFormat } from '../../define/DateFormat';

const NoticeList = () => {
  const { page } = useParams();
  const [rows, setRows] = useState([]);
  const [pages, setPages] = useState({ page: 1, count: 0 });

  useEffect(() => {
    authFetch(`/api/noticeboard?page=${page - 1}`)
      .then((data) => {
        if (!data.ok) throw new Error('공지사항 조회 실패');
        return data.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('공지사항 데이터 없음');

          setPages((prev) => ({ ...prev, page: data.currentPage + 1, count: data.totalPages }));
          setRows(
            data.rows.map((row) => ({
              no: row.no,
              title: row.title,
              date: DateFormat(new Date(row.createdAt), 'yyyy-MM-dd HH:mm:ss'),
              views: row.viewCount,
            }))
          );
      });
  }, [page]);

  return (
    <Box sx={{ p: 2, userSelect: 'none' }}>
      <Typography  sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>공지사항</Typography>
      <Divider sx={{ mb: 2 }} />
      <CommonTable 
        tableHeader={tableHeader}
        rows={rows}
        getRowLink={(row) => `/notice/lookat/${row.no}`}
        initSort={false}
      />
      <CommonPagination page={pages.page} count={pages.count} />
    </Box>
  );
};

const tableHeader = [
  { header: '번호', field: 'no' },
  { header: '제목', field: 'title' },
  { header: '작성일', field: 'date' },
  { header: '조회수', field: 'views' },
];

export default NoticeList;