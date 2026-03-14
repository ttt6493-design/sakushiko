// DMM Affiliate API configuration
// Register at https://affiliate.dmm.com/ to get these credentials
export const API_CONFIG = {
  API_ID: process.env.DMM_API_ID || '',
  AFFILIATE_ID: process.env.DMM_AFFILIATE_ID || '',
  BASE_URL: 'https://api.dmm.com/affiliate/v3',
  SITE: 'FANZA',
  SERVICE: 'digital',
  FLOOR: 'videoa',
  HITS_PER_PAGE: 30,
};

export const isApiConfigured = (): boolean => {
  return API_CONFIG.API_ID !== '' && API_CONFIG.AFFILIATE_ID !== '';
};
