<template>
  <div class="page-wrapper">
    <div class="trainers-container">
      <h1 class="trainers-title">Пошук кросівок</h1>

      <div v-if="searchId" class="search-info">
        <p>
          ID пошуку: <strong>{{ searchId }}</strong>
        </p>
      </div>

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

      <!-- Shoes grid -->
      <div v-else-if="shoes.length > 0" class="trainers-grid">
        <div v-for="shoe in shoes" :key="shoe.id" class="trainer-card">
          <button
            @click="toggleFavorite(shoe.id)"
            class="favorite-btn"
            :class="{ favorited: isFavorited(shoe.id) }"
          >
            <svg
              v-if="isFavorited(shoe.id)"
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
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.1371H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z"
                  fill="#ffffff"
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
              <span class="price">{{ shoe.price }} грн</span>
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
        <p>Результати не знайдено</p>
      </div>

      <button @click="goBack" class="back-button">Повернутись</button>
    </div>

    <!-- Sidebar Component -->
    <Sidebar />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useShoppingStore } from "../store/shoppingStore";
import Sidebar from "./Sidebar.vue";

const router = useRouter();
const shoppingStore = useShoppingStore();

const searchId = computed(() => shoppingStore.searchId);
const shoes = computed(() => shoppingStore.shoes);
const isLoading = computed(() => shoppingStore.loading.shoes);
const errorMessage = computed(() => shoppingStore.error.shoes);
const likedShoes = computed(() => shoppingStore.likedShoes);

// Track current image index for each shoe
const currentImageIndex = reactive({});

onMounted(async () => {
  console.log("ShoesCatalog mounted, searchId:", searchId.value);
  if (searchId.value) {
    try {
      await shoppingStore.fetchShoes(searchId.value);
      console.log("Shoes fetched successfully:", shoppingStore.shoes);

      // Initialize image indices for all shoes
      shoppingStore.shoes.forEach((shoe) => {
        currentImageIndex[shoe.id] = 0;
      });
    } catch (error) {
      console.error("Failed to fetch shoes:", error);
    }
  } else {
    console.warn("No search_id found, redirecting to wizard");
    router.push("/new-user-wizard");
  }
});

const retryFetch = async () => {
  if (searchId.value) {
    await shoppingStore.fetchShoes(searchId.value);
  }
};

const hasMultipleImages = (shoe) => {
  return shoe.images && Array.isArray(shoe.images) && shoe.images.length > 1;
};

const getCurrentImage = (shoe) => {
  if (shoe.images && Array.isArray(shoe.images) && shoe.images.length > 0) {
    const index = currentImageIndex[shoe.id] || 0;
    return shoe.images[index];
  }
  return "https://via.placeholder.com/300x280/cccccc/ffffff?text=No+Image";
};

const getVisibleDots = (shoe) => {
  if (!shoe.images || shoe.images.length <= 5) {
    return shoe.images.map((img, index) => ({ img, index }));
  }

  const currentIndex = currentImageIndex[shoe.id] || 0;
  const totalImages = shoe.images.length;
  const maxVisibleDots = 5;

  // Calculate the range of visible dots
  let startIndex = Math.max(0, currentIndex - 2);
  let endIndex = Math.min(totalImages, startIndex + maxVisibleDots);

  // Adjust start if we're near the end
  if (endIndex - startIndex < maxVisibleDots) {
    startIndex = Math.max(0, endIndex - maxVisibleDots);
  }

  return shoe.images.slice(startIndex, endIndex).map((img, idx) => ({
    img,
    index: startIndex + idx,
  }));
};

const setImageIndex = (shoeId, index) => {
  const shoe = shoppingStore.shoes.find((s) => s.id === shoeId);
  if (shoe && shoe.images && index >= 0 && index < shoe.images.length) {
    currentImageIndex[shoeId] = index;
  }
};

const nextImage = (shoeId) => {
  const shoe = shoppingStore.shoes.find((s) => s.id === shoeId);
  if (shoe && shoe.images) {
    const maxIndex = shoe.images.length - 1;
    if (currentImageIndex[shoeId] < maxIndex) {
      currentImageIndex[shoeId]++;
    }
  }
};

const previousImage = (shoeId) => {
  if (currentImageIndex[shoeId] > 0) {
    currentImageIndex[shoeId]--;
  }
};

const isFavorited = (shoeId) => {
  return likedShoes.value.some((shoe) => shoe.id === shoeId);
};

const toggleFavorite = async (shoeId) => {
  try {
    if (isFavorited(shoeId)) {
      await shoppingStore.unlikeShoe(shoeId);
    } else {
      await shoppingStore.likeShoe(shoeId);
    }
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
  }
};

const goBack = () => {
  router.push("/new-user-wizard");
};
</script>

<style scoped>
.page-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.trainers-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-left: 340px; /* Make room for sidebar on the left */
  height: 100vh;
  background: #2b2d31;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.trainers-title {
  font-size: 2rem;
  font-weight: 400;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #ffffff;
  flex-shrink: 0;
}

.search-info {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  flex-shrink: 0;
}

.search-info p {
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
}

.search-info strong {
  color: #ffffff;
  font-weight: 600;
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

.trainer-card:hover {
  transform: translateY(-4px);
  border-color: rgba(124, 58, 237, 0.5);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.2);
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
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 20px;
  line-height: 1;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover:not(:disabled) {
  background: rgba(124, 58, 237, 0.3);
  border-color: rgba(124, 58, 237, 0.5);
  transform: scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.2;
  cursor: not-allowed;
}

.carousel-indicators {
  display: flex;
  gap: 4px;
  align-items: center;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.indicator-dot.active {
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  width: 8px;
  height: 8px;
  box-shadow: 0 0 8px rgba(124, 58, 237, 0.5);
}

.trainer-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.trainer-info {
  padding: 1rem;
}

.trainer-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #ffffff;
  line-height: 1.3;
  min-height: 2.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trainer-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 0.5rem;
  flex-wrap: wrap;
}

.price {
  font-size: 1.3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.store-link {
  font-size: 0.75rem;
  color: #06b6d4;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.4rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(6, 182, 212, 0.3);
  white-space: nowrap;
}

.store-link:hover {
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.5);
  background: rgba(34, 197, 94, 0.1);
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-state p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
}

.error-state p {
  font-size: 1.1rem;
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
}

.retry-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #000000;
  background: #22c55e;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #1ea34a;
  transform: translateY(-1px);
}

.back-button {
  display: block;
  margin: 1.5rem auto 0;
  padding: 1.25rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #000000;
  background: #ffffff;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.back-button:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .trainers-container {
    padding: 1rem;
    padding-left: 1rem;
  }

  .trainers-title {
    font-size: 1.5rem;
  }

  .trainers-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .trainer-card {
    font-size: 0.9rem;
  }

  .trainer-image {
    height: 200px;
  }

  .trainer-name {
    font-size: 0.9rem;
    min-height: 2.4rem;
  }

  .price {
    font-size: 1.2rem;
  }

  .store-link {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
