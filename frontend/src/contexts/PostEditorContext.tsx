'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { postService, type CreatePostDto, type UpdatePostDto } from '@/services/api/post.service';
import { useRouter } from 'next/navigation';

type PostFormState = {
  id?: string | null;
  title: string;
  content: string;
  fullContent: string;
  coverImage: string;
  tags: string[];
  tagIds: number[];
  isDraft: boolean;
};

type PostEditorContextType = {
  post: PostFormState;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateTitle: (title: string) => void;
  updateContent: (content: string) => void;
  updateFullContent: (fullContent: string) => void;
  updateCoverImage: (url: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setTagIds: (tagIds: number[]) => void;
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
  tagIds: [],
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
  const router = useRouter();
  const [post, setPost] = useState<PostFormState>({
    ...defaultPost,
    ...initialPost,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const setTagIds = (tagIds: number[]) => {
    setPost((prev) => ({ ...prev, tagIds }));
  };

  const toggleDraft = () => {
    setPost((prev) => ({ ...prev, isDraft: !prev.isDraft }));
  };

  const resetForm = () => {
    setPost(defaultPost);
    setError(null);
  };

  const savePost = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const contentSummary = post.fullContent.replace(/<[^>]*>/g, '').substring(0, 300) + '...';

      const postData: CreatePostDto | UpdatePostDto = {
        title: post.title,
        content: contentSummary,
        fullContent: post.fullContent,
        imageUrl: post.coverImage || undefined,
        tagIds: post.tagIds.length > 0 ? post.tagIds : undefined,
      };

      let result;
      if (post.id) {
        result = await postService.updatePost(post.id, postData);
      } else {
        result = await postService.createPost(postData as CreatePostDto);
      }

      console.log('Post saved:', result);
      router.push(`/community/posts/${result.id}`);
    } catch (err) {
      console.error('Error saving post:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save post';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const value = {
    post,
    isLoading,
    isSaving,
    error,
    updateTitle,
    updateContent,
    updateFullContent,
    updateCoverImage,
    addTag,
    removeTag,
    setTagIds,
    toggleDraft,
    resetForm,
    savePost,
  };

  return <PostEditorContext.Provider value={value}>{children}</PostEditorContext.Provider>;
};
