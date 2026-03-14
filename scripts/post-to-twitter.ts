/**
 * Twitter/X Auto-Post Script
 *
 * Posts new sample videos to Twitter automatically.
 * Run with: npx ts-node scripts/post-to-twitter.ts
 *
 * Setup:
 * 1. Create Twitter Developer account: https://developer.twitter.com/
 * 2. Create a project & app, get API keys
 * 3. Set environment variables (see below)
 * 4. npm install twitter-api-v2
 *
 * Can be automated with:
 * - GitHub Actions (cron schedule)
 * - Vercel Cron Jobs
 */

// Environment variables needed:
// TWITTER_API_KEY
// TWITTER_API_SECRET
// TWITTER_ACCESS_TOKEN
// TWITTER_ACCESS_SECRET
// DMM_API_ID
// DMM_AFFILIATE_ID

const SITE_URL = 'https://sakushiko-rouge.vercel.app';

interface VideoForPost {
  title: string;
  actresses: string[];
  content_id: string;
  genres: string[];
  maker: string;
}

function generateTweetJA(video: VideoForPost): string {
  const actress = video.actresses[0] || '';
  const genre = video.genres.slice(0, 2).join(' ');

  return [
    `🆕 新着サンプル動画`,
    ``,
    `${video.title}`,
    actress ? `👩 ${actress}` : '',
    `🏷️ ${genre}`,
    ``,
    `▶ 無料で視聴: ${SITE_URL}/video/${video.content_id}`,
    ``,
    `#FANZA #サンプル動画 #無料 #AV`,
  ].filter(Boolean).join('\n');
}

function generateTweetEN(video: VideoForPost): string {
  const actress = video.actresses[0] || '';

  return [
    `🆕 New Free Sample`,
    ``,
    `${video.title}`,
    actress ? `👩 ${actress}` : '',
    `🎬 ${video.maker}`,
    ``,
    `▶ Watch free: ${SITE_URL}/video/${video.content_id}?lang=en`,
    ``,
    `No ads. No popups. Just content.`,
    `#JAV #FreeSample #JapaneseAV #FANZA`,
  ].filter(Boolean).join('\n');
}

// --- Main logic (uncomment when twitter-api-v2 is installed) ---

/*
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

async function fetchLatestVideos(): Promise<VideoForPost[]> {
  const params = new URLSearchParams({
    api_id: process.env.DMM_API_ID!,
    affiliate_id: process.env.DMM_AFFILIATE_ID!,
    site: 'FANZA',
    service: 'digital',
    floor: 'videoa',
    hits: '5',
    sort: 'date',
    output: 'json',
  });

  const res = await fetch(`https://api.dmm.com/affiliate/v3/ItemList?${params}`);
  const data = await res.json();

  return data.result.items.map((item: any) => ({
    title: item.title,
    actresses: item.iteminfo.actress?.map((a: any) => a.name) || [],
    content_id: item.content_id,
    genres: item.iteminfo.genre?.map((g: any) => g.name) || [],
    maker: item.iteminfo.maker?.[0]?.name || '',
  }));
}

async function main() {
  const videos = await fetchLatestVideos();

  for (const video of videos.slice(0, 2)) {
    // Post Japanese tweet
    await client.v2.tweet(generateTweetJA(video));
    console.log(`[JP] Posted: ${video.title}`);

    // Wait 5 minutes between posts
    await new Promise(r => setTimeout(r, 5 * 60 * 1000));

    // Post English tweet
    await client.v2.tweet(generateTweetEN(video));
    console.log(`[EN] Posted: ${video.title}`);

    await new Promise(r => setTimeout(r, 5 * 60 * 1000));
  }
}

main().catch(console.error);
*/

// For now, just output example tweets
const exampleVideo: VideoForPost = {
  title: '新人専属デビュー作品 Vol.1',
  actresses: ['出演者A'],
  content_id: 'sample00001',
  genres: ['美少女', 'デビュー作品'],
  maker: 'S1 NO.1 STYLE',
};

console.log('=== Japanese Tweet ===');
console.log(generateTweetJA(exampleVideo));
console.log('\n=== English Tweet ===');
console.log(generateTweetEN(exampleVideo));
console.log('\n✅ Tweet templates ready. Install twitter-api-v2 and set env vars to go live.');
