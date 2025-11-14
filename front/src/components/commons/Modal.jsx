import React, { useEffect, useRef } from 'react';
import { Modal as MuiModal, Backdrop, Fade, IconButton, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../../define/styles/Color';
import ClearIcon from '@mui/icons-material/Clear';

const IconLayout = styled('div')`
  position: absolute;
  top: 17px;
  right: 18px;
  line-height: 0;
  z-index: 1;
  pointer-events: auto;
`;

/**
 * MUI 기반 공통 모달 컴포넌트
 * @param {function} open 모달 열기/닫기 상태
 * @param {function} onClose 모달 닫기 함수
 * @param {ReactNode} children 모달 내부에 표시할 내용
 * @param {string} caption 모달 상단 캡션 (없으면 닫기 버튼만 표시)
 * @param {string|number} width 모달 너비
 * @param {string|number} maxWidth 모달 최대 너비
 * @param {string|number} height 모달 높이
 * @param {string|number} maxHeight 모달 최대 높이
 * @param {string} size'sm' | 'md' | 'lg' (기본값: 'md')
 * @param {object} sx 추가 스타일링
 * @param {boolean} disableScrollLock 스크롤 잠금 해제
 * @param {boolean} keepMounted 언마운트 방지
 * @param {ReactNode} TransitionComponent Slide/Grow로 쉽게 교체 가능
 * @param {object} transitionProps TransitionComponent에 전달할 props
 * @param {boolean} relaxFocusTrap 포커스 트랩 완화 (기본값: false)
 * @returns 
 * 
 * @example
 * const [open, setOpen] = useState(false);
 * <Modal open={open} onClose={() => setOpen(false)} caption="모달 제목" size="md">
 *   <div>모달 내용</div>
 * </Modal>
 * 
 * size 옵션:
 * 'sm' - width: 360px, maxWidth: 90vw, maxHeight: 80vh
 * 'md' - width: 640px, maxWidth: 90vw, maxHeight: 85vh (기본값)
 * 'lg' - width: 960px, maxWidth: 95vw, maxHeight: 90vh
 * 'width', 'maxWidth', 'height', 'maxHeight' 직접 지정 가능 (우선 적용)
 * 
 * 포커스 관리:
 * - 모달 열릴 때 프레임에 포커스 고정
 * - 닫기 전에 포커스 해제 → aria-hidden 경고 방지
 * 
 * 스크롤 관리:
 * - 모달 열릴 때 배경 스크롤 잠금 (disableScrollLock=true로 해제 가능)
 * - 모달 내부 내용이 많을 때 프레임 내에서 스크롤 가능
 * - 모달 외부 클릭 시 닫기
 * 
 * 접근성:
 * - role="dialog", aria-modal="true" 적용
 * - 포커스 트랩 (relaxFocusTrap=true로 완화 가능)
 * - 닫기 버튼에 aria-label="close" 적용
 * 
 * 트랜지션:
 * - 기본적으로 Fade 사용 (TransitionComponent, transitionProps로 교체 가능)
 * - 트랜지션 시간: enter 300ms, exit 200ms (transitionProps로 조정 가능)
 * 
 */
export default function Modal({
  open,
  onClose,
  children,
  caption = '',
  width = undefined,
  maxWidth = undefined,
  height = undefined,
  maxHeight = undefined,
  size = 'md',
  sx = {},  
  disableScrollLock = false,
  keepMounted = false,
  TransitionComponent = Fade,
  transitionProps = { timeout: { enter: 300, exit: 200 } },
  relaxFocusTrap = false,
}) {
  // size presets
  const sizeMap = {
    sm: { width: 360, maxWidth: '90vw', maxHeight: '80vh' },
    md: { width: 640, maxWidth: '90vw', maxHeight: '85vh' },
    lg: { width: 960, maxWidth: '95vw', maxHeight: '90vh' },
  };

  const preset = sizeMap[size] || {};
  const finalWidth = width ?? preset.width ?? 'auto';
  const finalMaxWidth = maxWidth ?? preset.maxWidth ?? '95vw';
  const finalHeight = height ?? 'auto';
  const finalMaxHeight = maxHeight ?? preset.maxHeight ?? '90vh';

  // 포커스 관리
  const frameRef = useRef(null);

  // 열릴 때 프레임에 포커스 고정
  // useEffect(() => {
  //   if (open && frameRef.current) {
  //     const id = setTimeout(() => {
  //       frameRef.current?.focus?.();
  //     }, 0);
  //     return () => clearTimeout(id);
  //   }
  // }, [open]);

  // 닫기 전에 포커스 해제 → aria-hidden 경고 방지
  const safeClose = () => {
    // const el = document.activeElement;
    // if (el && typeof el.blur === 'function') el.blur();
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    // body로 포커스 이동
    document.body.focus();
    onClose?.();
  };

  const withCaption = () => {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, width: '100%',  height: '50px', backgroundColor: 'primary.main'}}>
        {caption && (<Typography style={{ color: '#fff', fontSize: '0.95rem', padding: '0 1rem 0 1rem', display: 'flex', alignItems: 'center',textAlign: 'left'}}>{caption}</Typography>)}

        <IconButton aria-label="close" onClick={safeClose} size="small">
          <ClearIcon fontSize="small" sx={{color:'#fff'}}/>
        </IconButton>
        </Box>
        <Box sx={{ position: 'relative', width: '100%', height: '100%', padding: '0 2rem 2rem 2.25rem', boxSizing: 'border-box', overflow: 'auto' }}>
          {children}
          </Box>
      </>
    )
  };

  const withoutCaption = () => {
    return (
      <>
        <IconLayout>
          <IconButton aria-label="close" onClick={safeClose} size="small">
            <ClearIcon fontSize="small" />
          </IconButton>
        </IconLayout>
        {children}
      </>
    )
  };

  return (
    <MuiModal
      open={open}
      onClose={safeClose}
      closeAfterTransition
      keepMounted={keepMounted}
      disableScrollLock={disableScrollLock}
      disableEnforceFocus={relaxFocusTrap}
      disableRestoreFocus={relaxFocusTrap}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: {
            backgroundColor: colors?.modal?.overlay || 'rgba(128,128,128,0.63)',
          },
        },
      }}
      sx={{ userSelect: 'none' }}
    >
      <TransitionComponent in={open} {...transitionProps}>
        <Frame
          ref={frameRef}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          sx={{
            width:
              typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
            maxWidth: finalMaxWidth,
            height:
              typeof finalHeight === 'number'
                ? `${finalHeight}px`
                : finalHeight,
            maxHeight: finalMaxHeight,
            ...(sx || {}),
            padding: caption ? '0px 0px 2rem 0px' : '2rem 2.25rem 2rem 2.25rem',
          }}
        >
          {caption ? withCaption() : withoutCaption()}

        </Frame>
      </TransitionComponent>
    </MuiModal>
  );


}

// 중앙 정렬 + 카드 스타일 컨테이너
const Frame = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: (colors && colors.modal && colors.modal.inner) || '#FFFFFF',
  padding: '2rem',
  boxShadow: theme.shadows?.[6] || '0 2px 8px rgba(0,0,0,0.26)',
  borderRadius: 6,
  boxSizing: 'border-box',
  overflow: 'auto',
  outline: 'none',
}));
