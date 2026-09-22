// Public base URL of the deployed site. Override with NEXT_PUBLIC_SITE_URL when moving to a custom domain.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sakushiko-rouge.vercel.app').replace(/\/$/, '');
