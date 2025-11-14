import React, { useEffect, useState } from 'react';
import { Box, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PageTitle from '../../../define/styles/jgj/PageTitle';
import SearchBar from '../../../components/commons/SearchBar';
import ProductInsertModal from './modal/ProductInsertModal';
import CommonTable from '../../../components/commons/CommonTable';
import CommonPagination from '../../../components/commons/Pagination';
import authFetch from '../../../utils/authFetch';
import CommonSnackbar from '../../../components/commons/CommonSnackbar';

const { VITE_S3_URL, VITE_S3_PRODUCT_IMG } = import.meta.env;

const MallListManagement = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [insertOpen, setInsertOpen] = useState(false);
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // 상품 목록 조회
  const fetchProducts = (pageNum = 1, q = '') => {
    const url = `/management/api/product/paging?page=${
      pageNum - 1
    }&size=10&sort=no,ASC${q ? `&keyword=${encodeURIComponent(q)}` : ''}`;

    authFetch(url)
      .then((resp) => resp.json())
      .then((result) => {
        setProducts(result.data.content);
        setTotalPages(result.data.totalPages);
        setPage(result.data.number + 1);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleInsertSubmit = (payload) => {
    const fd = new FormData();
    fd.append('categoryNo', payload.category);
    fd.append('name', payload.name);
    fd.append('description', payload.description);
    fd.append('price', payload.price);
    fd.append('file', payload.imageFile);
    fd.append('stock', payload.stock);

    const url = `/management/api/product`;
    const option = {
      method: 'POST',
      headers: {},
      body: fd,
    };

    authFetch(url, option)
      .then((resp) => resp.json())
      .then(() => {
        setInsertOpen(false);
        fetchProducts(page);
        setSnackbar({
          open: true,
          message: '상품이 등록되었습니다.',
          severity: 'success',
        });
      })
      .catch(console.error);
  };

  const handleSearch = (q) => {
    const search = q?.trim() || '';
    setKeyword(search);
    fetchProducts(1, search);
  };

  const buildImgUrl = (path) =>
    path ? VITE_S3_URL + VITE_S3_PRODUCT_IMG + path : null;

  const tableHeader = [
    { header: '번호', field: 'no' },
    { header: '상품명', field: 'name' },
    { header: '가격', field: 'price' },
    { header: '재고', field: 'stock' },
  ];

  const rows = products.map((p) => ({
    ...p,
    url: buildImgUrl(p.url) ? (
      <img
        src={buildImgUrl(p.url)}
        alt={p.name}
        style={{ width: 50, height: 50, objectFit: 'cover' }}
      />
    ) : (
      ''
    ),
    price: p.price.toLocaleString(),
  }));

  return (
    <Container maxWidth="md" sx={{ mt: 3, px: 3, userSelect: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        {/* 왼쪽 그룹: 타이틀 + 검색 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PageTitle>상품 관리</PageTitle>
          <SearchBar
            placeholder="상품명을 검색하세요"
            onSearch={handleSearch}
          />
        </Box>

        {/* 오른쪽 버튼 */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setInsertOpen(true)}
        >
          상품 등록
        </Button>
      </Box>

      <CommonTable
        tableHeader={tableHeader}
        rows={rows}
        getRowLink={(row) => `/management/mall/${row.no}`}
        StickyHeaderSx={{ stickyHeader: true, maxHeight: 600 }}
      />

      {/* 페이지네이션 */}
      <CommonPagination
        page={page}
        count={totalPages}
        onChange={(e, newPage) => fetchProducts(newPage, keyword)}
      />

      {/* 상품 등록 모달 */}
      <ProductInsertModal
        open={insertOpen}
        onClose={() => setInsertOpen(false)}
        onSubmit={handleInsertSubmit}
      />

      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  );
};

export default MallListManagement;
