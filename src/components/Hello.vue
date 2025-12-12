<template>
  <div class="hello-container">
    <h1 class="hello-title">Hello</h1>

    <div v-if="loading.user" class="hello-card">Loading user...</div>

    <div v-else-if="user" class="hello-card">
      <div class="hello-row">
        <span class="hello-label">Email</span>
        <span class="hello-value">{{ user.email }}</span>
      </div>

      <div class="hello-row">
        <span class="hello-label">First name</span>
        <span class="hello-value">{{ user.first_name || '-' }}</span>
      </div>

      <div class="hello-row">
        <span class="hello-label">Last name</span>
        <span class="hello-value">{{ user.last_name || '-' }}</span>
      </div>

      <div class="hello-row">
        <span class="hello-label">Size</span>
        <span class="hello-value">{{ user.size?.name || '-' }}</span>
      </div>

      <div class="hello-row">
        <span class="hello-label">Target audience</span>
        <span class="hello-value">{{ user.target_audience?.name || '-' }}</span>
      </div>

      <div class="hello-row">
        <span class="hello-label">Token</span>
        <span class="hello-value hello-mono">{{ token || '-' }}</span>
      </div>

      <button class="hello-button" type="button" @click="onSignOut">Sign out</button>
    </div>

    <div v-else class="hello-card">
      <div class="hello-row">
        <span class="hello-value">You are not logged in.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useShoppingStore } from '../store/shoppingStore';

const shoppingStore = useShoppingStore();

const user = computed(() => shoppingStore.currentUser);
const token = computed(() => shoppingStore.token);
const loading = computed(() => shoppingStore.loading);

onMounted(async () => {
  if (token.value && !user.value) {
    try {
      await shoppingStore.fetchCurrentUser();
    } catch {
      // ignore
    }
  }
});

const onSignOut = () => {
  shoppingStore.signOut();
};
</script>

<style scoped>
.hello-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: #2b2d31;
  color: #ffffff;
  z-index: 1000;
}

.hello-title {
  margin: 0 0 3rem;
  font-size: 1.75rem;
  text-align: center;
  font-weight: 400;
}

.hello-card {
  width: 100%;
  max-width: 600px;
  padding: 0 1rem;
}

.hello-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  margin-bottom: 1rem;
}

.hello-row:last-child {
  border-bottom: none;
}

.hello-label {
  color: rgba(255, 255, 255, 0.7);
}

.hello-value {
  color: #ffffff;
  text-align: right;
  overflow-wrap: anywhere;
}

.hello-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.85rem;
  opacity: 0.9;
}

.hello-button {
  margin-top: 0.75rem;
  width: 100%;
  padding: 1.25rem 1.5rem;
  border-radius: 2rem;
  border: none;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.hello-button:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .hello-container {
    padding: 1rem;
  }

  .hello-title {
    font-size: 1.5rem;
    margin: 0 0 2rem;
  }

  .hello-card {
    max-width: 500px;
  }

  .hello-row {
    padding: 1rem 1.25rem;
  }

  .hello-button {
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .hello-container {
    padding: 0.75rem;
  }

  .hello-title {
    font-size: 1.25rem;
    margin: 0 0 1.5rem;
  }

  .hello-row {
    padding: 0.875rem 1rem;
  }

  .hello-button {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
