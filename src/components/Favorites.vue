<template>
  <div class="page-wrapper">
    <div class="trainers-container">
      <h1 class="trainers-title">Улюблені кросівки</h1>

      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <p>Завантаження...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="errorMessage" class="error-state">
        <p>{{ errorMessage }}</p>
        <button @click="retryFetch" class="retry-button">
          Спробувати знову
        </button>
      </div>

      <!-- Favorites grid -->
      <div v-else-if="likedShoes.length > 0" class="trainers-grid">
        <div
          v-for="shoe in likedShoes"
          :key="shoe.id"
          class="trainer-card"
          :class="{ 'card-loading': loadingShoeId === shoe.id }"
        >
          <!-- Loading Overlay -->
          <div v-if="loadingShoeId === shoe.id" class="loading-overlay">
            <div class="spinner"></div>
          </div>

          <button
            @click="toggleFavorite(shoe.id)"
            class="favorite-btn"
            :class="{ favorited: true }"
            :disabled="loadingShoeId === shoe.id"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#000000"
              stroke-width="0.00024000000000000003"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                  fill="#7c3aed"
                ></path>
              </g>
            </svg>
          </button>

          <div class="trainer-image-container">
            <div class="trainer-image">
              <img :src="getCurrentImage(shoe)" :alt="shoe.name" />
            </div>
          </div>

          <!-- Carousel controls - only show if there are multiple images -->
          <div v-if="hasMultipleImages(shoe)" class="carousel-controls">
            <button
              @click="previousImage(shoe.id)"
              class="carousel-btn carousel-btn-prev"
              :disabled="currentImageIndex[shoe.id] === 0"
            >
              ‹
            </button>
            <div class="carousel-indicators">
              <span
                v-for="dotInfo in getVisibleDots(shoe)"
                :key="dotInfo.index"
                class="indicator-dot"
                :class="{
                  active: currentImageIndex[shoe.id] === dotInfo.index,
                }"
                @click="setImageIndex(shoe.id, dotInfo.index)"
              ></span>
            </div>
            <button
              @click="nextImage(shoe.id)"
              class="carousel-btn carousel-btn-next"
              :disabled="currentImageIndex[shoe.id] === shoe.images.length - 1"
            >
              ›
            </button>
          </div>

          <div class="trainer-info">
            <h3 class="trainer-name">{{ shoe.name }}</h3>
            <div class="trainer-price">
              <div v-if="shoe.discounted" class="price-container">
                <span class="price-old">{{ shoe.prev_price }} грн</span>
                <span class="price price-discounted"
                  >{{ shoe.current_price }} грн</span
                >
                <span class="discount-badge"
                  >-{{
                    calculateDiscount(shoe.prev_price, shoe.current_price)
                  }}%</span
                >
              </div>
              <span v-else class="price">{{ shoe.price }} грн</span>
              <button @click="openTryOnModal(shoe)" class="try-on-btn">
                👔 Приміряти одяг
              </button>
              <a
                v-if="shoe.product_url"
                :href="shoe.product_url"
                target="_blank"
                class="store-link"
                >Перейти в магазин</a
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <div class="empty-icon">❤️</div>
        <p class="empty-title">Немає улюблених кросівок</p>
        <p class="empty-text">
          Додайте кросівки до улюблених, щоб побачити їх тут
        </p>
        <button @click="goToSearch" class="search-button">Почати пошук</button>
      </div>

      <button @click="goBack" class="back-button">Повернутись</button>
    </div>

    <!-- Try On Modal -->
    <div v-if="showTryOnModal" class="modal-overlay" @click="closeTryOnModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Приміряти {{ selectedShoe?.name }}</h2>
          <button @click="closeTryOnModal" class="modal-close-btn">✕</button>
        </div>

        <div class="modal-body">
          <!-- Upload Section - Show only if no result yet -->
          <div v-if="!tryOnResultUrl">
            <!-- Photo Gallery View -->
            <div v-if="showPhotoGallery && !userPhoto">
              <p class="upload-instruction">Оберіть фото або завантажте нове</p>

              <!-- Existing Photos Grid -->
              <div v-if="loadingPhotos" class="loading-photos">
                <div class="spinner-small"></div>
                <p>Завантаження фото...</p>
              </div>

              <div v-else-if="userPhotos.length > 0" class="photo-gallery">
                <div
                  v-for="photo in userPhotos"
                  :key="photo.id"
                  class="gallery-item"
                >
                  <div
                    class="gallery-image-wrapper"
                    @click="selectExistingPhoto(photo)"
                  >
                    <img
                      :src="photo.url"
                      :alt="`Photo ${photo.id}`"
                      class="gallery-image"
                    />
                    <div class="gallery-overlay">
                      <span class="gallery-select-text">Обрати</span>
                    </div>
                  </div>
                  <button
                    @click="deleteUserPhoto(photo.id)"
                    class="gallery-delete-btn"
                    title="Видалити фото"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <!-- Upload New Photo Button -->
              <div class="upload-new-section">
                <button @click="triggerFileInput" class="upload-new-btn">
                  📷 Завантажити нове фото
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileSelect"
                  style="display: none"
                />
              </div>
            </div>

            <!-- Selected Photo Preview -->
            <div v-else-if="userPhoto" class="photo-preview">
              <div class="preview-image-wrapper">
                <img :src="userPhoto" alt="User photo" class="preview-image" />
                <!-- Show spinner overlay during photo upload -->
                <div v-if="uploadingPhoto" class="preview-loading-overlay">
                  <div class="preview-spinner"></div>
                  <p class="preview-loading-text">Завантаження фото...</p>
                </div>
              </div>
              <button
                v-if="!uploadingPhoto"
                @click="backToGallery"
                class="back-to-gallery-btn"
              >
                ← Назад до галереї
              </button>
            </div>
          </div>

          <!-- Result Section - Show when try-on is complete -->
          <div v-else class="result-section">
            <p class="result-title">✨ Ось як це виглядає на вас!</p>
            <div class="result-image-container">
              <img
                :src="tryOnResultUrl"
                alt="Try-on result"
                class="result-image"
              />
            </div>
            <button @click="removePhoto" class="try-again-btn">
              🔄 Спробувати інше фото
            </button>
          </div>

          <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
        </div>

        <div class="modal-actions">
          <button @click="closeTryOnModal" class="btn-cancel">
            {{ tryOnResultUrl ? "Закрити" : "Скасувати" }}
          </button>
          <button
            v-if="!tryOnResultUrl"
            @click="handleTryOn"
            class="btn-submit"
            :disabled="!userPhotoId || uploadingPhoto || processingTryOn"
          >
            {{ processingTryOn ? "Обробка..." : "Приміряти" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar Component -->
    <Sidebar />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useShoppingStore } from "../store/shoppingStore";
import { useRouter } from "vue-router";
import Sidebar from "./Sidebar.vue";
import api from "../api/api";

const shoppingStore = useShoppingStore();
const router = useRouter();

const likedShoes = computed(() => shoppingStore.likedShoes);
const isLoading = computed(() => shoppingStore.loading.likedShoes);
const errorMessage = computed(() => shoppingStore.error.likedShoes);

// Track current image index for each shoe's carousel
const currentImageIndex = reactive({});

// Track which shoe is currently being unliked
const loadingShoeId = ref(null);

// Try On Modal State
const showTryOnModal = ref(false);
const selectedShoe = ref(null);
const userPhoto = ref(null);
const userPhotoId = ref(null);
const userPhotos = ref([]);
const loadingPhotos = ref(false);
const fileInput = ref(null);
const uploadError = ref(null);
const uploadingPhoto = ref(false);
const processingTryOn = ref(false);
const tryOnResultUrl = ref(null);
const showPhotoGallery = ref(true);

const openTryOnModal = async (shoe) => {
  selectedShoe.value = shoe;
  showTryOnModal.value = true;
  userPhoto.value = null;
  userPhotoId.value = null;
  uploadError.value = null;
  tryOnResultUrl.value = null;
  showPhotoGallery.value = true;

  // Load user photos
  await fetchUserPhotos();
};

const fetchUserPhotos = async () => {
  loadingPhotos.value = true;
  try {
    const response = await api.userPhotos.list();
    userPhotos.value = Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error("Failed to load user photos:", err);
    userPhotos.value = [];
  } finally {
    loadingPhotos.value = false;
  }
};

const closeTryOnModal = () => {
  showTryOnModal.value = false;
  selectedShoe.value = null;
  userPhoto.value = null;
  userPhotoId.value = null;
  userPhotos.value = [];
  uploadError.value = null;
  uploadingPhoto.value = false;
  processingTryOn.value = false;
  tryOnResultUrl.value = null;
  showPhotoGallery.value = true;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    uploadError.value = "Будь ласка, виберіть файл зображення";
    return;
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    uploadError.value = "Розмір файлу не повинен перевищувати 10MB";
    return;
  }

  uploadError.value = null;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    userPhoto.value = e.target.result;
  };
  reader.readAsDataURL(file);

  // Upload photo immediately
  uploadingPhoto.value = true;
  try {
    const formData = new FormData();
    formData.append("image", file);

    const uploadResponse = await api.userPhotos.upload(formData);
    userPhotoId.value = uploadResponse.data.id;

    if (!userPhotoId.value) {
      throw new Error("Failed to get photo ID");
    }

    // Refresh the photo list
    await fetchUserPhotos();
  } catch (err) {
    console.error("Photo upload error:", err);
    uploadError.value =
      err.response?.data?.errors?.[0] ||
      err.response?.data?.message ||
      "Помилка при завантаженні фото. Спробуйте ще раз.";
    userPhoto.value = null;
  } finally {
    uploadingPhoto.value = false;
  }
};

const selectExistingPhoto = (photo) => {
  userPhoto.value = photo.url;
  userPhotoId.value = photo.id;
  showPhotoGallery.value = false;
  uploadError.value = null;
};

const deleteUserPhoto = async (photoId) => {
  if (!confirm("Ви впевнені, що хочете видалити це фото?")) return;

  try {
    await api.userPhotos.delete(photoId);

    // If the deleted photo was selected, clear selection
    if (userPhotoId.value === photoId) {
      userPhoto.value = null;
      userPhotoId.value = null;
      showPhotoGallery.value = true;
    }

    // Refresh the photo list
    await fetchUserPhotos();
  } catch (err) {
    console.error("Failed to delete photo:", err);
    uploadError.value =
      err.response?.data?.errors?.[0] ||
      err.response?.data?.message ||
      "Помилка при видаленні фото.";
  }
};

const backToGallery = () => {
  userPhoto.value = null;
  userPhotoId.value = null;
  tryOnResultUrl.value = null;
  showPhotoGallery.value = true;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const removePhoto = () => {
  userPhoto.value = null;
  userPhotoId.value = null;
  tryOnResultUrl.value = null;
  showPhotoGallery.value = true;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const handleTryOn = async () => {
  if (!userPhotoId.value || !selectedShoe.value) return;

  processingTryOn.value = true;
  uploadError.value = null;

  try {
    // Call try-on endpoint with user_photo_id and shoe_id
    const tryOnResponse = await api.userPhotos.tryOnShoe(userPhotoId.value, {
      shoe_id: selectedShoe.value.id,
    });

    // Display the result image
    if (tryOnResponse.data.success && tryOnResponse.data.url) {
      tryOnResultUrl.value = tryOnResponse.data.url;
    } else {
      throw new Error("Try-on processing failed");
    }
  } catch (err) {
    console.error("Try-on error:", err);
    const isTimeout =
      err?.code === "ECONNABORTED" ||
      String(err?.message || "").toLowerCase().includes("timeout");

    uploadError.value = isTimeout
      ? "Обробка займає більше часу ніж очікувалося. Будь ласка, спробуйте ще раз."
      : err.response?.data?.message ||
        "Помилка при обробці зображення. Спробуйте ще раз.";
  } finally {
    processingTryOn.value = false;
  }
};

onMounted(async () => {
  await retryFetch();
});

const retryFetch = async () => {
  try {
    await shoppingStore.fetchLikedShoes();
  } catch (err) {
    console.error("Failed to fetch liked shoes:", err);
  }
};

const goBack = () => {
  router.back();
};

const goToSearch = () => {
  router.push("/");
};

// Carousel functions
const hasMultipleImages = (shoe) => {
  return shoe.images && Array.isArray(shoe.images) && shoe.images.length > 1;
};

const getCurrentImage = (shoe) => {
  if (!shoe.images || !Array.isArray(shoe.images) || shoe.images.length === 0) {
    return "https://via.placeholder.com/300x300/cccccc/ffffff?text=No+Image";
  }
  const index = currentImageIndex[shoe.id] || 0;
  return shoe.images[index] || shoe.images[0];
};

const getVisibleDots = (shoe) => {
  if (!shoe.images || shoe.images.length === 0) return [];

  const maxDots = 5;
  const totalImages = shoe.images.length;

  if (totalImages <= maxDots) {
    return shoe.images.map((img, idx) => ({ img, index: idx }));
  }

  const currentIdx = currentImageIndex[shoe.id] || 0;
  let startIndex = Math.max(0, currentIdx - Math.floor(maxDots / 2));

  if (startIndex + maxDots > totalImages) {
    startIndex = totalImages - maxDots;
  }

  return shoe.images
    .slice(startIndex, startIndex + maxDots)
    .map((img, idx) => ({ img, index: startIndex + idx }));
};

const nextImage = (shoeId) => {
  const shoe = likedShoes.value.find((s) => s.id === shoeId);
  if (!shoe) return;

  const currentIdx = currentImageIndex[shoeId] || 0;
  if (currentIdx < shoe.images.length - 1) {
    currentImageIndex[shoeId] = currentIdx + 1;
  }
};

const previousImage = (shoeId) => {
  const currentIdx = currentImageIndex[shoeId] || 0;
  if (currentIdx > 0) {
    currentImageIndex[shoeId] = currentIdx - 1;
  }
};

const setImageIndex = (shoeId, index) => {
  currentImageIndex[shoeId] = index;
};

// Favorite functions
const toggleFavorite = async (shoeId) => {
  if (loadingShoeId.value) return; // Prevent multiple clicks

  loadingShoeId.value = shoeId;
  try {
    await shoppingStore.unlikeShoe(shoeId);
  } catch (err) {
    console.error("Failed to unlike shoe:", err);
  } finally {
    loadingShoeId.value = null;
  }
};

const calculateDiscount = (prevPrice, currentPrice) => {
  if (!prevPrice || !currentPrice) return 0;
  return Math.round(((prevPrice - currentPrice) / prevPrice) * 100);
};
</script>

<style scoped>
.page-wrapper {
  display: flex;
  height: 100vh;
  background: #2b2d31;
  color: #ffffff;
  overflow: hidden;
}

.trainers-container {
  flex: 1;
  margin-left: 320px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  padding: 2rem;
}

.trainers-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, #7c3aed, #06b6d4, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

.loading-state,
.error-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loading-state p,
.error-state p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
}

.trainers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(min-content, max-content);
  gap: 1.5rem;
  padding-bottom: 1rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Custom scrollbar styling */
.trainers-grid::-webkit-scrollbar {
  width: 8px;
}

.trainers-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.trainers-grid::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border-radius: 4px;
}

.trainers-grid::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #6d28d9, #0891b2);
}

.trainer-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

.trainer-card.card-loading {
  filter: blur(2px);
  pointer-events: none;
  opacity: 0.7;
}

.trainer-card:hover {
  transform: translateY(-4px);
  border-color: rgba(124, 58, 237, 0.5);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 100;
  border-radius: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #7c3aed;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.favorite-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  z-index: 10;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.favorite-btn svg {
  width: 22px;
  height: 22px;
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
}

.favorite-btn.favorited {
  background: rgba(124, 58, 237, 0.3);
  border-color: rgba(124, 58, 237, 0.5);
}

.favorite-btn:active {
  transform: scale(0.95);
}

.favorite-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.trainer-image-container {
  width: 100%;
}

.trainer-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.trainer-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.trainer-card:hover .trainer-image img {
  transform: scale(1.05);
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.carousel-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  font-weight: bold;
}

.carousel-btn:hover:not(:disabled) {
  background: rgba(124, 58, 237, 0.5);
  border-color: rgba(124, 58, 237, 0.8);
  transform: scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-indicators {
  display: flex;
  gap: 0.35rem;
  align-items: center;
}

.indicator-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator-dot:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.2);
}

.indicator-dot.active {
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  width: 9px;
  height: 9px;
}

.trainer-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.trainer-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trainer-price {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

.price {
  font-size: 1.3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.price-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-start;
}

.price-old {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
  font-weight: 500;
}

.price-discounted {
  font-size: 1.4rem;
  background: linear-gradient(135deg, #22c55e, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.discount-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 0.375rem;
  margin-top: 0.25rem;
}

.try-on-btn {
  display: block;
  width: 100%;
  padding: 0.65rem 1rem;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.try-on-btn:hover {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
}

.store-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(124, 58, 237, 0.2);
  border: 1px solid rgba(124, 58, 237, 0.4);
  border-radius: 0.5rem;
  color: #ffffff;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
}

.store-link:hover {
  background: rgba(124, 58, 237, 0.4);
  border-color: rgba(124, 58, 237, 0.6);
  transform: translateY(-2px);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
}

.empty-icon {
  font-size: 5rem;
  opacity: 0.3;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.empty-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.search-button {
  margin-top: 1rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
}

.back-button {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(-4px);
}

@media (max-width: 768px) {
  .trainers-container {
    margin-left: 0;
    padding: 1rem;
  }

  .trainers-title {
    font-size: 1.5rem;
  }

  .trainers-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .trainer-image {
    height: 180px;
  }

  .trainer-name {
    font-size: 0.85rem;
  }

  .price {
    font-size: 1.1rem;
  }
}

/* Try On Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #2b2d31;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
}

.upload-section {
  margin-bottom: 1rem;
}

.upload-instruction {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.loading-photos {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.loading-photos .spinner-small {
  margin: 0 auto 1rem;
}

.photo-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
}

.gallery-item {
  position: relative;
}

.gallery-image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.gallery-image-wrapper:hover {
  border-color: rgba(124, 58, 237, 0.6);
  transform: scale(1.05);
}

.gallery-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-image-wrapper:hover .gallery-overlay {
  opacity: 1;
}

.gallery-select-text {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
}

.gallery-delete-btn {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 28px;
  height: 28px;
  background: rgba(239, 68, 68, 0.9);
  border: 2px solid #ffffff;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.gallery-delete-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.1);
}

.upload-new-section {
  text-align: center;
  margin-top: 1rem;
}

.upload-new-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border: none;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-new-btn:hover {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
}

.back-to-gallery-btn {
  width: 100%;
  max-width: 420px;
  padding: 0.5rem 1rem;
  background: rgba(124, 58, 237, 0.2);
  border: 1px solid rgba(124, 58, 237, 0.4);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-to-gallery-btn:hover {
  background: rgba(124, 58, 237, 0.3);
  border-color: rgba(124, 58, 237, 0.6);
}

.upload-area {
  border: 2px dashed rgba(124, 58, 237, 0.4);
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(124, 58, 237, 0.05);
}

.upload-area:hover {
  border-color: rgba(124, 58, 237, 0.6);
  background: rgba(124, 58, 237, 0.1);
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.upload-text {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.photo-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.preview-image-wrapper {
  position: relative;
  width: 100%;
  max-width: 420px;
}

.preview-image {
  width: 100%;
  height: auto;
  max-height: 420px;
  object-fit: contain;
  border-radius: 0.75rem;
  border: 2px solid rgba(124, 58, 237, 0.3);
  display: block;
}

.preview-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.preview-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #7c3aed;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.preview-loading-text {
  margin: 0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
}

.remove-photo-btn {
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-photo-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.6);
}

.result-section {
  text-align: center;
}

.result-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #7c3aed, #06b6d4, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.result-image-container {
  margin-bottom: 1.5rem;
}

.result-image {
  max-width: 100%;
  max-height: 500px;
  border-radius: 0.75rem;
  border: 2px solid rgba(124, 58, 237, 0.4);
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
}

.try-again-btn {
  padding: 0.65rem 1.5rem;
  background: rgba(124, 58, 237, 0.2);
  border: 1px solid rgba(124, 58, 237, 0.4);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.try-again-btn:hover {
  background: rgba(124, 58, 237, 0.3);
  border-color: rgba(124, 58, 237, 0.6);
}

.error-message {
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-submit {
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border: none;
  color: #ffffff;
}

.btn-submit:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
