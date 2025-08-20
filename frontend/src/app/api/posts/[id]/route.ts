import { NextResponse } from 'next/server';
import api from '@/services/api';
import { getSession } from '@/services/session';
import { buildApiUrl, ensureValidUrl } from '@/utils/url';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('🔍🔍🔍 API route - GET post by ID được gọi:', params.id);
    console.log('URL yêu cầu đầy đủ:', request.url);
    
    const session = await getSession();
    // Không cần xác thực cho xem bài viết công khai
    const id = params.id;
    const baseUrl = api.defaults.baseURL;
    console.log('API service baseURL config:', baseUrl);

    // Xử lý hardcoded URL cho môi trường development
    console.log('🔧 baseUrl gốc:', baseUrl);
    
    // Sử dụng hàm tiện ích để xây dựng URL đúng cách
    let url = buildApiUrl(baseUrl, `posts/${id}`);
    url = ensureValidUrl(url, `http://localhost:3001/posts/${id}`);
    
    console.log('🔧 URL chi tiết bài viết:', url);
    console.log('API URL details được xây dựng:', url);

    console.log('Backend API URL:', url);

    // Tạo headers cơ bản
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Thêm Authorization header nếu có session
    if (session) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    const response = await fetch(url, { headers });
    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        // Nếu không phải JSON, sử dụng text làm lỗi
      }

      // Nếu là lỗi 404, trả về lỗi 404 để frontend có thể xử lý
      if (response.status === 404) {
        return NextResponse.json(
          {
            data: null,
            error: errorJson?.message || 'Post not found',
            statusCode: 404,
            message: 'Post not found',
          },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          data: null,
          error: errorJson?.message || 'Failed to fetch post',
          statusCode: response.status,
          message: 'Error fetching post',
          details: errorText,
        },
        { status: response.status },
      );
    }

    const backendData = await response.json();
    console.log('Backend response data structure:', Object.keys(backendData));
    console.log('Full backend response:', JSON.stringify(backendData, null, 2));

    // Chuyển đổi từ định dạng backend sang định dạng dễ tiêu thụ hơn cho frontend
    // Đảm bảo nhất quán bằng cách luôn trả về cấu trúc { data: postData }
    const formattedResponse = {
      data: backendData.data || backendData,
      statusCode: backendData.statusCode || 200,
      message: backendData.message || 'Success',
    };

    console.log('Formatted response for frontend:', formattedResponse);

    // Trả về dữ liệu với định dạng nhất quán
    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const body = await request.json();

    // Lấy base URL từ API service
    const baseUrl = api.defaults.baseURL;
    console.log('🔧 baseUrl gốc:', baseUrl);
    
    // Sử dụng hàm tiện ích để xây dựng URL đúng cách
    let url = buildApiUrl(baseUrl, `posts/${id}`);
    url = ensureValidUrl(url, `http://localhost:3001/posts/${id}`);
    console.log('PUT URL:', url);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update post' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
