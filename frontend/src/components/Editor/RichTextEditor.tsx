'use client';

import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
  height?: number | string;
  placeholder?: string;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue = '',
  onChange,
  height = 500,
  placeholder = 'Viết nội dung bài viết tại đây...',
  disabled = false,
}) => {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      apiKey="your-api-key" // Đăng ký miễn phí tại https://www.tiny.cloud/
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      onEditorChange={(newContent) => onChange(newContent)}
      init={{
        height,
        menubar: true,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
          'codesample',
        ],
        toolbar:
          'undo redo | formatselect | ' +
          'bold italic backcolor forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image media link codesample | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        placeholder,
        images_upload_handler: function (blobInfo, progress) {
          return new Promise((resolve, reject) => {
            // Tại đây bạn có thể triển khai logic upload ảnh lên server
            // Và trả về URL của ảnh đã upload

            // Ví dụ giả lập upload thành công:
            setTimeout(() => {
              // Mock URL - trong thực tế, cần thay thế bằng URL thật từ API upload
              resolve(`https://example.com/images/${blobInfo.filename()}`);
            }, 2000);
          });
        },
        file_picker_types: 'image',
        automatic_uploads: true,
        readonly: disabled,
      }}
    />
  );
};

export default RichTextEditor;
