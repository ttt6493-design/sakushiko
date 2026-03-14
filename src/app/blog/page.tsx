import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - SAKUSHIKO',
  description: 'Articles about Japanese AV, free sample videos, and FANZA content.',
};

const POSTS = [
  {
    slug: 'best-free-jav-sample-sites-2026',
    title: 'Best Free JAV Sample Video Sites in 2026 — Honest Comparison',
    titleJa: '2026年版 無料JAVサンプル動画サイト比較',
    excerpt: 'We compared the top sites for watching free Japanese AV sample videos. Here\'s which ones are worth your time (and which ones are full of malware).',
    excerptJa: '無料でJAVサンプル動画を見れるサイトを徹底比較。マルウェアだらけのサイトと安全なサイトを見極める。',
    date: '2026-03-14',
  },
  {
    slug: 'why-japanese-av-is-the-best',
    title: 'Why Japanese AV Has the Highest Production Quality in the World',
    titleJa: 'なぜ日本のAVは世界一のクオリティなのか',
    excerpt: 'From cinematography to storylines — why Japan\'s adult video industry produces content that\'s a cut above the rest.',
    excerptJa: '撮影技術からストーリーまで、日本のAV業界が世界で突出している理由を解説。',
    date: '2026-03-12',
  },
  {
    slug: 'how-to-use-fanza-sample-videos',
    title: 'How to Watch FANZA Free Sample Videos (Complete Guide)',
    titleJa: 'FANZA無料サンプル動画の見方 完全ガイド',
    excerpt: 'A step-by-step guide to finding and watching free official sample videos on FANZA/DMM, even if you don\'t read Japanese.',
    excerptJa: 'FANZAの公式無料サンプル動画を見つけて視聴する方法をステップバイステップで解説。',
    date: '2026-03-10',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Blog</h1>
      <p className="text-sm text-muted mb-8">
        Articles about Japanese AV, free samples, and how to get the best viewing experience.
      </p>

      <div className="space-y-6">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-card rounded-lg p-5 hover:bg-card-hover transition-colors group"
          >
            <time className="text-xs text-muted">{post.date}</time>
            <h2 className="text-base font-bold text-foreground group-hover:text-accent transition-colors mt-1 mb-1">
              {post.title}
            </h2>
            <p className="text-xs text-muted/70 mb-2">{post.titleJa}</p>
            <p className="text-sm text-muted leading-relaxed">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
