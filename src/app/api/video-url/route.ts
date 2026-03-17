import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const playerUrl = request.nextUrl.searchParams.get('url');
  const debug = request.nextUrl.searchParams.get('debug');

  if (!playerUrl) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    // Extract cid and affi_id from the litevideo URL
    const cidMatch = playerUrl.match(/cid=([^/]+)/);
    const affiMatch = playerUrl.match(/affi_id=([^/]+)/);

    if (!cidMatch) {
      return NextResponse.json({ error: 'Could not extract cid' }, { status: 400 });
    }

    const cid = cidMatch[1];
    const affiId = affiMatch?.[1] || '';

    // Try multiple approaches to get the MP4 URL

    // Approach 1: Direct HTML5 player page
    const html5Url = `https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${cid}/mtype=AhRVShI_/service=litevideo/mode=part/width=720/height=480/affi_id=${affiId}/`;

    const response = await fetch(html5Url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.dmm.co.jp/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en;q=0.9',
      },
    });

    const html = await response.text();

    if (debug) {
      return NextResponse.json({
        status: response.status,
        htmlLength: html.length,
        htmlSnippet: html.substring(0, 500),
        containsCC3001: html.includes('cc3001'),
        containsMp4: html.includes('.mp4'),
        url: html5Url,
      });
    }

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

    const mainSrcMatch = html.match(/"src":"(\/\/cc3001[^"]+\.mp4)"/);
    let mainUrl = mainSrcMatch ? 'https:' + mainSrcMatch[1] : qualities[0]?.url || null;

    // Approach 2: If HTML5 player didn't work, try fetching the litevideo page directly
    if (!mainUrl) {
      const liteResponse = await fetch(playerUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.dmm.co.jp/',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ja,en;q=0.9',
        },
        redirect: 'follow',
      });

      const liteHtml = await liteResponse.text();

      // Look for the HTML5 player iframe src
      const iframeSrcMatch = liteHtml.match(/src="(https:\/\/www\.dmm\.co\.jp\/service\/digitalapi[^"]+)"/);
      if (iframeSrcMatch) {
        const iframeResponse = await fetch(iframeSrcMatch[1], {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://www.dmm.co.jp/',
          },
        });
        const iframeHtml = await iframeResponse.text();

        const iframeBitrateRegex = /"bitrate":"([^"]+)","src":"(\/\/cc3001[^"]+\.mp4)"/g;
        let iframeMatch;
        while ((iframeMatch = iframeBitrateRegex.exec(iframeHtml)) !== null) {
          qualities.push({
            label: iframeMatch[1],
            url: 'https:' + iframeMatch[2],
          });
        }

        const iframeMainMatch = iframeHtml.match(/"src":"(\/\/cc3001[^"]+\.mp4)"/);
        mainUrl = iframeMainMatch ? 'https:' + iframeMainMatch[1] : qualities[0]?.url || null;
      }
    }

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
