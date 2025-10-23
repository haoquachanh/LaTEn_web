'use client';

import { useState } from 'react';
import { usePostEditor } from '@/contexts/PostEditorContext';
import RichTextEditor from '@/components/Editor/RichTextEditor';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PostEditorProps {
  isEditing?: boolean;
}

export default function PostEditor({ isEditing = false }: PostEditorProps) {
  const router = useRouter();
  const { post, isSaving, updateTitle, updateFullContent, updateCoverImage, addTag, removeTag, toggleDraft, savePost } =
    usePostEditor();

  const [previewMode, setPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleContentChange = (newContent: string) => {
    updateFullContent(newContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      await savePost();
      router.push('/community/posts');
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại sau.');
    }
  };

  const addTagHandler = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{isEditing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h1>

      {errorMessage && (
        <div className="alert alert-error mb-6">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mb-6">
        <div className="tabs tabs-boxed mb-4">
          <button className={`tab ${!previewMode ? 'tab-active' : ''}`} onClick={() => setPreviewMode(false)}>
            Chỉnh sửa
          </button>
          <button className={`tab ${previewMode ? 'tab-active' : ''}`} onClick={() => setPreviewMode(true)}>
            Xem trước
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tiêu đề bài viết */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium mb-2">
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            value={post.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Nhập tiêu đề bài viết"
            required
          />
        </div>

        {/* Cover image URL */}
        <div className="mb-6">
          <label htmlFor="coverImage" className="block text-lg font-medium mb-2">
            URL ảnh bìa
          </label>
          <input
            type="text"
            id="coverImage"
            value={post.coverImage}
            onChange={(e) => updateCoverImage(e.target.value)}
            className="input input-bordered w-full"
            placeholder="https://example.com/image.jpg"
          />
          {post.coverImage && (
            <div className="mt-2 relative w-full h-48">
              <Image
                src={post.coverImage}
                alt="Cover preview"
                className="rounded-lg object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="input input-bordered flex-grow"
              placeholder="Thêm tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTagHandler())}
            />
            <button type="button" onClick={addTagHandler} className="btn btn-primary">
              Thêm
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <div key={tag} className="badge badge-lg gap-2">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="btn btn-xs btn-circle btn-ghost">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Nội dung bài viết */}
        <div className="mb-8">
          <label className="block text-lg font-medium mb-2">Nội dung</label>

          {previewMode ? (
            <div className="prose max-w-none border rounded-lg p-4 min-h-96 bg-base-100">
              <h1>{post.title || 'Tiêu đề bài viết'}</h1>
              <div dangerouslySetInnerHTML={{ __html: post.fullContent || '<p>Chưa có nội dung</p>' }} />
            </div>
          ) : (
            <RichTextEditor initialValue={post.fullContent} onChange={handleContentChange} height={500} />
          )}
        </div>

        {/* Bản nháp checkbox */}
        <div className="form-control mb-6">
          <label className="label cursor-pointer">
            <span className="label-text">Lưu dưới dạng bản nháp</span>
            <input
              type="checkbox"
              checked={post.isDraft}
              onChange={toggleDraft}
              className="checkbox checkbox-primary"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <Link href="/community" className="btn btn-outline">
            Hủy
          </Link>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="loading loading-spinner"></span>
                Đang lưu...
              </>
            ) : post.isDraft ? (
              'Lưu nháp'
            ) : (
              'Đăng bài'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
