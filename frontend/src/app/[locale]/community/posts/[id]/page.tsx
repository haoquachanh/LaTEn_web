'use client';

import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PostComments from '@/components/Post/PostComments';
import { postService } from '@/services/api/post.service';
import LoadingState from '@/components/Common/LoadingState';
import ErrorState from '@/components/Common/ErrorState';
import { useApiRequest } from '@/hooks/useApiRequest';

interface Author {
  id: number;
  fullname: string;
  username: string;
  email: string;
}

interface Tag {
  id: number;
  name: string;
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

interface PostData {
  id: number;
  title: string;
  content: string;
  fullContent?: string;
  imageUrl?: string;
  type: string;
  author: Author;
  tags: Tag[];
  likes: number;
  views: number;
  commentCount: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  isLikedByCurrentUser?: boolean;
}

// Format date for better display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  const fetchRelatedPosts = useCallback(
    async (tagId: number) => {
      try {
        const result = await postService.getPosts({ tagId, limit: 3 });
        console.log('🔍 Nhận được bài viết liên quan:', result);

        const filtered = result.items.filter((p) => p.id.toString() !== postId);
        setRelatedPosts(filtered.slice(0, 3));
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    },
    [postId],
  );

  const fetchPostData = useCallback(async () => {
    if (!postId) {
      setError('Invalid post ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Fetching post data for ID:', postId);

      const postData = await postService.getPostById(postId);
      console.log('🔍 Post data received:', postData);

      setPost(postData);

      if (postData && postData.tags && postData.tags.length > 0) {
        fetchRelatedPosts(postData.tags[0].id);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      if (err instanceof Error && err.message.includes('404')) {
        notFound();
        return;
      }
      setError(
        'Failed to load post details. The post might have been removed or you may not have permission to view it.',
      );
    } finally {
      setLoading(false);
    }
  }, [postId, fetchRelatedPosts]);

  const handleLikePost = async () => {
    if (!isLoggedIn) {
      router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (isLiking || !post) return;

    try {
      setIsLiking(true);

      let data;
      if (post.isLikedByCurrentUser) {
        data = await postService.unlikePost(postId);
      } else {
        data = await postService.likePost(postId);
      }

      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          likes: data.likes,
          isLikedByCurrentUser: data.isLiked,
        };
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      setError('Failed to update like status. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    try {
      await postService.deletePost(postId);
      router.push('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    console.log('Rendering error state. Error:', error, 'Post:', post);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error || 'Không tìm thấy bài viết!'}</span>
        </div>
        <div className="mt-4">
          <Link href="/community" className="btn btn-primary">
            Quay lại Community
          </Link>
        </div>
      </div>
    );
  }

  // Function to share the post
  const sharePost = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post?.title,
          text: `Check out this post: ${post?.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <Link href="/community" className="btn btn-ghost gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại Community
        </Link>

        {isLoggedIn && post?.author?.id && (
          <div className="flex gap-2">
            <Link href={`/community/posts/edit/${post.id}`} className="btn btn-outline btn-sm">
              Chỉnh sửa
            </Link>
            <button onClick={handleDeletePost} className="btn btn-error btn-outline btn-sm">
              Xóa
            </button>
          </div>
        )}
      </div>

      <div className="card bg-base-100 shadow-xl overflow-hidden">
        {/* Hero image */}
        {post.imageUrl && (
          <figure className="relative">
            <Image
              src={post.imageUrl}
              alt={post.title}
              className="w-full object-cover"
              width={1200}
              height={600}
              style={{ height: 'auto', maxHeight: '24rem' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base-300/80 to-transparent flex items-end">
              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{post.title}</h1>
              </div>
            </div>
          </figure>
        )}

        {!post.imageUrl && (
          <div className="p-6 md:p-8 bg-base-200">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{post.title}</h1>
          </div>
        )}

        <div className="card-body">
          {/* Author info and date */}
          <div className="flex items-center gap-4 mb-6">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.fullname || post.author.username)}&background=random`}
                  alt={post.author.fullname || post.author.username}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </div>
            </div>
            <div>
              <h4 className="font-medium">{post.author.fullname || post.author.username}</h4>
              <p className="text-sm opacity-70">{formatDate(post.createdAt.toString())}</p>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  href={`/community/posts?tag=${tag.id}`}
                  key={tag.id}
                  className="badge badge-outline hover:badge-primary transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Post content */}
          <article
            className="post-content prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.fullContent || post.content }}
          />

          {/* Actions */}
          <div className="card-actions justify-between items-center mt-8 pt-6 border-t">
            <div className="flex items-center gap-4">
              <button
                className={`btn ${post.isLikedByCurrentUser ? 'btn-primary' : 'btn-outline'} btn-sm gap-2`}
                onClick={handleLikePost}
                disabled={isLiking}
              >
                {isLiking ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill={post.isLikedByCurrentUser ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
                Thích ({post.likes})
              </button>
              <a href="#comments" className="btn btn-outline btn-sm gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Bình luận ({post.commentCount})
              </a>
            </div>
            <button className="btn btn-outline btn-sm gap-2" onClick={sharePost}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Chia sẻ
            </button>
          </div>

          {/* Comments section */}
          <div id="comments" className="scroll-mt-16">
            <PostComments postId={postId} comments={post.comments || []} onCommentAdded={fetchPostData} />
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-10">
              <h3 className="text-2xl font-bold mb-6">Bài viết liên quan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    href={`/community/posts/${relatedPost.id}`}
                    key={relatedPost.id}
                    className="card bg-base-100 border hover:shadow-md transition-shadow"
                  >
                    {relatedPost.imageUrl && (
                      <figure className="h-40 relative">
                        <Image
                          src={relatedPost.imageUrl}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </figure>
                    )}
                    <div className="card-body p-4">
                      <h4 className="font-bold line-clamp-2">{relatedPost.title}</h4>
                      <p className="line-clamp-2 text-sm opacity-75">{relatedPost.content}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related posts - Placeholder */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Related Posts</h3>
            <div className="bg-base-200 p-4 rounded-lg text-center">
              <p>Related posts will be implemented in the future.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
