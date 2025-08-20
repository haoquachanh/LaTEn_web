'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PostEditorProvider } from '@/contexts/PostEditorContext';
import { notFound } from 'next/navigation';
import PostEditor from '@/components/Editor/PostEditor';

interface PostEditParams {
  id?: string;
}

type PostData = {
  id: string;
  title: string;
  content: string;
  fullContent: string;
  coverImage: string;
  tags: string[];
  isDraft: boolean;
};

export default function EditPostPage() {
  const params = useParams();
  const { id } = params as PostEditParams;
  const [initialPost, setInitialPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch post data for editing
      const fetchPost = async () => {
        try {
          setIsLoading(true);
          // TODO: Replace with actual API call
          // const response = await fetch(`/api/posts/${id}`);
          // const data = await response.json();

          // Mock data for now
          const mockData = {
            id,
            title: 'Bài viết mẫu để chỉnh sửa',
            content: 'Đây là nội dung ngắn...',
            fullContent:
              '<h2>Đây là một bài viết mẫu</h2><p>Nội dung đầy đủ của bài viết sẽ được hiển thị ở đây với định dạng <strong>HTML</strong>.</p><p>Bạn có thể chỉnh sửa nội dung này.</p>',
            coverImage: 'https://picsum.photos/800/400',
            tags: ['mẫu', 'tutorial'],
            isDraft: false,
          };

          setInitialPost(mockData);
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Không thể tải bài viết. Vui lòng thử lại sau.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchPost();
    }
  }, [id]);

  if (id && error) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (id && isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (id && !initialPost && !isLoading) {
    return notFound();
  }

  return (
    <PostEditorProvider initialPost={initialPost || undefined}>
      <PostEditor isEditing={!!id} />
    </PostEditorProvider>
  );
}
