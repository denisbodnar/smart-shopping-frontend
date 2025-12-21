import axiosClient from "./axiosClient";

const auth = {
  signUp: (payload) => axiosClient.post("/api/v1/sign_up", payload),
  signIn: (payload) => axiosClient.post("/api/v1/sign_in", payload),

  // OAuth endpoints typically require full-page redirects; these helpers are here for convenience.
  googleOAuthUrl: () => {
    const baseURL = axiosClient.defaults.baseURL || "";
    return `${String(baseURL).replace(/\/$/, "")}/auth/google_oauth2`;
  },
  googleOAuthCallback: (params) =>
    axiosClient.get("/auth/google_oauth2/callback", { params }),
  oauthFailure: () => axiosClient.get("/auth/failure"),
};

const brands = {
  list: () => axiosClient.get("/api/v1/brands"),
};

const categories = {
  list: () => axiosClient.get("/api/v1/categories"),
};

const colors = {
  list: () => axiosClient.get("/api/v1/colors"),
};

const searches = {
  list: () => axiosClient.get("/api/v1/searches"),
  create: (payload) => axiosClient.post("/api/v1/searches", payload),
};

const shoes = {
  list: (searchId) =>
    axiosClient.get("/api/v1/shoes", { params: { search_id: searchId } }),
  liked: () => axiosClient.get("/api/v1/shoes/liked"),
  like: (shoeId) => axiosClient.post(`/api/v1/shoes/${shoeId}/like`),
  unlike: (shoeId) => axiosClient.post(`/api/v1/shoes/${shoeId}/dislike`),
};

const sizes = {
  list: () => axiosClient.get("/api/v1/sizes"),
};

const targetAudiences = {
  list: () => axiosClient.get("/api/v1/target_audiences"),
};

const user = {
  get: () => axiosClient.get("/api/v1/user"),
  update: (payload) => axiosClient.patch("/api/v1/user", payload),
};

const userPhotos = {
  list: () => axiosClient.get("/api/v1/user_photos"),
  upload: (formData) =>
    axiosClient.post("/api/v1/user_photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id) => axiosClient.delete(`/api/v1/user_photos/${id}`),
  tryOnShoe: (userPhotoId, payload) =>
    axiosClient.post(`/api/v1/user_photos/${userPhotoId}/try_on_shoe`, payload),
};

export const api = {
  auth,
  brands,
  categories,
  colors,
  searches,
  shoes,
  sizes,
  targetAudiences,
  user,
  userPhotos,
};

export default api;
