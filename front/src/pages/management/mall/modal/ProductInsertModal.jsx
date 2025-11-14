import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Modal from '../../../../components/commons/Modal';
import authFetch from '../../../../utils/authFetch';

const INITIAL_FORM = {
  name: '',
  price: '',
  stock: '',
  description: '',
  category: '',
};

export default function ProductInsertModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (open) {
      const url = '/management/api/productCategory';
      const option = {};
      authFetch(url, option)
        .then((resp) => resp.json())
        .then((result) => {
          setCategories(result.data);
        })
        .catch((err) => console.log(err));
    }
  }, [open]);

  // 모달이 닫히면 값들 초기화
  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM);
      setFileName('');
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
      imageFile: fileRef.current?.files?.[0] || null,
    };
    onSubmit && onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose} size="md" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        상품 등록
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="center">
          <Grid size={12}>
            <Stack spacing={1.5}>
              <TextField
                label="상품명"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                size="small"
              />

              <Stack direction="row" spacing={1.5}>
                <TextField
                  label="가격"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  size="small"
                  fullWidth
                />
                <TextField
                  label="재고"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                />
              </Stack>

              <TextField
                label="상품 설명"
                name="description"
                value={form.description}
                onChange={handleChange}
                size="small"
                multiline
                minRows={8}
              />
            </Stack>

            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button variant="outlined" component="label">
                  이미지 선택
                  <input
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFile}
                  />
                </Button>
                {!!fileName && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {fileName}
                  </Typography>
                )}
              </Stack>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="product-category-label">
                  상품 카테고리
                </InputLabel>
                <Select
                  labelId="product-category-label"
                  label="상품 카테고리"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((c) => (
                    <MenuItem key={c.no} value={c.no}>
                      {c.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid size={12}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="flex-end"
              sx={{ mt: 2, width: '100%' }}
            >
              <Button type="submit" variant="contained">
                등록
              </Button>
              <Button onClick={onClose} variant="outlined">
                취소
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
