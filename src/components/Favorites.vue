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

    <!-- Sidebar Component -->
    <Sidebar />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useShoppingStore } from "../store/shoppingStore";
import { useRouter } from "vue-router";
import Sidebar from "./Sidebar.vue";

const shoppingStore = useShoppingStore();
const router = useRouter();

const likedShoes = computed(() => shoppingStore.likedShoes);
const isLoading = computed(() => shoppingStore.loading.likedShoes);
const errorMessage = computed(() => shoppingStore.error.likedShoes);

// Track current image index for each shoe's carousel
const currentImageIndex = reactive({});

// Track which shoe is currently being unliked
const loadingShoeId = ref(null);

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
</style>
