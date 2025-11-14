import { Box, Button, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authFetch from '../../../../utils/authFetch';
import CommonTable from '../../../../components/commons/CommonTable';
import CommonPagination from '../../../../components/commons/Pagination';
import { DateFormat } from '../../../../define/DateFormat';

const ManagementNoticeBoardList = () => {
  const navigate = useNavigate();
  const { page } = useParams();
  const [ pages, setPages ] = useState({ page: 1, count: 0 });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    authFetch(`/management/api/noticeboard?page=${Math.max(0, page - 1)}`)
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
        
      })
      .catch((err) => {
        setRows([]);
      });
  }, [page]);

  const handleInsert = () => { 
    navigate('/management/notice_faq/notice/insert');
  }

  return (
    <Box sx={{ p: 2, userSelect: 'none' }}>
      <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>공지사항 관리</Typography>
      <Divider sx={{ mb: 2 }} />
      
      <CommonTable
        tableHeader={tableHeader}
        rows={rows}
        getRowLink={(row) => `/management/notice_faq/notice/lookat/${row.no}`}
        initSort={false}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleInsert}>공지사항 등록</Button>
      </Box>

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

export default ManagementNoticeBoardList;