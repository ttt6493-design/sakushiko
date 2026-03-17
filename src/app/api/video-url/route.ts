import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const playerUrl = request.nextUrl.searchParams.get('url');

  if (!playerUrl) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    // Extract cid and affi_id from the litevideo URL
    // Format: https://www.dmm.co.jp/litevideo/-/part/=/cid=XXX/size=720_480/affi_id=YYY/
    const cidMatch = playerUrl.match(/cid=([^/]+)/);
    const affiMatch = playerUrl.match(/affi_id=([^/]+)/);

    if (!cidMatch) {
      return NextResponse.json({ error: 'Could not extract cid' }, { status: 400 });
    }

    const cid = cidMatch[1];
    const affiId = affiMatch?.[1] || '';

    // Go directly to the HTML5 player page (skip the intermediate page)
    const html5Url = `https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${cid}/mtype=AhRVShI_/service=litevideo/mode=part/width=720/height=480/affi_id=${affiId}/`;

    const response = await fetch(html5Url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.dmm.co.jp/',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch player' }, { status: 502 });
    }

    const html = await response.text();

    // Extract all bitrate options with MP4 URLs
    const bitrateRegex = /"bitrate":"([^"]+)","src":"(\/\/cc3001[^"]+\.mp4)"/g;
    const qualities: Array<{ label: string; url: string }> = [];
    let match;

    while ((match = bitrateRegex.exec(html)) !== null) {
      qualities.push({
        label: match[1],
        url: 'https:' + match[2],
      });
    }

    // Also get the main src (default quality)
    const mainSrcMatch = html.match(/"src":"(\/\/cc3001[^"]+\.mp4)"/);
    const mainUrl = mainSrcMatch ? 'https:' + mainSrcMatch[1] : qualities[0]?.url || null;

    if (!mainUrl) {
      return NextResponse.json({ error: 'No video URL found' }, { status: 404 });
    }

    return NextResponse.json(
      { url: mainUrl, qualities },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
