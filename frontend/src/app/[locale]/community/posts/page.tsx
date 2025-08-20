'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  author: {
    fullname: string;
    username: string;
  };
  tags: Array<{ id: string; name: string }>;
  likes: number;
  views: number;
  commentCount: number;
}

interface PaginatedResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function CommunityPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch posts from API
  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      console.log(`🔍 Fetching posts for page ${pageNum}...`);

      // Thêm timestamp vào URL để tránh cache
      const timestamp = new Date().getTime();
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      console.log(`🌐 Current origin: ${currentOrigin}`);

      // Đảm bảo request có origin tương ứng với URL hiện tại
      const response = await fetch(`/api/posts?page=${pageNum}&limit=10&_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          'X-Requested-From': currentOrigin,
        },
      });
      console.log(`✅ Response received, status: ${response.status}`);

      if (!response.ok) {
        let errorMessage = `HTTP error ${response.status}`;
        try {
          const errorData = await response.text();
          console.error('❌ Failed API response:', response.status, errorData);
          errorMessage += `: ${errorData}`;
        } catch (e) {
          console.error('❌ Could not parse error response');
        }
        throw new Error(`Failed to fetch posts: ${errorMessage}`);
      }

      const responseData = await response.json();
      console.log('🌟 API response data:', responseData);
      console.log('🌟 Response data type:', typeof responseData);
      console.log('🌟 Response structure:', Object.keys(responseData));

      // Debug deeper structure
      if (responseData.data) {
        console.log('🔍 data property type:', typeof responseData.data);
        console.log('🔍 data property keys:', Object.keys(responseData.data));

        if (responseData.data.items) {
          console.log('📚 items is present with', responseData.data.items.length, 'items');
        }
      }

      // Handle different response formats with enhanced logging
      // Our backend returns data in format: { statusCode, message, data: { items, total, page, limit, totalPages } }
      // Or directly as { data, meta } from the frontend API route

      let postsData: Post[] = [];
      let metaData = { page: 1, totalPages: 1, limit: 10, total: 0 };

      // Parse với nhiều format có thể có
      if (responseData.data?.items && Array.isArray(responseData.data.items)) {
        // Format chuẩn từ backend: { statusCode, message, data: { items, ... } }
        console.log('✅ Sử dụng format: data.items array');
        postsData = responseData.data.items;
        metaData = {
          page: responseData.data.page || 1,
          totalPages: responseData.data.totalPages || 1,
          limit: responseData.data.limit || 10,
          total: responseData.data.total || 0,
        };
      } else if (responseData.items && Array.isArray(responseData.items)) {
        // Format trực tiếp: { items, ... }
        console.log('✅ Sử dụng format: direct items array');
        postsData = responseData.items;
        metaData = {
          page: responseData.page || 1,
          totalPages: responseData.totalPages || 1,
          limit: responseData.limit || 10,
          total: responseData.total || 0,
        };
      } else if (Array.isArray(responseData.data)) {
        // Mảng trong property data: { data: [...] }
        console.log('✅ Sử dụng format: data as array');
        postsData = responseData.data;
        metaData = responseData.meta || { page: 1, totalPages: 1, limit: 10, total: postsData.length };
      } else if (Array.isArray(responseData)) {
        // Trực tiếp là mảng: [...]
        console.log('✅ Sử dụng format: direct array');
        postsData = responseData;
        metaData = { page: pageNum, totalPages: 1, limit: 10, total: postsData.length };
      } else {
        // Trường hợp format không khớp, thử kiểm tra sâu hơn
        console.error('❌ Unexpected API response format:', responseData);

        // Thử một số format khác có thể có
        if (responseData.data && typeof responseData.data === 'object') {
          console.log('⚠️ Thử parse data như object:', responseData.data);

          // Kiểm tra nếu data chính là data posts
          if (responseData.data.id || responseData.data.title) {
            console.log('✅ Phát hiện single post object trong data');
            postsData = [responseData.data];
          } else {
            throw new Error('Unexpected API response format: data object không chứa posts');
          }
        } else {
          throw new Error('Unexpected API response format: Không có dữ liệu posts');
        }
      }

      setPosts(postsData);
      setTotalPages(metaData.totalPages || 1);
      setPage(metaData.page || pageNum);

      if (postsData.length === 0 && !responseData.error) {
        console.log('No posts returned but API call was successful');
      }
    } catch (err) {
      console.error('❌ Error fetching posts:', err);
      // Hiển thị lỗi chi tiết hơn cho debug
      let errorMessage = 'Failed to load posts. Please try again later.';
      if (err instanceof Error) {
        // Hiển thị message nhưng giới hạn độ dài để tránh lỗi quá dài
        const truncatedMessage = err.message.length > 150 ? err.message.substring(0, 150) + '...' : err.message;
        errorMessage += ' Error: ' + truncatedMessage;

        // Log stack trace đầy đủ
        console.error('❌ Stack trace:', err.stack);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchPosts(newPage);
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
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
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
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>

        <div className="mt-4">
          <button className="btn btn-primary mr-4" onClick={() => fetchPosts()}>
            Thử lại
          </button>

          <button className="btn btn-outline" onClick={() => window.location.reload()}>
            Tải lại trang
          </button>

          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <h3 className="font-bold">Debug information:</h3>
            <p>Thời gian: {new Date().toLocaleString()}</p>
            <p>Đường dẫn: {window.location.pathname}</p>
            <p>Origin: {typeof window !== 'undefined' ? window.location.origin : 'Not available'}</p>
            <p>Server URL: {process.env.NEXT_PUBLIC_SERVER_URL || 'Not defined'}</p>
            <p>Host: {typeof window !== 'undefined' ? window.location.host : 'Not available'}</p>
          </div>
        </div>
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
