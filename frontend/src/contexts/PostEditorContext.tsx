'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type PostFormState = {
  id?: string | null;
  title: string;
  content: string;
  fullContent: string;
  coverImage: string;
  tags: string[];
  isDraft: boolean;
};

type PostEditorContextType = {
  post: PostFormState;
  isLoading: boolean;
  isSaving: boolean;
  updateTitle: (title: string) => void;
  updateContent: (content: string) => void;
  updateFullContent: (fullContent: string) => void;
  updateCoverImage: (url: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  toggleDraft: () => void;
  resetForm: () => void;
  savePost: () => Promise<void>;
};

const defaultPost: PostFormState = {
  id: null,
  title: '',
  content: '',
  fullContent: '',
  coverImage: '',
  tags: [],
  isDraft: false,
};

export const PostEditorContext = createContext<PostEditorContextType | undefined>(undefined);

export const usePostEditor = () => {
  const context = useContext(PostEditorContext);
  if (!context) {
    throw new Error('usePostEditor must be used within a PostEditorProvider');
  }
  return context;
};

type PostEditorProviderProps = {
  children: ReactNode;
  initialPost?: Partial<PostFormState>;
};

export const PostEditorProvider = ({ children, initialPost }: PostEditorProviderProps) => {
  const [post, setPost] = useState<PostFormState>({
    ...defaultPost,
    ...initialPost,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateTitle = (title: string) => {
    setPost((prev) => ({ ...prev, title }));
  };

  const updateContent = (content: string) => {
    setPost((prev) => ({ ...prev, content }));
  };

  const updateFullContent = (fullContent: string) => {
    setPost((prev) => ({ ...prev, fullContent }));
  };

  const updateCoverImage = (coverImage: string) => {
    setPost((prev) => ({ ...prev, coverImage }));
  };

  const addTag = (tag: string) => {
    if (!post.tags.includes(tag)) {
      setPost((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag: string) => {
    setPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const toggleDraft = () => {
    setPost((prev) => ({ ...prev, isDraft: !prev.isDraft }));
  };

  const resetForm = () => {
    setPost(defaultPost);
  };

  const savePost = async () => {
    try {
      setIsSaving(true);
      // Tạo summary content từ fullContent
      const contentSummary =
        post.fullContent
          .replace(/<[^>]*>/g, '') // Xóa tất cả HTML tags
          .substring(0, 300) + '...'; // Giới hạn 300 ký tự

      const postData = {
        ...post,
        content: contentSummary, // Content ngắn để hiển thị ở trang danh sách
        status: post.isDraft ? 'draft' : 'published',
      };

      const apiEndpoint = `/api/posts${post.id ? `/${post.id}` : ''}`;
      const method = post.id ? 'PUT' : 'POST';

      const response = await fetch(apiEndpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save post');
      }

      const result = await response.json();
      console.log('Post saved:', result);
      return result.data;
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const value = {
    post,
    isLoading,
    isSaving,
    updateTitle,
    updateContent,
    updateFullContent,
    updateCoverImage,
    addTag,
    removeTag,
    toggleDraft,
    resetForm,
    savePost,
  };

  return <PostEditorContext.Provider value={value}>{children}</PostEditorContext.Provider>;
};
