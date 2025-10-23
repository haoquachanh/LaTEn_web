'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { postService, type Post as PostType } from '@/services/api/post.service';
import LoadingState from '@/components/Common/LoadingState';
import ErrorState from '@/components/Common/ErrorState';
import { useApiRequest } from '@/hooks/useApiRequest';

export default function CommunityPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { loading, error, execute } = useApiRequest(async (pageNum: number) => {
    const result = await postService.getPosts({ page: pageNum, limit: 10 });
    setPosts(result.items);
    setTotalPages(result.totalPages || 1);
    setPage(result.page || pageNum);
    return result;
  });

  useEffect(() => {
    execute(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    execute(newPage);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <LoadingState message="Loading posts..." size="lg" variant="default" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorState message={error.message} variant="card" type="general" onRetry={() => execute(page)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bài viết cộng đồng</h1>
        <Link href="/community/posts/create" className="btn btn-primary">
          Viết bài mới
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl">Chưa có bài viết nào</h3>
          <p className="mt-2">Hãy là người đầu tiên tạo bài viết trong cộng đồng!</p>
          <Link href="/community/posts/create" className="btn btn-primary mt-4">
            Viết bài mới
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="card bg-base-100 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {post.imageUrl ? (
                  <figure className="relative h-48">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </figure>
                ) : (
                  <div className="bg-base-200 h-32 flex items-center justify-center">
                    <span className="text-base-content opacity-50">No image</span>
                  </div>
                )}

                <div className="card-body">
                  <div className="flex gap-2 flex-wrap mb-1">
                    {post.tags?.slice(0, 3).map((tag) => (
                      <span key={tag.id} className="badge badge-outline">
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <h2 className="card-title line-clamp-2">{post.title}</h2>

                  <p className="line-clamp-3 text-sm opacity-75">{post.content}</p>

                  <div className="card-actions flex-col mt-3">
                    <div className="text-xs opacity-70 flex items-center gap-1">
                      <span>{post.author.fullname}</span>
                      <span>•</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    <div className="flex justify-between items-center w-full mt-2">
                      <div className="flex gap-3 text-sm opacity-75">
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {post.commentCount}
                        </span>
                      </div>

                      <Link href={`/community/posts/${post.id}`} className="btn btn-sm btn-outline">
                        Đọc thêm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                <button className="join-item btn" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                  «
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`join-item btn ${page === i + 1 ? 'btn-active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
