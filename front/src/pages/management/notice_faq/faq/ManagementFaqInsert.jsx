import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import authFetch from '../../../../utils/authFetch';
import DropDown from './components/DropDown';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Modal from '../../../../components/commons/Modal';
import { useNavigate } from 'react-router-dom';

const ManagementFaqInsert = () => {
  const [faqCategorys, setFaqCategorys] = useState([]);
  const [open, setOpen] = useState(false);
  const [faqContent, setFaqContent] = useState('');
  const [categoryInsertName, setCategoryInsertName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    authFetch('/api/public/faq/category/look-up')
      .then((data) => {
        if (!data.ok) throw new Error('FAQ 카테고리 조회 실패');
        return data.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('FAQ 카테고리 데이터 없음');
        
        setFaqCategorys(
          data.categories.map((category) => ({
            label: category.faqCategoryName,
            id: category.faqCategoryNo,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleChange(evt) {
    setFaqContent({ ...faqContent, [evt.target.name]: evt.target.value });
  }

  const onSelect = (value) => {
    setSelectedCategory(value);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    authFetch('/management/api/faq-category/insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faqCategoryName: categoryInsertName }),
    })
      .then((data) => {
        if (!data.ok) throw new Error('카테고리 추가 실패');
        return data.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('카테고리 데이터 없음');
        setFaqCategorys((prev) => [
          ...prev,
          { label: data.faqCategoryName, id: data.faqCategoryNo },
        ]);
        alert('카테고리 추가 성공', { variant: 'filled', severity: 'success' });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setOpen(false);
      });
  };

  const handleChangeCategoryInsert = (e) => {
    setCategoryInsertName(e.target.value);
  };

  const handleFaqRegister = () => {
    const reqDto = {
      faqCategoryNo: selectedCategory.id,
      faqAsk: faqContent.faqAsk,
      faqAnswer: faqContent.faqAnswer,
    };

    authFetch('/management/api/faq/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqDto),
    })
      .then((data) => {
        if (!data.ok) throw new Error('FAQ 추가 실패');
        return data.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('FAQ 데이터 없음');
        alert('FAQ 추가 성공', { variant: 'filled', severity: 'success' });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        navigate(-1);
      });
  };

  return (
    <>
      <Box sx={{ p: 2, userSelect: 'none' }}>
        <Typography sx={{ fontWeight: 900, fontSize: '1.5em' }} gutterBottom>
          FAQ 추가
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', mb: 2 }}>
          <DropDown items={faqCategorys} onSelect={onSelect} />
          <Tooltip title="카테고리 추가" placement="right">
            <IconButton color="primary" component="span" onClick={() => {setOpen(true); setCategoryInsertName('');}}>
              <LibraryAddIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <TextField
          label="질문"
          variant="outlined"
          size="small"
          sx={{ width: '100%', mb: 2 }}
          name="faqAsk"
          onChange={handleChange}
        />
        <AnswerField
          label="내용"
          multiline
          name="faqAnswer"
          size="small"
          sx={{ width: '100%' }}
          onChange={handleChange}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={handleFaqRegister}>
            저장
          </Button>
          <Button variant="outlined" color="error" onClick={() => navigate(-1)}>
            취소
          </Button>
        </Box>
      </Box>

      <Modal open={open} onClose={() => {setOpen(false)}} caption="카테고리 추가" size="sm">
        <TextField
          label="카테고리명"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mb: 2, mt: 2 }}
          onChange={handleChangeCategoryInsert}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={handleAddCategory}>
            추가
          </Button>
        </Box>
      </Modal>
    </>
  );
};

const AnswerField = styled(TextField)`
  & .MuiInputBase-input {
    min-height: 400px;
    max-height: 400px;
  }
`;

export default ManagementFaqInsert;
