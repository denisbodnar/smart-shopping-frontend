<template>
  <div class="hello-container">
    <p class="hello-text">
      Вітаю, {{ username }}, у світі смарт-шопінгу! Почнемо пошуки?
    </p>

    <button type="button" class="login-button" @click="onStart">Розпочати</button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useShoppingStore } from '../store/shoppingStore';

const shoppingStore = useShoppingStore();
const router = useRouter();

const user = computed(() => shoppingStore.currentUser);
const token = computed(() => shoppingStore.token);

const username = computed(() => {
  const u = user.value;
  return u?.first_name || u?.email || 'друже';
});

onMounted(async () => {
  if (token.value && !user.value) {
    try {
      await shoppingStore.fetchCurrentUser();
    } catch {
      // ignore
    }
  }
});

const onStart = () => {
  router.push('/new-user-wizard');
};
</script>
