import { NextResponse } from 'next/server';
import api from '@/services/api';
import { getSession } from '@/services/session';
import { buildApiUrl, ensureValidUrl } from '@/utils/url';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const baseUrl = api.defaults.baseURL;
    console.log('🔧 POST request baseUrl gốc:', baseUrl);
    
    // Sử dụng hàm tiện ích để xây dựng URL đúng cách
    let url = buildApiUrl(baseUrl, 'posts');
    url = ensureValidUrl(url, 'http://localhost:3001/posts');
    console.log('🔧 POST URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create post' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    console.log('🔍 API route GET /api/posts được gọi');

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const tag = searchParams.get('tag') || '';
    console.log('Query params:', { page, limit, tag });

    // Lấy baseUrl từ API service và log ra để debug
    const baseUrl = api.defaults.baseURL;
    console.log('🌐 API service baseURL config:', baseUrl);

    // Xử lý URL từ env vars
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
    console.log('🌐 NEXT_PUBLIC_SERVER_URL:', process.env.NEXT_PUBLIC_SERVER_URL);

    // Sử dụng URL từ API service để đảm bảo sử dụng cấu hình đúng
    console.log('🔧 baseUrl gốc:', baseUrl);
    
    // Sử dụng hàm tiện ích để xây dựng URL đúng cách
    let url = buildApiUrl(baseUrl, 'posts');
    url = ensureValidUrl(url, 'http://localhost:3001/posts');

    console.log('🔧 Sử dụng URL backend từ config:', url);

    // Thêm query parameters
    url += `?page=${page}&limit=${limit}`;
    if (tag) {
      url += `&tag=${encodeURIComponent(tag)}`;
    }
    console.log('🚀 Final request URL:', url);

    // Thêm timeout dài hơn để đảm bảo có đủ thời gian kết nối
    console.log('Đang gửi request đến backend...');
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }, // Disable cache for debugging
    });

    console.log('📊 Response status:', response.status);
    // Lấy một số header quan trọng để debug
    console.log('📊 Response content-type:', response.headers.get('content-type'));

    // Kiểm tra response.status
    if (response.status === 204) {
      console.log('Backend trả về 204 No Content');
      return NextResponse.json({ items: [], total: 0, page: 1, totalPages: 0, limit: Number(limit) });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      console.error('❌ Status code:', response.status);
      return NextResponse.json({ error: 'Failed to fetch posts', details: errorText }, { status: response.status });
    }

    // Lấy dữ liệu JSON và ghi log
    try {
      const data = await response.json();
      console.log('✅ API response success, data structure:', Object.keys(data));

      // Kiểm tra cấu trúc dữ liệu để debug
      if (data.data && data.data.items) {
        console.log(`✅ Nhận được ${data.data.items.length} bài viết`);
      } else if (data.items) {
        console.log(`✅ Nhận được ${data.items.length} bài viết`);
      } else {
        console.log('⚠️ Format dữ liệu không như mong đợi:', data);
      }

      return NextResponse.json(data);
    } catch (jsonError) {
      console.error('❌ Lỗi khi parse JSON:', jsonError);
      return NextResponse.json(
        {
          error: 'Failed to parse API response',
          details: jsonError instanceof Error ? jsonError.message : String(jsonError),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
