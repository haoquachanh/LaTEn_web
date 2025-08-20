'use client';

import { useState } from 'react';
import RichTextEditor from '@/components/Editor/RichTextEditor';
import Image from 'next/image';
import Link from 'next/link';

export default function CreateEditPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Tại đây bạn sẽ gọi API để lưu bài viết
    alert('Chức năng đang được phát triển!');
    console.log({
      title,
      content,
      tags,
      coverImage,
    });
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tạo bài viết mới</h1>

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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="input input-bordered w-full"
            placeholder="https://example.com/image.jpg"
          />
          {coverImage && (
            <div className="mt-2 relative w-full h-48">
              <Image src={coverImage} alt="Cover preview" className="rounded-lg object-cover" fill />
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
            />
            <button type="button" onClick={addTag} className="btn btn-primary">
              Thêm
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
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
              <h1>{title || 'Tiêu đề bài viết'}</h1>
              <div dangerouslySetInnerHTML={{ __html: content || '<p>Chưa có nội dung</p>' }} />
            </div>
          ) : (
            <RichTextEditor initialValue={content} onChange={handleContentChange} height={400} />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <Link href="/community" className="btn btn-outline">
            Hủy
          </Link>
          <div className="space-x-2">
            <button type="button" className="btn btn-outline btn-info">
              Lưu nháp
            </button>
            <button type="submit" className="btn btn-primary">
              Đăng bài
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
