import axiosClient from './axiosClient';

const auth = {
  signUp: (payload) => axiosClient.post('/api/v1/sign_up', payload),
  signIn: (payload) => axiosClient.post('/api/v1/sign_in', payload),

  // OAuth endpoints typically require full-page redirects; these helpers are here for convenience.
  googleOAuthUrl: () => {
    const baseURL = axiosClient.defaults.baseURL || '';
    return `${String(baseURL).replace(/\/$/, '')}/auth/google_oauth2`;
  },
  googleOAuthCallback: (params) => axiosClient.get('/auth/google_oauth2/callback', { params }),
  oauthFailure: () => axiosClient.get('/auth/failure'),
};

const brands = {
  list: () => axiosClient.get('/api/v1/brands'),
};

const categories = {
  list: () => axiosClient.get('/api/v1/categories'),
};

const colors = {
  list: () => axiosClient.get('/api/v1/colors'),
};

const sizes = {
  list: () => axiosClient.get('/api/v1/sizes'),
};

const targetAudiences = {
  list: () => axiosClient.get('/api/v1/target_audiences'),
};

const user = {
  get: () => axiosClient.get('/api/v1/user'),
  update: (payload) => axiosClient.patch('/api/v1/user', payload),
};

export const api = {
  auth,
  brands,
  categories,
  colors,
  sizes,
  targetAudiences,
  user,
};

export default api;
