import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from '../../auth/useAuth';
import authFetch from '../../utils/authFetch';
import { makeTemplateUrl } from '../../utils/makeUrl';
/**
 * EditorToolbar 컴포넌트
 * @param {string} props.value - 에디터의 내용
 * @param {function} props.onChange - 내용 변경 시 호출되는 함수
 * @param {object} props.sx - 스타일 객체 (기본값: { height: 'calc(100% - 100px)' })
 * @param {React.Ref} ref - 부모 컴포넌트에서 전달하는 ref
 * @returns
 *
 * @example
 * <EditorToolbar ref={editorRef} value={content} onChange={setContent} />
 *
 * 글 작성시 이미지를 사용하면 임시 업로드 후 생성된 URL로 사용하고 작성을 완료 할 때 was에서 실제 이미지URL로 교체해야 함.
 * 임시 경로는 cdn/template/{eno}/img 에 저장 됨. (was FileController 참고)
 * 작성 취소시에는 임시경로에 있는 이미지를 삭제 시켜줌. (was FileController 참고, e.g. 해당 폴더 하위 전체 삭제 처리)
 */
const EditorToolbarBase = (
  { value, onChange, sx = { height: 'calc(100% - 100px)' } },
  ref
) => {
  const mergedSx = useMemo(
    () => ({ ...sx, height: sx.height || 'calc(100% - 100px)' }),
    [sx]
  );

  const [uploadedImages, setUploadedImages] = useState([]);
  const { getEmpNo } = useAuth();
  const quillRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getUploadedImages: () => uploadedImages,
  }));

  const uploadImage = useCallback(
    async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const resp = await authFetch(`/api/template-upload/${getEmpNo()}`, {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) throw new Error('이미지 업로드 실패');
      const jsondata = await resp.json();
      const data = jsondata?.data;
      if (!data || !data.FileName) throw new Error('이미지 업로드 실패');
      // 파일명 저장(임시로 추가) — 실제로는 DOM 동기화에서 유지/제거 결정
      setUploadedImages((prev) => Array.from(new Set([...prev, data.FileName])));
      return makeTemplateUrl(getEmpNo(), data.FileName); // 서버에서 반환된 이미지 URL
    },
    [getEmpNo]
  );

  const imageHandler = useCallback(() => {
    const editor = quillRef.current;
    if (!editor) return;

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const url = await uploadImage(file);
          const range = editor.getEditor().getSelection();
          editor.getEditor().insertEmbed(range ? range.index : 0, 'image', url);
        } catch (err) {
          alert('이미지 업로드에 실패했습니다.');
        }
      }
    };
  }, [uploadImage]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  // 삽입된 img 엘리먼트에 data-filename을 붙이고, 에디터 DOM 기준으로 uploadedImages 동기화
  const attachFilenameToInsertedImages = useCallback((url, filename) => {
    try {
      const root = quillRef.current?.getEditor?.().root;
      if (!root) return;
      const imgs = Array.from(root.querySelectorAll(`img[src="${url}"]`));
      imgs.forEach((img) => {
        img.dataset.filename = filename;
      });
    } catch (e) {}
  }, []);

  // 에디터 DOM에 있는 이미지만 uploadedImages에 남기도록 동기화
  const syncUploadedImagesFromDom = useCallback(() => {
    try {
      const root = quillRef.current?.getEditor?.().root;
      if (!root) return;
      const imgs = Array.from(root.querySelectorAll('img'));
      const filenames = imgs
        .map((img) => img.dataset.filename || (() => {
          const src = img.getAttribute('src') || '';
          const m = src.match(/\/([^\/?#]+)(?:[?#].*)?$/);
          return m ? m[1] : null;
        })())
        .filter(Boolean);
      setUploadedImages((prev) => {
        const uniq = Array.from(new Set(filenames));
        return uniq;
      });
    } catch (e) {}
  }, []);

  // onChange을 래핑해 DOM 기준으로 uploadedImages 동기화 후 부모 onChange 호출
  const handleEditorChange = useCallback((html) => {
    // 먼저 부모 콜백 호출하여 content 반영시키고 DOM이 업데이트된 직후 sync 수행
    if (onChange) onChange(html);
    // 약간의 타임아웃 또는 requestAnimationFrame으로 DOM 반영 이후 sync
    requestAnimationFrame(() => {
      syncUploadedImagesFromDom();
    });
  }, [onChange, syncUploadedImagesFromDom]);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={handleEditorChange}
      modules={modules}
      style={mergedSx}
    />
  );
};

const EditorToolbar = React.memo(forwardRef(EditorToolbarBase));
export default EditorToolbar;
