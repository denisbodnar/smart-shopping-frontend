<template>
  <!-- Backdrop overlay for mobile -->
  <div
    v-if="!isMobileHidden"
    class="sidebar-backdrop"
    @click="toggleMobileSidebar"
  ></div>

  <aside class="sidebar" :class="{ 'mobile-hidden': isMobileHidden }">
    <div class="sidebar-content">
      <!-- User Info Section -->
      <div class="sidebar-section user-section">
        <div v-if="loading.user" class="loading-text">Завантаження...</div>
        <div v-else-if="currentUser" class="user-info">
          <div class="user-avatar">
            <img
              v-if="currentUser.avatar_url"
              :src="currentUser.avatar_url"
              :alt="currentUser.first_name || currentUser.email"
              class="avatar-image"
            />
            <span v-else class="avatar-initials">
              {{ getUserInitials(currentUser) }}
            </span>
          </div>
          <div class="user-details">
            <p class="user-name">
              {{ currentUser.first_name || currentUser.email }}
            </p>
            <p class="user-email">{{ currentUser.email }}</p>
          </div>
          <button
            class="settings-btn"
            title="Налаштування"
            @click="openEditModal"
          >
            <svg
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
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.7848 0.449982C13.8239 0.449982 14.7167 1.16546 14.9122 2.15495L14.9991 2.59495C15.3408 4.32442 17.1859 5.35722 18.9016 4.7794L19.3383 4.63233C20.3199 4.30175 21.4054 4.69358 21.9249 5.56605L22.7097 6.88386C23.2293 7.75636 23.0365 8.86366 22.2504 9.52253L21.9008 9.81555C20.5267 10.9672 20.5267 13.0328 21.9008 14.1844L22.2504 14.4774C23.0365 15.1363 23.2293 16.2436 22.7097 17.1161L21.925 18.4339C21.4054 19.3064 20.3199 19.6982 19.3382 19.3676L18.9017 19.2205C17.1859 18.6426 15.3408 19.6754 14.9991 21.405L14.9122 21.845C14.7167 22.8345 13.8239 23.55 12.7848 23.55H11.2152C10.1761 23.55 9.28331 22.8345 9.08781 21.8451L9.00082 21.4048C8.65909 19.6754 6.81395 18.6426 5.09822 19.2205L4.66179 19.3675C3.68016 19.6982 2.59465 19.3063 2.07505 18.4338L1.2903 17.1161C0.770719 16.2436 0.963446 15.1363 1.74956 14.4774L2.09922 14.1844C3.47324 13.0327 3.47324 10.9672 2.09922 9.8156L1.74956 9.52254C0.963446 8.86366 0.77072 7.75638 1.2903 6.8839L2.07508 5.56608C2.59466 4.69359 3.68014 4.30176 4.66176 4.63236L5.09831 4.77939C6.81401 5.35722 8.65909 4.32449 9.00082 2.59506L9.0878 2.15487C9.28331 1.16542 10.176 0.449982 11.2152 0.449982H12.7848ZM12 15.3C13.8225 15.3 15.3 13.8225 15.3 12C15.3 10.1774 13.8225 8.69998 12 8.69998C10.1774 8.69998 8.69997 10.1774 8.69997 12C8.69997 13.8225 10.1774 15.3 12 15.3Z"
                  fill="url(#gear-gradient)"
                ></path>
                <defs>
                  <linearGradient
                    id="gear-gradient"
                    x1="0"
                    y1="0"
                    x2="24"
                    y2="24"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stop-color="#7c3aed" />
                    <stop offset="50%" stop-color="#06b6d4" />
                    <stop offset="100%" stop-color="#22c55e" />
                  </linearGradient>
                </defs>
              </g>
            </svg>
          </button>
        </div>
        <div v-else class="error-text">Не вдалось завантажити профіль</div>
      </div>

      <!-- Current Search Info -->
      <div class="sidebar-section search-section">
        <h3 class="section-title">
          <span class="icon">🔍</span>
          Поточний пошук
        </h3>
        <div v-if="searchId" class="search-info">
          <div class="search-item">
            <span class="label">ID пошуку:</span>
            <span class="value">{{ searchId }}</span>
          </div>
          <div class="search-item">
            <span class="label">Знайдено:</span>
            <span class="value">{{ shoes.length }} позицій</span>
          </div>
        </div>
        <div v-else class="empty-text">Немає активного пошуку</div>
      </div>

      <!-- Favorite Shoes Section -->
      <div class="sidebar-section favorites-section">
        <h3 class="section-title">
          <span class="icon">❤️</span>
          Улюблені
          <span class="count">({{ likedShoes.length }})</span>
        </h3>

        <div v-if="loading.likedShoes" class="loading-text">
          Завантаження...
        </div>
        <div v-else-if="error.likedShoes" class="error-text">
          {{ error.likedShoes }}
        </div>
        <div v-else-if="likedShoes.length > 0" class="favorites-list">
          <div v-for="shoe in likedShoes" :key="shoe.id" class="favorite-item">
            <div class="favorite-image">
              <img :src="getShoeImage(shoe)" :alt="shoe.name" />
            </div>
            <div class="favorite-info">
              <p class="favorite-name">{{ shoe.name }}</p>
              <p class="favorite-price">{{ shoe.price }} грн</p>
            </div>
          </div>
        </div>
        <div v-else class="empty-text">
          <p>Ще немає улюблених</p>
        </div>
      </div>
    </div>
  </aside>

  <!-- Mobile toggle button - outside sidebar so it doesn't move with it -->
  <button @click="toggleMobileSidebar" class="mobile-toggle-btn">
    <span v-if="isMobileHidden">☰</span>
    <span v-else>✕</span>
  </button>

  <!-- User Profile Edit Modal -->
  <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Редагувати профіль</h2>
        <button @click="closeEditModal" class="modal-close-btn">✕</button>
      </div>

      <form @submit.prevent="handleUpdateUser" class="edit-form">
        <div class="form-group">
          <label for="firstName">Ім'я</label>
          <input
            id="firstName"
            v-model="editForm.first_name"
            type="text"
            placeholder="Введіть ім'я"
          />
        </div>

        <div class="form-group">
          <label for="lastName">Прізвище</label>
          <input
            id="lastName"
            v-model="editForm.last_name"
            type="text"
            placeholder="Введіть прізвище"
          />
        </div>

        <div class="form-group">
          <label for="size">Розмір</label>
          <select id="size" v-model="editForm.size_id">
            <option :value="null">Оберіть розмір</option>
            <option v-for="size in sizes" :key="size.id" :value="size.id">
              {{ size.us_size }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="targetAudience">Цільова аудиторія</label>
          <select id="targetAudience" v-model="editForm.target_audience_id">
            <option :value="null">Оберіть категорію</option>
            <option
              v-for="audience in targetAudiences"
              :key="audience.id"
              :value="audience.id"
            >
              {{ audience.name }}
            </option>
          </select>
        </div>

        <div v-if="error.user" class="error-message">{{ error.user }}</div>

        <div class="modal-actions">
          <button
            type="button"
            @click="closeEditModal"
            class="btn-cancel"
            :disabled="loading.user"
          >
            Скасувати
          </button>
          <button type="submit" class="btn-save" :disabled="loading.user">
            {{ loading.user ? "Збереження..." : "Зберегти" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useShoppingStore } from "../store/shoppingStore";

const shoppingStore = useShoppingStore();
const isMobileHidden = ref(true); // Hidden by default on mobile

const currentUser = computed(() => shoppingStore.currentUser);
const searchId = computed(() => shoppingStore.searchId);
const shoes = computed(() => shoppingStore.shoes);
const likedShoes = computed(() => shoppingStore.likedShoes);
const loading = computed(() => shoppingStore.loading);
const error = computed(() => shoppingStore.error);

const toggleMobileSidebar = () => {
  isMobileHidden.value = !isMobileHidden.value;
};

onMounted(async () => {
  // Fetch user info
  if (!currentUser.value) {
    try {
      await shoppingStore.fetchCurrentUser();
      console.log("Current user in sidebar:", currentUser.value);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  } else {
    console.log("Current user in sidebar:", currentUser.value);
  }

  // Fetch liked shoes
  try {
    await shoppingStore.fetchLikedShoes();
  } catch (err) {
    console.error("Failed to fetch liked shoes:", err);
  }
});

const getUserInitials = (user) => {
  if (user.first_name) {
    return user.first_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }
  return user.email[0].toUpperCase();
};

const getShoeImage = (shoe) => {
  if (shoe.images && Array.isArray(shoe.images) && shoe.images.length > 0) {
    return shoe.images[0];
  }
  return "https://via.placeholder.com/60x60/cccccc/ffffff?text=No+Image";
};

// Edit Modal State
const showEditModal = ref(false);
const sizes = computed(() => shoppingStore.sizes);
const targetAudiences = computed(() => shoppingStore.targetAudiences);

const editForm = ref({
  first_name: "",
  last_name: "",
  size_id: null,
  target_audience_id: null,
});

const openEditModal = async () => {
  // Fetch sizes and target audiences if not already loaded
  if (sizes.value.length === 0) {
    try {
      await shoppingStore.fetchSizes();
    } catch (err) {
      console.error("Failed to fetch sizes:", err);
    }
  }

  if (targetAudiences.value.length === 0) {
    try {
      await shoppingStore.fetchTargetAudiences();
    } catch (err) {
      console.error("Failed to fetch target audiences:", err);
    }
  }

  // Populate form with current user data
  if (currentUser.value) {
    editForm.value = {
      first_name: currentUser.value.first_name || "",
      last_name: currentUser.value.last_name || "",
      size_id: currentUser.value.size_id || null,
      target_audience_id: currentUser.value.target_audience_id || null,
    };
  }

  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  shoppingStore.error.user = null;
};

const handleUpdateUser = async () => {
  try {
    await shoppingStore.updateCurrentUser(editForm.value);
    closeEditModal();
  } catch (err) {
    console.error("Failed to update user:", err);
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 320px;
  background: rgba(35, 37, 41, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  overflow-y: auto;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.mobile-toggle-btn {
  display: none;
}

.sidebar-backdrop {
  display: none;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  border-radius: 3px;
}

.sidebar-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.25rem;
}

.count {
  margin-left: auto;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
}

/* User Section */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.25rem;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-weight: 600;
  color: #ffffff;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  margin: 0.25rem 0 0 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.settings-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(124, 58, 237, 0.5);
  transform: scale(1.05);
}

.settings-btn:hover svg {
  transform: rotate(90deg);
}

.settings-btn:active {
  transform: scale(0.95);
}

/* Search Section */
.search-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
}

.label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
}

/* Favorites Section */
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.favorites-list::-webkit-scrollbar {
  width: 4px;
}

.favorites-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.favorites-list::-webkit-scrollbar-thumb {
  background: rgba(124, 58, 237, 0.5);
  border-radius: 2px;
}

.favorite-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.favorite-item:hover {
  background: rgba(124, 58, 237, 0.1);
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateX(-4px);
}

.favorite-image {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.favorite-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.favorite-name {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: #ffffff;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-price {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  font-weight: 700;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* State Messages */
.loading-text,
.error-text,
.empty-text {
  text-align: center;
  padding: 1rem;
  font-size: 0.875rem;
}

.loading-text {
  color: rgba(255, 255, 255, 0.8);
}

.error-text {
  color: #ff6b6b;
}

.empty-text {
  color: rgba(255, 255, 255, 0.5);
}

.empty-text p {
  margin: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 300px;
  }

  .sidebar.mobile-hidden {
    transform: translateX(-300px);
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .mobile-toggle-btn {
    display: flex;
    position: fixed;
    top: 20px;
    left: 20px;
    transform: none;
    width: 48px;
    height: 48px;
    background: rgba(124, 58, 237, 0.9);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: #ffffff;
    font-size: 24px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(124, 58, 237, 0.4);
    z-index: 1002;
  }

  .mobile-toggle-btn:active {
    transform: scale(0.95);
  }

  .sidebar:not(.mobile-hidden) + .mobile-toggle-btn,
  .sidebar:not(.mobile-hidden) .mobile-toggle-btn {
    left: 260px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
  }

  .mobile-toggle-btn:hover {
    background: rgba(124, 58, 237, 1);
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6);
  }

  .sidebar-content {
    padding: 1rem;
    padding-top: 5rem;
  }

  .sidebar-section {
    padding: 1rem;
  }

  .section-title {
    font-size: 0.9rem;
  }

  .user-avatar {
    width: 45px;
    height: 45px;
  }

  .user-name {
    font-size: 0.9rem;
  }

  .user-email {
    font-size: 0.75rem;
  }

  .favorite-item {
    padding: 0.5rem;
  }

  .favorite-image {
    width: 50px;
    height: 50px;
  }

  .favorite-name {
    font-size: 0.8rem;
  }

  .favorite-price {
    font-size: 0.85rem;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background: #2b2d31;
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
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
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-close-btn:hover {
  background: rgba(255, 0, 0, 0.2);
  border-color: rgba(255, 0, 0, 0.5);
  transform: scale(1.05);
}

.edit-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.form-group input,
.form-group select {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #7c3aed;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-group select option {
  background: #2b2d31;
  color: #ffffff;
}

.error-message {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #f87171;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-cancel,
.btn-save {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.btn-save {
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  color: #ffffff;
  border: 1px solid transparent;
}

.btn-save:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
}

.btn-cancel:disabled,
.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 100%;
    margin: 1rem;
  }

  .modal-header h2 {
    font-size: 1.25rem;
  }

  .edit-form {
    padding: 1rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
  }
}
</style>
