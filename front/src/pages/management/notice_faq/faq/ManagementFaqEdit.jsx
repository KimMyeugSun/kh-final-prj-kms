import { Box, Button, Divider, IconButton, styled, TextField, Tooltip, Typography } from '@mui/material';
import DropDown from './components/DropDown';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { use, useEffect, useState } from 'react';
import authFetch from '../../../../utils/authFetch';
import { useNavigate, useParams } from 'react-router-dom';
const ManagementFaqEdit = () => {
  const { id } = useParams();
  const [faqCategorys, setFaqCategorys] = useState([]);
  const [faqForm, setFaqForm] = useState(null);
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

  useEffect(() => {
    authFetch(`/management/api/faq/look-at/${id}`)
      .then((data) => {
        if (!data.ok) throw new Error('FAQ 조회 실패');
        return data.json();
      })
      .then((jsondata) => {
        const data = jsondata?.data;
        if (!data) throw new Error('FAQ 데이터 없음');
        setFaqForm({ id: data.faqCategoryNo, label: data.faqCategoryName, faqAsk: data.faqAsk, faqAnswer: data.faqAnswer });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  function handleChange(evt) {
    setFaqForm({ ...faqForm, [evt.target.name]: evt.target.value });
  }

  const onSelect = (value) => {
    setFaqForm({ ...faqForm, id: value.id });
  };

  const handleFaqEdit = () => {
    const reqDto = {
      faqCategoryNo: faqForm.id,
      faqAsk: faqForm.faqAsk,
      faqAnswer: faqForm.faqAnswer,
    };

    authFetch(`/management/api/faq/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqDto),
    })
      .then((data) => {
        if (!data.ok) throw new Error('FAQ 수정 실패');
        
        navigate(-1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!faqForm) return <div>Loading...</div>;

  return (
    <Box m={2} sx={{ userSelect: 'none' }}>
      <Typography variant="h4" gutterBottom>
        FAQ 추가
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', mb: 2 }}>
        <DropDown items={faqCategorys} onSelect={onSelect} initialValue={faqForm.label} />
        {/* <Tooltip title="카테고리 추가" placement="right">
          <IconButton
            color="primary"
            component="span"
            onClick={() => {
              setCategoryInsertName('');
            }}
          >
            <LibraryAddIcon />
          </IconButton>
        </Tooltip> */}
      </Box>

      <TextField
        label="질문"
        variant="outlined"
        size="small"
        sx={{ width: '100%', mb: 2 }}
        name="faqAsk"
        value={faqForm.faqAsk || ''}
        onChange={handleChange}
      />
      <AnswerField
        label="내용"
        multiline
        name="faqAnswer"
        size="small"
        sx={{ width: '100%' }}
        value={faqForm.faqAnswer || ''}
        onChange={handleChange}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
          onClick={handleFaqEdit}
        >
          완료
        </Button>
        <Button variant="outlined" color="error" onClick={() => navigate(-1)}>
          취소
        </Button>
      </Box>
    </Box>
  );
};

const AnswerField = styled(TextField)`
  & .MuiInputBase-input {
    min-height: 400px;
    max-height: 400px;
  }
`;

export default ManagementFaqEdit;
