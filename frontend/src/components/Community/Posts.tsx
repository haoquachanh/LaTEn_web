'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { postService, type Post as PostType } from '@/services/api/post.service';

interface PostUI {
  id: number;
  title: string;
  content: string;
  img: string;
  created: Date;
  authorName: string;
  authorAvatar: string;
  likes: number;
  comments: number;
  tags: string[];
  isLikedByCurrentUser?: boolean;
}

interface PostsProps {
  onRefresh?: () => void;
}

export default function Posts({ onRefresh }: PostsProps = {}) {
  const router = useRouter();
  const locale = useLocale();

  const [posts, setPosts] = useState<PostUI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likingPostId, setLikingPostId] = useState<number | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const fetchPosts = useCallback(
    async (pageNumber: number, isInitial = false) => {
      if (loading || (!hasMore && !isInitial)) return;

      try {
        if (isInitial) {
          setInitialLoading(true);
        } else {
          setLoading(true);
        }

        const response = await postService.getPosts({ page: pageNumber, limit: 10 });

        const uiPosts: PostUI[] = response.items.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          img:
            post.imageUrl &&
            post.imageUrl.trim().length > 3 &&
            (post.imageUrl.startsWith('http://') || post.imageUrl.startsWith('https://'))
              ? post.imageUrl
              : '',
          created: new Date(post.createdAt),
          authorName: post.author.fullname || post.author.username,
          authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.fullname || post.author.username)}&background=random`,
          likes: post.likes,
          comments: post.commentCount,
          tags: post.tags.map((tag) => tag.name),
          isLikedByCurrentUser: post.isLikedByCurrentUser || false,
        }));

        if (isInitial) {
          setPosts(uiPosts);
        } else {
          setPosts((prev) => [...prev, ...uiPosts]);
        }

        setHasMore(pageNumber < response.totalPages);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again later.');
        if (isInitial) {
          setPosts([]);
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [loading, hasMore],
  );

  useEffect(() => {
    checkAuth();
    fetchPosts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchPosts(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, fetchPosts]);

  async function handleLikePost(postId: number, isLiked: boolean) {
    if (!isLoggedIn) {
      router.push(`/${locale}/login`);
      return;
    }

    setLikingPostId(postId);

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLikedByCurrentUser: !isLiked,
              likes: isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );

    try {
      if (isLiked) {
        await postService.unlikePost(postId);
      } else {
        await postService.likePost(postId);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLikedByCurrentUser: isLiked,
                likes: isLiked ? post.likes + 1 : post.likes - 1,
              }
            : post,
        ),
      );
    } finally {
      setLikingPostId(null);
    }
  }

  // Format date for better display
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  // Function to truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {initialLoading ? (
        // Loading skeleton - only show on first load
        Array(3)
          .fill(0)
          .map((_, i) => (
            <div className="card bg-base-100 shadow-lg overflow-hidden animate-pulse" key={`loading-${i}`}>
              <div className="card-body p-4 lg:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-base-300"></div>
                  <div className="h-4 bg-base-300 rounded w-32"></div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-grow">
                    <div className="h-6 bg-base-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-base-300 rounded w-full mb-1"></div>
                    <div className="h-4 bg-base-300 rounded w-2/3"></div>
                  </div>
                  <div className="flex-shrink-0 w-20 h-20 bg-base-300 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))
      ) : error ? (
        // Error state
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
          <div>
            <h3 className="font-bold">Error</h3>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      ) : posts.length === 0 ? (
        // Empty state
        <div className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 className="font-bold">No posts found</h3>
            <div className="text-sm">Check back later for new content!</div>
          </div>
        </div>
      ) : (
        // Post list
        posts.map((post: PostUI) => (
          <div
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-base-300"
            key={`post-${post.id}`}
          >
            <div className="card-body p-4 lg:p-5">
              <div className="flex flex-col gap-2 lg:gap-3">
                {/* Content section */}
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <Image
                          src={post.authorAvatar}
                          alt={post.authorName}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium text-sm">{post.authorName}</h4>
                      <span className="text-xs text-base-content/60">• {formatDate(post.created)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 lg:gap-4">
                    <div className="flex-grow">
                      {/* Title - limited to one line */}
                      <h2 className="font-bold text-lg lg:text-xl truncate" title={post.title}>
                        {post.title}
                      </h2>

                      {/* Content - limited to two lines */}
                      <p className="text-base-content/80 line-clamp-2 text-sm lg:text-base mt-1">{post.content}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.slice(0, 2).map((tag: string) => (
                          <div key={tag} className="badge badge-outline badge-sm lg:badge-md">
                            {tag}
                          </div>
                        ))}
                        {post.tags.length > 2 && (
                          <div className="badge badge-outline badge-sm lg:badge-md">+{post.tags.length - 2}</div>
                        )}
                      </div>
                    </div>

                    {/* Image section - responsive size based on screen width */}
                    {post.img && post.img.length > 0 && (
                      <div className="flex-shrink-0">
                        <Image
                          src={post.img}
                          alt={post.title}
                          width={128}
                          height={128}
                          className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLikePost(post.id, post.isLikedByCurrentUser || false)}
                        disabled={likingPostId === post.id}
                        className={`flex items-center gap-1 text-sm lg:text-base transition-colors ${
                          post.isLikedByCurrentUser
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-base-content/60 hover:text-red-500'
                        } ${likingPostId === post.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 lg:h-5 lg:w-5"
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
                        {post.likes}
                      </button>
                      <span className="flex items-center gap-1 text-sm lg:text-base text-base-content/60">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 lg:h-5 lg:w-5"
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
                        {post.comments}
                      </span>
                    </div>
                    <Link href={`/${locale}/community/posts/${post.id}`} className="btn btn-primary btn-xs lg:btn-sm">
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Intersection Observer Target for Infinite Scroll */}
      <div ref={observerTarget} className="flex justify-center py-8">
        {loading && <span className="loading loading-spinner loading-lg text-primary"></span>}
      </div>
    </div>
  );
}
