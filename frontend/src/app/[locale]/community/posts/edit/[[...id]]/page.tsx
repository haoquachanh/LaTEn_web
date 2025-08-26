'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PostEditorProvider } from '@/contexts/PostEditorContext';
import { notFound } from 'next/navigation';
import PostEditor from '@/components/Editor/PostEditor';
import { postService } from '@/services/api/post.service';

interface PostEditParams {
  id?: string[];
}

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as unknown as PostEditParams;
  const postId = id?.[0];

  const [initialPost, setInitialPost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(!!postId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndLoadPost = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }

      if (postId) {
        try {
          setIsLoading(true);
          const postData = await postService.getPostById(postId);

          setInitialPost({
            id: postData.id.toString(),
            title: postData.title,
            content: postData.content,
            fullContent: postData.fullContent || postData.content,
            coverImage: postData.imageUrl || '',
            tags: postData.tags.map((t) => t.name),
            tagIds: postData.tags.map((t) => t.id),
            isDraft: false,
          });
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Không thể tải bài viết. Vui lòng thử lại sau.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuthAndLoadPost();
  }, [postId, router]);

  if (postId && error) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (postId && isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (postId && !initialPost && !isLoading) {
    return notFound();
  }

  return (
    <PostEditorProvider initialPost={initialPost || undefined}>
      <PostEditor isEditing={!!postId} />
    </PostEditorProvider>
  );
}
