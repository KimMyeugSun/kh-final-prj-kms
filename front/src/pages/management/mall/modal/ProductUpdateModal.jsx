import React, { useEffect, useState } from 'react';
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

export default function ProductUpdateModal({
  open,
  onClose,
  product,
  onUpdated,
}) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    file: null,
  });

  const [fileName, setFileName] = useState('');
  const [categories, setCategories] = useState([]);

  // 카테고리 불러오기
  useEffect(() => {
    if (open) {
      authFetch('/management/api/productCategory', {})
        .then((resp) => resp.json())
        .then((result) => setCategories(result.data))
        .catch('category err : ', console.error);
    }
  }, [open]);

  // 모달 열릴 때 product 값으로 초기화
  useEffect(() => {
    if (open && product) {
      setForm({
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
        description: product.description || '',
        category: product.categoryNo || '',
        file: null,
      });
    }
  }, [open, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, file }));
    setFileName(file ? file.name : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', Number(form.price || 0));
    fd.append('stock', Number(form.stock || 0));
    fd.append('categoryNo', form.category);

    if (form.file) {
      fd.append('file', form.file);
    }

    const url = `/management/api/product/${product.no}`;
    const option = { method: 'PUT', body: fd };

    authFetch(url, option)
      .then((resp) => resp.json())
      .then((result) => {
        onUpdated && onUpdated();
      })
      .catch(console.error);
  };

  return (
    <Modal open={open} onClose={onClose} size="md" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        상품 수정
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
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
                minRows={6}
              />
            </Stack>

            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button variant="outlined" component="label">
                  이미지 선택
                  <input
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
                    sx={{ maxWidth: 200 }}
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
                  name="category"
                  value={categories.length > 0 ? form.category : ''}
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
              sx={{ mt: 2 }}
            >
              <Button type="submit" variant="contained">
                수정
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
