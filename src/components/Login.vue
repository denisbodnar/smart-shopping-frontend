<template>
  <div class="login-container">
    <h1 class="login-title">Login</h1>
    <form class="login-form" @submit.prevent="onSubmit">
      <label class="login-label">
        <span>Email</span>
        <input v-model="email" type="email" class="login-input" required />
      </label>

      <label class="login-label">
        <span>Password</span>
        <input v-model="password" type="password" class="login-input" required />
      </label>

      <button type="submit" class="login-button">Sign in</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const onSubmit = () => {
  // handle login submit
  console.log('Login submitted', { email: email.value, password: password.value })
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  background: #ffffff;
}

.login-title {
  margin: 0 0 1.5rem;
  font-size: 1.75rem;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  gap: 0.4rem;
}

.login-input {
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d4d4d8;
  font-size: 0.95rem;
}

.login-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.login-button {
  margin-top: 0.75rem;
  padding: 0.7rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #3b82f6;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
}

.login-button:hover {
  background: #2563eb;
}
</style>
