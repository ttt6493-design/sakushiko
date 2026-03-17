import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const playerUrl = request.nextUrl.searchParams.get('url');

  if (!playerUrl) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    // Fetch the DMM litevideo player page
    const response = await fetch(playerUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch player page' }, { status: 502 });
    }

    const html = await response.text();

    // Find the HTML5 player URL
    const playerMatch = html.match(/https:\/\/www\.dmm\.co\.jp\/service\/digitalapi[^"]+/);
    if (!playerMatch) {
      return NextResponse.json({ error: 'Player URL not found' }, { status: 404 });
    }

    // Fetch the HTML5 player page to extract MP4 URLs
    const playerResponse = await fetch(playerMatch[0], {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!playerResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch HTML5 player' }, { status: 502 });
    }

    const playerHtml = await playerResponse.text();

    // Extract the main src (highest quality available as default)
    const mainSrcMatch = playerHtml.match(/"src":"(\/\/cc3001[^"]+\.mp4)"/);

    // Extract all bitrate options
    const bitrateRegex = /"bitrate":"([^"]+)","src":"(\/\/cc3001[^"]+\.mp4)"/g;
    const qualities: Array<{ label: string; url: string }> = [];
    let match;

    while ((match = bitrateRegex.exec(playerHtml)) !== null) {
      qualities.push({
        label: match[1],
        url: 'https:' + match[2],
      });
    }

    const mainUrl = mainSrcMatch ? 'https:' + mainSrcMatch[1] : qualities[0]?.url || null;

    if (!mainUrl) {
      return NextResponse.json({ error: 'No MP4 URL found' }, { status: 404 });
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
