import { NextResponse } from 'next/server';
import api from '@/services/api';
import { getSession } from '@/services/session';
import { buildApiUrl, ensureValidUrl } from '@/utils/url';

export async function POST(request: Request, { params }: { params: { id: string; commentId: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId } = params;
    const body = await request.json();
    const baseUrl = api.defaults.baseURL;
    console.log('🔧 Reply POST baseUrl gốc:', baseUrl);
    
    // Sử dụng hàm tiện ích để xây dựng URL đúng cách
    let url = buildApiUrl(baseUrl, `comments/${commentId}/replies`);
    url = ensureValidUrl(url, `http://localhost:3001/comments/${commentId}/replies`);
    console.log('🔧 Reply POST URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to add reply' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding reply:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
