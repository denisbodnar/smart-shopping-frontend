import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import api from "../api/api";

export const useShoppingStore = defineStore("shopping", () => {
  const loading = reactive({
    auth: false,
    brands: false,
    categories: false,
    colors: false,
    searches: false,
    shoes: false,
    likedShoes: false,
    sizes: false,
    targetAudiences: false,
    user: false,
  });

  const error = reactive({
    auth: null,
    brands: null,
    categories: null,
    colors: null,
    searches: null,
    shoes: null,
    likedShoes: null,
    sizes: null,
    targetAudiences: null,
    user: null,
  });

  const token = ref(
    localStorage.getItem("token") || localStorage.getItem("auth_token") || null
  );
  const currentUser = ref(null);

  const brands = ref([]);
  const categories = ref([]);
  const colors = ref([]);
  const searchResults = ref([]);
  const searchId = ref(null);
  const shoes = ref([]);
  const likedShoes = ref([]);
  const sizes = ref([]);
  const targetAudiences = ref([]);

  function setLoading(key, value) {
    loading[key] = value;
  }

  function setError(key, value) {
    error[key] = value;
  }

  function extractErrorMessage(err) {
    return (
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Request failed"
    );
  }

  function setToken(nextToken) {
    token.value = nextToken || null;

    if (nextToken) {
      localStorage.setItem("token", nextToken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
    }
  }

  async function signUp(payload) {
    setLoading("auth", true);
    setError("auth", null);
    try {
      const { data } = await api.auth.signUp(payload);
      currentUser.value = data;
      return data;
    } catch (err) {
      setError("auth", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("auth", false);
    }
  }

  async function signIn(payload) {
    setLoading("auth", true);
    setError("auth", null);
    try {
      const { data } = await api.auth.signIn(payload);
      currentUser.value = data;
      return data;
    } catch (err) {
      setError("auth", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("auth", false);
    }
  }

  function googleOAuthUrl() {
    return api.auth.googleOAuthUrl();
  }

  async function googleOAuthCallback(params) {
    setLoading("auth", true);
    setError("auth", null);
    try {
      const { data } = await api.auth.googleOAuthCallback(params);

      if (data?.token) {
        setToken(data.token);
      }
      if (data?.user) {
        currentUser.value = data.user;
      }

      return data;
    } catch (err) {
      setError("auth", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("auth", false);
    }
  }

  async function fetchBrands() {
    setLoading("brands", true);
    setError("brands", null);
    try {
      const { data } = await api.brands.list();
      brands.value = Array.isArray(data) ? data : [];
      return brands.value;
    } catch (err) {
      setError("brands", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("brands", false);
    }
  }

  async function fetchCategories() {
    setLoading("categories", true);
    setError("categories", null);
    try {
      const { data } = await api.categories.list();
      categories.value = Array.isArray(data) ? data : [];
      return categories.value;
    } catch (err) {
      setError("categories", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("categories", false);
    }
  }

  async function fetchColors() {
    setLoading("colors", true);
    setError("colors", null);
    try {
      const { data } = await api.colors.list();
      colors.value = Array.isArray(data) ? data : [];
      return colors.value;
    } catch (err) {
      setError("colors", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("colors", false);
    }
  }

  async function createSearch(payload) {
    setLoading("searches", true);
    setError("searches", null);
    try {
      const { data } = await api.searches.create(payload);
      console.log("API Response data:", data);
      searchResults.value = Array.isArray(data) ? data : [];

      // Store search_id if it exists in the response
      if (data && data.search_id) {
        searchId.value = data.search_id;
        console.log("Stored search_id:", searchId.value);
      } else {
        console.log("No search_id in response");
      }

      return data;
    } catch (err) {
      setError("searches", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("searches", false);
    }
  }

  async function fetchSizes() {
    setLoading("sizes", true);
    setError("sizes", null);
    try {
      const { data } = await api.sizes.list();
      sizes.value = Array.isArray(data) ? data : [];
      return sizes.value;
    } catch (err) {
      setError("sizes", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("sizes", false);
    }
  }

  async function fetchShoes(searchId) {
    setLoading("shoes", true);
    setError("shoes", null);
    try {
      console.log("Fetching shoes with search_id:", searchId);
      const { data } = await api.shoes.list("35");
      console.log("Shoes API response:", data);
      shoes.value = Array.isArray(data) ? data : [];
      return shoes.value;
    } catch (err) {
      console.error("Error fetching shoes:", err);
      setError("shoes", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("shoes", false);
    }
  }

  async function fetchLikedShoes() {
    setLoading("likedShoes", true);
    setError("likedShoes", null);
    try {
      const { data } = await api.shoes.liked();
      likedShoes.value = Array.isArray(data) ? data : [];
      return likedShoes.value;
    } catch (err) {
      setError("likedShoes", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("likedShoes", false);
    }
  }

  async function likeShoe(shoeId) {
    try {
      await api.shoes.like(shoeId);
      // Refresh liked shoes list
      await fetchLikedShoes();
      return true;
    } catch (err) {
      console.error("Error liking shoe:", err);
      throw err;
    }
  }

  async function unlikeShoe(shoeId) {
    try {
      await api.shoes.unlike(shoeId);
      // Refresh liked shoes list
      await fetchLikedShoes();
      return true;
    } catch (err) {
      console.error("Error unliking shoe:", err);
      throw err;
    }
  }

  async function fetchTargetAudiences() {
    setLoading("targetAudiences", true);
    setError("targetAudiences", null);
    try {
      const { data } = await api.targetAudiences.list();
      targetAudiences.value = Array.isArray(data) ? data : [];
      return targetAudiences.value;
    } catch (err) {
      setError("targetAudiences", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("targetAudiences", false);
    }
  }

  async function fetchCurrentUser() {
    setLoading("user", true);
    setError("user", null);
    try {
      const { data } = await api.user.get();
      currentUser.value = data;
      return data;
    } catch (err) {
      setError("user", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("user", false);
    }
  }

  async function updateCurrentUser(payload) {
    setLoading("user", true);
    setError("user", null);
    try {
      const { data } = await api.user.update(payload);
      currentUser.value = data;
      return data;
    } catch (err) {
      setError("user", extractErrorMessage(err));
      throw err;
    } finally {
      setLoading("user", false);
    }
  }

  function signOut() {
    setToken(null);
    currentUser.value = null;
  }

  return {
    loading,
    error,
    token,
    currentUser,
    brands,
    categories,
    colors,
    searchResults,
    searchId,
    shoes,
    likedShoes,
    sizes,
    targetAudiences,
    setToken,
    signUp,
    signIn,
    googleOAuthUrl,
    googleOAuthCallback,
    fetchBrands,
    fetchCategories,
    fetchColors,
    createSearch,
    fetchShoes,
    fetchLikedShoes,
    likeShoe,
    unlikeShoe,
    fetchSizes,
    fetchTargetAudiences,
    fetchCurrentUser,
    updateCurrentUser,
    signOut,
  };
});
