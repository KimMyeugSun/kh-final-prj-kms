import React, { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import CommonTable from '../../../components/commons/CommonTable';
import authFetch from '../../../utils/authFetch';
import { useAuth } from '../../../auth/useAuth';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { DateFormat } from '../../../define/DateFormat';

const HealthCheckUp = ({ onRowSelect, rows, setRows }) => {
  const { getEmpNo } = useAuth();
  const fileInputRef = useRef(null);
  const [selectedRowNo, setSelectedRowNo] = useState(null);
  
  useEffect(() => {
    authFetch(`/api/health-checkup-attachments/${getEmpNo()}`, {
      method: 'GET',
    })
      .then((resp) => {
        if (!resp.ok) throw new Error('건강검진 이력 조회에 실패했습니다.');
        return resp.json();
      })
      .then((jsondata) => {
        const tempRows = Array.from(jsondata.data).map((item) => ({
          no: item.hcno,
          registeredAt: DateFormat(new Date(item.registeredAt), 'yyyy-MM-dd HH:mm:ss'),
          updatedAt: item.updatedAt ? DateFormat(new Date(item.updatedAt), 'yyyy-MM-dd HH:mm:ss') : '-',
          fileName: item.fileName,
          originFileName: item.originFileName,
        }));
        setRows(tempRows);
      })
      .catch((err) => {
        alert('건강검진 이력 조회 중 오류가 발생했습니다.');
      });
  }, [getEmpNo]);

  const handleOpenRegister = () => {
    if(fileInputRef.current)
      fileInputRef.current.click();
  }
  const handleFileControll = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reqBody = new FormData();
      reqBody.append('file', file);

      authFetch(`/api/health-checkup-attachments/register/${getEmpNo()}`, {
        method: 'POST',
        body: reqBody,
      })
        .then((resp) => {
          if (!resp.ok) throw new Error('건강검진 파일 업로드에 실패했습니다.');
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
          setRows((prevRows) => [newRow, ...prevRows]);
        })
        .catch((err) => {
          console.error(err);
          alert('건강검진 파일 업로드 중 오류가 발생했습니다.');
        })
        .finally(() => {
          if (fileInputRef.current) fileInputRef.current.value = null;
        });
    }
  }
  const handleRowSelect = (row) => {
    if(selectedRowNo == row?.no) return;

    setSelectedRowNo(row?.no || null);
    if(onRowSelect) onRowSelect(row);
  }

  return (
    <>
      <Box className="check-up_list" sx={{ userSelect:'none' }}>
        <Button variant="contained" color="primary" size='small' sx={{ mb: 1 }} onClick={handleOpenRegister}>
          <UploadFileIcon fontSize="small"/>
          건강검진 등록
        </Button>
        <Box sx={{ height:'580px', overflowY: 'auto'}}>
          <CommonTable tableHeader={headers} rows={rows} selectedRowNo={selectedRowNo} getRowLink={handleRowSelect} useStickyHeader={true} initSort={false} />
        </Box>
      </Box>
      <input ref={fileInputRef} type="file" accept="application/pdf,image/jpeg,image/png,image/gif" onChange={handleFileControll} style={{ display: 'none' }} id="profile-file-input" />
    </>
  );
};

const headers = [
    { header: '번호', field: 'no' },
    { header: '등록일', field: 'registeredAt' },
    { header: '수정일', field: 'updatedAt'},
    { header: '파일이름', field: 'originFileName'},
]
export default HealthCheckUp;