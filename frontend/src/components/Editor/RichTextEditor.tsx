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
      onInit={(evt: any, editor: any) => (editorRef.current = editor)}
      initialValue={initialValue}
      onEditorChange={(newContent: string) => onChange(newContent)}
      disabled={disabled}
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
          'undo redo | blocks | ' +
          'bold italic backcolor forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image media link codesample blockquote | help',
        content_style: `
          body { 
            font-family: Helvetica, Arial, sans-serif; 
            font-size: 16px;
            line-height: 1.8;
            color: #333;
            padding: 1rem;
          }
          h1, h2, h3, h4, h5, h6 {
            font-weight: bold;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            line-height: 1.3;
          }
          h1 { font-size: 2em; }
          h2 { font-size: 1.5em; }
          h3 { font-size: 1.25em; }
          p {
            margin-bottom: 1em;
            line-height: 1.8;
          }
          ul, ol {
            padding-left: 1.5rem;
            margin-bottom: 1em;
          }
          ul { list-style-type: disc; }
          ol { list-style-type: decimal; }
          li {
            margin-bottom: 0.5em;
            line-height: 1.6;
          }
          blockquote {
            border-left: 4px solid #0ea5e9;
            padding-left: 1rem;
            margin: 1.5em 0;
            font-style: italic;
            color: #666;
          }
          a {
            color: #0ea5e9;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          code {
            background-color: #f3f4f6;
            padding: 0.2em 0.4em;
            border-radius: 0.25rem;
            font-family: monospace;
            font-size: 0.9em;
          }
          pre {
            background-color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          strong {
            font-weight: 600;
          }
        `,
        placeholder,
        images_upload_handler: function (blobInfo: any, progress: (percent: number) => void) {
          return new Promise<string>((resolve, reject) => {
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
      }}
    />
  );
};

export default RichTextEditor;
