import React, { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import authFetch from '../../utils/authFetch';

function FaqList() {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState([]);
  const [faqCategorys, setFaqCategorys] = useState([]);
  const [faqs, setFaqs] = useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleFormat = (event, newFormats) => {

    setFilters(newFormats);
  };

  useEffect(() => {
    authFetch('/api/public/faq/category/look-up')
      .then((data) => {
        if (!data.ok) throw new Error('FAQ 카테고리 조회 실패');
        return data.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('FAQ 카테고리 데이터 없음');
        
        setFaqCategorys(data.categories);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    authFetch('/api/faq/look-up')
      .then((data) => {
        if (!data.ok) throw new Error('FAQ 조회 실패');
        return data.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('FAQ 데이터 없음');
        setFaqs(data.faqs);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const renderFaqCategorys = () => {
    return faqCategorys.map((category) => (
      <ToggleButton
        key={category.faqCategoryNo}
        value={category.faqCategoryName}
      >
        {category.faqCategoryName}
      </ToggleButton>
    ));
  };

  const renderFaqsByCategory = () => {
    const filteredFaqs =
      Array.isArray(filters) && filters.length > 0
        ? faqs.filter((faq) => filters.includes(faq.faqCategoryName))
        : faqs;

    return filteredFaqs.map((faq, index) => (
      <Accordion
        key={index}
        expanded={expanded === `panel${index}`}
        onChange={handleChange(`panel${index}`)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
            {faq.faqCategoryName}
          </Typography>
          <Typography component="span" sx={{ color: 'text.secondary' }}>
            {faq.faqAsk}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{faq.faqAnswer}</Typography>
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <Box overflow={'auto'} sx={{ p: 2, userSelect: 'none' }}>
      <Typography  sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>
        자주 묻는 질문 (FAQ)
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <ToggleButtonGroup
        value={filters}
        onChange={handleFormat}
        sx={{
          mb: 2,
          '& .Mui-selected': (theme) => ({
            backgroundColor: `${theme.palette.primary.main} !important`,
            color: '#fff !important',
            fontWeight: 'bold !important',
          }),
          '& .MuiToggleButton-root:hover': (theme) => ({
            backgroundColor: `${theme.palette.primary.light} !important`,
            color: '#fff !important',
          }),

        }}
        size="small"
      >
        {renderFaqCategorys()}
      </ToggleButtonGroup>
      {renderFaqsByCategory()}
    </Box>
  );
}

export default FaqList;
