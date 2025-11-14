import { Box, Button, Divider, Typography } from '@mui/material';
import React, { use, useEffect, useState } from 'react';
import CommonTable from '../../../../components/commons/CommonTable';
import authFetch from '../../../../utils/authFetch';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../../components/commons/SearchBar';

const ManagementFaqList = () => {
  const [faqList, setFaqList] = useState([]);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const handleSearch = (q) => {
    setQuery(q?.trim());
  };

  const filteredFaqs = faqList.filter(faq => 
    faq.category.toLowerCase().includes(query.toLowerCase()) ||
    faq.ask.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    authFetch('/management/api/faq/look-up')
      .then((data) => {
        if (!data.ok) throw new Error('FAQ 조회 실패');
        return data.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if(!data) throw new Error('FAQ 데이터 없음');

        setFaqList(data.faqs.map(x => ({
          id: x.faqNo,
          category: x.faqCategoryName,
          ask: x.faqAsk
        })));
      });
  }, []);

  const handleInsert = () => {
    navigate('/management/notice_faq/faq/insert');
  };

  return (
    <Box sx={{ p: 2, userSelect: 'none' }}>
      <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>FAQ 관리 </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', height: 38 }}>
        <SearchBar placeholder={'검색할 단어를 입력해주세요'} onSearch={handleSearch} />
        <Button variant='contained' onClick={handleInsert} size='small'>추가</Button>
      </Box>
      <CommonTable
        tableHeader={tableHeader}
        rows={filteredFaqs}
        getRowLink={(row) => `/management/notice_faq/faq/lookat/${row.id}`}
      />
    </Box>
  );
};

const tableHeader = [
  { header: '범주', field: 'category' },
  { header: '질문', field: 'ask' },
];

export default ManagementFaqList;
