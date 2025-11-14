import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
// import { Document, Page, pdfjs } from 'react-pdf';
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'; // pdf.worker.js 파일 가져오기

// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

import { useAuth } from '../../../auth/useAuth';
import authFetch from '../../../utils/authFetch';

import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { DateFormat } from '../../../define/DateFormat';

/**
 * 파일 미리보기 컴포넌트
 * @param {Object} row
 * @returns
 */
const Preview = ({ row, setRows, onDelete }) => {
  const [refresh, setRefresh] = useState(false);
  const { getEmpNo } = useAuth();
  const fileInputRef = useRef(null);
  const [blob, setBlob] = useState(null);

  const url = useMemo(() => {
    if (!blob) return null;
    const objectUrl = URL.createObjectURL(blob);
    return objectUrl;
  }, [blob]);

  useEffect(() => {
    (async () => {
      if (!row || !row.no){
        setBlob(null);
        return;
      }
      const apiurl = `/api/health-checkup-attachments/view/${getEmpNo()}/${row.no}`;
      const resp = await authFetch(apiurl, { method: 'GET' });
      
      if (!resp.ok) {
        alert('파일 다운로드에 실패했습니다.');
        return;
      }
      const blobData = await resp.blob();
      const fixedBlob = blobData.type ? blobData : new Blob([blobData], { type: 'application/pdf' });
      setBlob(fixedBlob);

    })();
  }, [row?.no, refresh]);

  const handleDownload = () => {
    if(url == null) return;

    const a = document.createElement('a');
    a.href = url;
    a.download = row.originFileName || 'downloaded-file'; // 원하는 파일명
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  
  const handleDelete = () => {
    if (!confirm('정말로 이 건강검진 이력을 삭제하시겠습니까?')) {
      return;
    }

    authFetch(`/api/health-checkup-attachments/${getEmpNo()}/${row.no}`, {
      method: 'DELETE',
    })
      .then((resp) => {
        if (!resp.ok) throw new Error('건강검진 이력 삭제에 실패했습니다.');
        alert('건강검진 이력이 삭제되었습니다.');
        if(onDelete) onDelete(row.no);
      })
      .catch((err) => {
      })
  };

  const handleFileControll = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reqBody = new FormData();
      reqBody.append('file', file);

      authFetch(`/api/health-checkup-attachments/replace/${getEmpNo()}/${row.no}`, {
        method: 'PUT',
        body: reqBody,
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('건강검진 파일 수정에 실패했습니다.');
          return resp.json();
        })
        .then((data) => {
          const newRow = {
            no: data.hcno,
            registeredAt: DateFormat(new Date(data.registeredAt), 'yyyy-MM-dd HH:mm:ss'),
            updatedAt: data.updatedAt ? DateFormat(new Date(data.updatedAt), 'yyyy-MM-dd HH:mm:ss') : '-',
            fileName: data.fileName,
            originFileName: data.originFileName,
          };
          setRows((prevRows) => prevRows.map((r) => (r.no === newRow.no ? newRow : r)));
          setRefresh((prev) => !prev);
        })
        .catch((err) => {
          console.error(err);
          alert('건강검진 파일 수정 중 오류가 발생했습니다.');
        })
        .finally(() => {
          if (fileInputRef.current) fileInputRef.current.value = null;
        });
    }
  }

    const handleReplace = () => {
      if (fileInputRef.current)
        fileInputRef.current.click();
    }

  if (!row || !row.no) {
    return <div style={{ userSelect: 'none' }}>PDF 파일이 없습니다.</div>;
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: '1px solid #ccc', borderRadius: 2, padding: 2, boxSizing: 'border-box'}}>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', width: '100%' }}>
        <Button variant="contained" color="primary" size='small' sx={{ mb: 1 }} onClick={handleReplace}>
          <PublishedWithChangesIcon fontSize="small"/>
          수정
        </Button>
        <input ref={fileInputRef} type="file" accept="application/pdf,image/jpeg,image/png,image/gif" onChange={handleFileControll} style={{ display: 'none' }} id="profile-file-input" />
        <Button variant="contained" color="primary" size='small' sx={{ mb: 1 }} onClick={handleDownload}>
          <DownloadIcon fontSize="small"/>
          다운로드
        </Button>
        <Button variant="outlined" color="error" size='small' sx={{ mb: 1 }} onClick={handleDelete}>
          <DeleteIcon fontSize="small"/>
          삭제
        </Button>
      </Box>

      <object
        data={url}
        type={blob?.type || 'application/pdf'}
        style={{ width: '100%', height: '100%', border: 'none', flexGrow: 1 }}
      >
        미리보기를 지원하지 않는 브라우저입니다. <a href={url} download={row.originFileName || 'download'}>다운로드</a>
      </object>
    </Box>
  );
};

export default Preview;
