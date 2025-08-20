import { NextResponse } from 'next/server';
import api from '@/services/api';
import { getSession } from '@/services/session';
import { buildApiUrl, ensureValidUrl } from '@/utils/url';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const baseUrl = api.defaults.baseURL;
    console.log('🔧 Like POST baseUrl gốc:', baseUrl);
    
    // Sử dụng hàm tiện ích để xây dựng URL đúng cách
    let url = buildApiUrl(baseUrl, `posts/${id}/like`);
    url = ensureValidUrl(url, `http://localhost:3001/posts/${id}/like`);
    console.log('🔧 Like POST URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to like post' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
