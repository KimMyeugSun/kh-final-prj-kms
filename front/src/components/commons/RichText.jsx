import { styled, Typography } from '@mui/material';
import React from 'react';

/**
 * 
 * @param {string} content - HTML 문자열 
 * @returns 
 * 
 * @example
 * <RichText content={htmlString} />
 * 
 * HTML 문자열을 안전하게 렌더링하는 컴포넌트입니다.
 */
const RichText = ({ content }) => {
  return (
    <ContentBox 
      variant="body2"
      color="text.secondary"
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
};

const ContentBox = styled(Typography)(({ theme }) => ({
  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },
  '& .ql-align-center': {
    textAlign: 'center',
  },
  '& .ql-align-right': {
    textAlign: 'right',
  },
  '& .ql-align-left': {
    textAlign: 'left',
  },
}));

export default RichText;