'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/services/session';

interface Author {
  id: number;
  fullname: string;
  username: string;
  email: string;
}

interface Reply {
  id: number;
  content: string;
  createdAt: string;
  author: Author;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  replies: Reply[];
}

interface PostCommentsProps {
  postId: string;
  comments: Comment[];
  onCommentAdded?: () => void;
}

export default function PostComments({ postId, comments = [], onCommentAdded }: PostCommentsProps) {
  const router = useRouter();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const session = await getSession();
      if (!session) {
        router.push('/auth/login?returnUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }

      setIsSubmitting(true);
      setError(null);

      // Sử dụng URL backend trực tiếp
      const url = `http://localhost:3001/api/posts/${postId}/comments`;
      console.log('🔧 Gọi API thêm bình luận trực tiếp:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }

      setNewComment('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (commentId: number) => {
    if (!replyContent.trim()) return;

    try {
      const session = await getSession();
      if (!session) {
        router.push('/auth/login?returnUrl=' + encodeURIComponent(window.location.pathname));
        return;
      }

      setIsSubmitting(true);
      setError(null);

      // Sử dụng URL backend trực tiếp
      const url = `http://localhost:3001/api/comments/${commentId}/replies`;
      console.log('🔧 Gọi API thêm trả lời bình luận trực tiếp:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          content: replyContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add reply');
      }

      setReplyContent('');
      setReplyingTo(null);
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.error('Error adding reply:', err);
      setError('Failed to add reply. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Bình luận ({comments.length})</h2>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Add comment form */}
      <div className="mb-8">
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Viết bình luận của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button className="btn btn-primary" onClick={handleAddComment} disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Đang gửi...
              </>
            ) : (
              'Gửi bình luận'
            )}
          </button>
        </div>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8 opacity-70">
          <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4 bg-base-100">
              <div className="flex justify-between">
                <div className="font-medium">{comment.author.fullname}</div>
                <div className="text-sm opacity-70">{formatDate(comment.createdAt)}</div>
              </div>
              <div className="mt-2">{comment.content}</div>

              {/* Reply button */}
              <div className="mt-2 flex justify-end">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  {replyingTo === comment.id ? 'Hủy' : 'Trả lời'}
                </button>
              </div>

              {/* Reply form */}
              {replyingTo === comment.id && (
                <div className="ml-6 mt-2 border-l-2 pl-4">
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Viết trả lời của bạn..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={2}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleAddReply(comment.id)}
                      disabled={isSubmitting || !replyContent.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Đang gửi...
                        </>
                      ) : (
                        'Gửi trả lời'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-3 border-l-2 pl-4 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-base-200 rounded-md p-3">
                      <div className="flex justify-between">
                        <div className="font-medium text-sm">{reply.author.fullname}</div>
                        <div className="text-xs opacity-70">{formatDate(reply.createdAt)}</div>
                      </div>
                      <div className="mt-1 text-sm">{reply.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
