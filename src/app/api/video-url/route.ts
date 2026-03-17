import { NextRequest, NextResponse } from 'next/server';

// Normalize Japanese quality labels from DMM's unicode escapes
function normalizeLabel(raw: string): string {
  // Decode unicode escapes like \u9ad8\u753b\u8cea
  try {
    const decoded = JSON.parse(`"${raw}"`);
    return decoded;
  } catch {
    return raw;
  }
}

export async function GET(request: NextRequest) {
  const playerUrl = request.nextUrl.searchParams.get('url');

  if (!playerUrl) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    const cidMatch = playerUrl.match(/cid=([^/]+)/);
    const affiMatch = playerUrl.match(/affi_id=([^/]+)/);

    if (!cidMatch) {
      return NextResponse.json({ error: 'Could not extract cid' }, { status: 400 });
    }

    const cid = cidMatch[1];
    const affiId = affiMatch?.[1] || '';

    const html5Url = `https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${cid}/mtype=AhRVShI_/service=litevideo/mode=part/width=720/height=480/affi_id=${affiId}/`;

    const response = await fetch(html5Url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.dmm.co.jp/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en;q=0.9',
      },
    });

    let html = await response.text();

    // Unescape JSON-escaped slashes
    html = html.replace(/\\\//g, '/');

    // Extract all bitrate options
    const bitrateRegex = /"bitrate":"([^"]+)","src":"(\/\/cc3001[^"]+\.mp4)"/g;
    const qualities: Array<{ label: string; url: string }> = [];
    let match;

    while ((match = bitrateRegex.exec(html)) !== null) {
      qualities.push({
        label: normalizeLabel(match[1]),
        url: 'https:' + match[2],
      });
    }

    // Get main src
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
