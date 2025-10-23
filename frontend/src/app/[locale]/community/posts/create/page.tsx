'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostEditorProvider } from '@/contexts/PostEditorContext';
import PostEditor from '@/components/Editor/PostEditor';

export default function CreatePostPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login?returnUrl=' + encodeURIComponent('/community/posts/create'));
      }
    };
    checkAuth();
  }, [router]);

  return (
    <PostEditorProvider>
      <PostEditor isEditing={false} />
    </PostEditorProvider>
  );
}
