<template>
  <div class="callback-container">
    <div class="callback-card">
      <h1 class="callback-title">Signing you in...</h1>
      <p v-if="message" class="callback-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useShoppingStore } from '../store/shoppingStore';

const route = useRoute();
const router = useRouter();
const shoppingStore = useShoppingStore();

const message = ref('');

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : undefined;
  const code = typeof route.query.code === 'string' ? route.query.code : undefined;
  const state = typeof route.query.state === 'string' ? route.query.state : undefined;

  try {
    if (token) {
      shoppingStore.setToken(token);
      await shoppingStore.fetchCurrentUser();
      await router.replace('/hello');
      return;
    }

    if (!code) {
      message.value = 'Missing authorization code.';
      await router.replace('/sign-in');
      return;
    }

    await shoppingStore.googleOAuthCallback({ code, state });
    await router.replace('/hello');
  } catch (e) {
    message.value = 'Google sign-in failed.';
    await router.replace('/sign-in');
  }
});
</script>

<style scoped>
.callback-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background: #2b2d31;
  color: #ffffff;
}

.callback-card {
  width: 100%;
  max-width: 520px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.04);
}

.callback-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.callback-message {
  margin-top: 0.75rem;
  color: rgba(255, 255, 255, 0.75);
}
</style>
