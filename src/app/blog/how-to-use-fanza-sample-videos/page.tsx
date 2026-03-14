import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Watch FANZA Free Sample Videos — Complete Guide | SAKUSHIKO',
  description:
    'Step-by-step guide to finding and watching free official sample videos on FANZA/DMM, even if you don\'t read Japanese.',
  keywords: ['FANZA sample video', 'how to watch FANZA', 'DMM free video', 'FANZA guide english', 'JAV free sample how to'],
  openGraph: {
    title: 'How to Watch FANZA Free Sample Videos — Complete Guide',
    type: 'article',
  },
};

export default function HowToUseFanzaArticle() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/blog" className="text-xs text-muted hover:text-foreground transition-colors mb-4 block">
        ← Back to Blog
      </Link>

      <header className="mb-8">
        <time className="text-xs text-muted">March 10, 2026</time>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-2 mb-3 leading-tight">
          How to Watch FANZA Free Sample Videos (Complete Guide)
        </h1>
        <p className="text-sm text-muted">
          FANZA無料サンプル動画の見方 完全ガイド
        </p>
      </header>

      <div className="prose-custom space-y-6 text-sm leading-relaxed text-foreground/90">
        <p>
          FANZA (part of DMM, Japan&apos;s largest digital content platform) offers free sample
          videos for almost every title in their catalog. These are official previews provided
          by the studios — completely legal and free to watch. Here&apos;s how to access them.
        </p>

        <h2 className="text-lg font-bold text-foreground mt-8 mb-3">What Are FANZA Sample Videos?</h2>
        <p>
          Every video on FANZA comes with a free sample — usually 2-5 minutes of the full
          title. Studios provide these as previews to help customers decide before purchasing.
          They&apos;re hosted on FANZA&apos;s own servers and are 100% legal to watch.
        </p>

        <h2 className="text-lg font-bold text-foreground mt-8 mb-3">The Problem: FANZA&apos;s UI</h2>
        <p>
          While FANZA&apos;s content library is massive, their website is... not great for browsing.
          Especially if you don&apos;t read Japanese. The interface is cluttered, the search is
          limited, and finding samples by category is unnecessarily complicated. It feels
          like the UI is intentionally bad to push you toward purchasing.
        </p>

        <h2 className="text-lg font-bold text-foreground mt-8 mb-3">The Easy Way: Use SAKUSHIKO</h2>
        <p>
          SAKUSHIKO pulls the same official FANZA data through their public API and presents
          it in a clean, browsable interface. Here&apos;s what you can do:
        </p>

        <h3 className="text-base font-bold text-foreground mt-6 mb-2">Step 1: Browse by Category</h3>
        <p>
          Use the genre filter at the top of the page. Tap any category — debut titles, popular
          genres, specific types — and instantly see matching videos with their sample previews.
        </p>

        <h3 className="text-base font-bold text-foreground mt-6 mb-2">Step 2: Search</h3>
        <p>
          Know what you&apos;re looking for? Use the search bar. You can search by:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted">
          <li>Actress name (Japanese or English)</li>
          <li>Studio/maker name</li>
          <li>Title keywords</li>
          <li>Product ID (e.g., SONE-001)</li>
        </ul>

        <h3 className="text-base font-bold text-foreground mt-6 mb-2">Step 3: Watch the Sample</h3>
        <p>
          Tap any video card to open the detail page. The sample video plays right there —
          on mobile, it goes fullscreen and rotates to landscape automatically for the
          best viewing experience.
        </p>

        <h3 className="text-base font-bold text-foreground mt-6 mb-2">Step 4: Get the Full Version (Optional)</h3>
        <p>
          If you like what you see, hit the &quot;Watch Full Video on FANZA&quot; button.
          It takes you directly to the FANZA product page where you can rent or purchase
          the full title.
        </p>

        <div className="bg-card rounded-lg p-5 my-8 text-center">
          <p className="text-base font-bold text-foreground mb-3">
            Start Browsing Now — It&apos;s Free
          </p>
          <Link
            href="/?lang=en"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold px-6 py-3 rounded-lg transition-all text-sm"
          >
            Open SAKUSHIKO →
          </Link>
        </div>

        <h2 className="text-lg font-bold text-foreground mt-8 mb-3">FAQ</h2>

        <h3 className="text-base font-bold text-foreground mt-4 mb-1">Is this legal?</h3>
        <p>
          Yes. Sample videos are officially provided by FANZA/DMM for free public viewing.
          SAKUSHIKO accesses them through FANZA&apos;s official API.
        </p>

        <h3 className="text-base font-bold text-foreground mt-4 mb-1">Do I need an account?</h3>
        <p>
          No. You can browse and watch samples without any registration on SAKUSHIKO.
          You only need a FANZA account if you want to purchase the full video.
        </p>

        <h3 className="text-base font-bold text-foreground mt-4 mb-1">Does it work on mobile?</h3>
        <p>
          Yes — SAKUSHIKO is designed mobile-first. It works on any modern smartphone browser.
          You can also add it to your home screen for an app-like experience.
        </p>
      </div>

      <div className="mt-12 pt-6 border-t border-border">
        <Link href="/blog" className="text-sm text-accent hover:text-accent-hover transition-colors">
          ← More articles
        </Link>
      </div>
    </article>
  );
}
