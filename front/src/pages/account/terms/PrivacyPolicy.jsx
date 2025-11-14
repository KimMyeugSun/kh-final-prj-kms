import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ReactMarkdown from 'react-markdown';
import { makePrivacyPolicyUrl } from '../../../utils/makeUrl';
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

const PrivacyPolicy = ({ onAgree }) => {
  const [open, setOpen] = useState(false);
  const [markdown, setMarkdown] = useState(null);
  const descriptionElementRef = useRef(null);

  useEffect(() => {
    fetch(makePrivacyPolicyUrl(), {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => res.text())
      .then(setMarkdown);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    descriptionElementRef.current = null;
  };

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  if (setMarkdown === null) return <div>Loading...</div>;

  return (
    <>
      <Button onClick={handleClickOpen}>개인정보 처리방침</Button>
      <Dialog open={open} scroll="paper" keepMounted>
        <DialogTitle>개인정보 처리방침</DialogTitle>
        <DialogContent
          dividers={scroll === 'paper'}
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            비동의
          </Button>
          <Button
            onClick={() => {
              handleClose();
              onAgree && onAgree();
            }}
          >
            동의
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PrivacyPolicy;
