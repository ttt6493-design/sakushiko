import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG, isApiConfigured } from '@/lib/config';

// Raw pass-through of the DMM ActressSearch result for one name (public profile data only).
// Used to inspect what the upstream API actually returns; credentials never leave the server.
export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name')?.trim();
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 });
  if (!isApiConfigured()) return NextResponse.json({ error: 'API not configured' }, { status: 503 });

  const queryParams = new URLSearchParams({
    api_id: API_CONFIG.API_ID,
    affiliate_id: API_CONFIG.AFFILIATE_ID,
    keyword: name,
    hits: '5',
    output: 'json',
  });

  const response = await fetch(`${API_CONFIG.BASE_URL}/ActressSearch?${queryParams.toString()}`, {
    next: { revalidate: 86400 },
  });
  if (!response.ok) {
    return NextResponse.json({ error: `Upstream HTTP ${response.status}` }, { status: 502 });
  }
  const data = await response.json();
  return NextResponse.json(
    { result_count: data.result?.result_count, actress: data.result?.actress ?? [] },
    { headers: { 'Cache-Control': 'public, s-maxage=86400' } }
  );
}
