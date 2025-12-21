<template>
  <div class="register-container">
    <h1 class="register-title">Реєстрація</h1>
    <form class="register-form" @submit.prevent="onSubmit">
      <label class="register-label">
        <span>Name</span>
        <input
          v-model="name"
          type="text"
          class="register-input"
          placeholder="Ім'я"
          required
        />
      </label>

      <label class="register-label">
        <span>Email</span>
        <input
          v-model="email"
          type="email"
          class="register-input"
          placeholder="Адреса електронної пошти"
          required
        />
      </label>

      <label class="register-label">
        <span>Password</span>
        <div class="password-input-wrapper">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="register-input"
            placeholder="Пароль"
            required
          />
          <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
            tabindex="-1"
          >
            <svg
              v-if="showPassword"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="password-icon"
            >
              <path
                d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
                fill="#ffffff"
              ></path>
              <path
                d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
                fill="#ffffff"
              ></path>
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="password-icon"
            >
              <path
                d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
                fill="#ffffff"
              ></path>
              <path
                d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
                fill="#ffffff"
              ></path>
              <path
                d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
                fill="#ffffff"
              ></path>
              <path
                d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
                fill="#ffffff"
              ></path>
              <path
                d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
                fill="#ffffff"
              ></path>
            </svg>
          </button>
        </div>
      </label>

      <label class="register-label">
        <span>Confirm Password</span>
        <div class="password-input-wrapper">
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="register-input"
            placeholder="Підтвердіть пароль"
            required
          />
          <button
            type="button"
            class="password-toggle"
            @click="showConfirmPassword = !showConfirmPassword"
            tabindex="-1"
          >
            <svg
              v-if="showConfirmPassword"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="password-icon"
            >
              <path
                d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z"
                fill="#ffffff"
              ></path>
              <path
                d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z"
                fill="#ffffff"
              ></path>
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="password-icon"
            >
              <path
                d="M21.2714 9.17834C20.9814 8.71834 20.6714 8.28834 20.3514 7.88834C19.9814 7.41834 19.2814 7.37834 18.8614 7.79834L15.8614 10.7983C16.0814 11.4583 16.1214 12.2183 15.9214 13.0083C15.5714 14.4183 14.4314 15.5583 13.0214 15.9083C12.2314 16.1083 11.4714 16.0683 10.8114 15.8483C10.8114 15.8483 9.38141 17.2783 8.35141 18.3083C7.85141 18.8083 8.01141 19.6883 8.68141 19.9483C9.75141 20.3583 10.8614 20.5683 12.0014 20.5683C13.7814 20.5683 15.5114 20.0483 17.0914 19.0783C18.7014 18.0783 20.1514 16.6083 21.3214 14.7383C22.2714 13.2283 22.2214 10.6883 21.2714 9.17834Z"
                fill="#ffffff"
              ></path>
              <path
                d="M14.0206 9.98062L9.98062 14.0206C9.47062 13.5006 9.14062 12.7806 9.14062 12.0006C9.14062 10.4306 10.4206 9.14062 12.0006 9.14062C12.7806 9.14062 13.5006 9.47062 14.0206 9.98062Z"
                fill="#ffffff"
              ></path>
              <path
                d="M18.25 5.74969L14.86 9.13969C14.13 8.39969 13.12 7.95969 12 7.95969C9.76 7.95969 7.96 9.76969 7.96 11.9997C7.96 13.1197 8.41 14.1297 9.14 14.8597L5.76 18.2497H5.75C4.64 17.3497 3.62 16.1997 2.75 14.8397C1.75 13.2697 1.75 10.7197 2.75 9.14969C3.91 7.32969 5.33 5.89969 6.91 4.91969C8.49 3.95969 10.22 3.42969 12 3.42969C14.23 3.42969 16.39 4.24969 18.25 5.74969Z"
                fill="#ffffff"
              ></path>
              <path
                d="M14.8581 11.9981C14.8581 13.5681 13.5781 14.8581 11.9981 14.8581C11.9381 14.8581 11.8881 14.8581 11.8281 14.8381L14.8381 11.8281C14.8581 11.8881 14.8581 11.9381 14.8581 11.9981Z"
                fill="#ffffff"
              ></path>
              <path
                d="M21.7689 2.22891C21.4689 1.92891 20.9789 1.92891 20.6789 2.22891L2.22891 20.6889C1.92891 20.9889 1.92891 21.4789 2.22891 21.7789C2.37891 21.9189 2.56891 21.9989 2.76891 21.9989C2.96891 21.9989 3.15891 21.9189 3.30891 21.7689L21.7689 3.30891C22.0789 3.00891 22.0789 2.52891 21.7689 2.22891Z"
                fill="#ffffff"
              ></path>
            </svg>
          </button>
        </div>
      </label>

      <button
        type="submit"
        class="register-button"
        :disabled="!isFormValid || isSubmitting"
      >
        {{ isSubmitting ? "Завантаження..." : "Зареєструватися" }}
      </button>

      <p class="register-link">
        Вже є обліковий запис?
        <router-link to="/sign-in" class="register-link-text"
          >Увійти</router-link
        >
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useShoppingStore } from "../store/shoppingStore";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const isFormValid = computed(() => {
  return (
    name.value.trim() !== "" &&
    email.value.trim() !== "" &&
    password.value.trim() !== "" &&
    confirmPassword.value.trim() !== ""
  );
});

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const router = useRouter();
const shoppingStore = useShoppingStore();

const isSubmitting = computed(() => shoppingStore.loading.auth);

const onSubmit = async () => {
  if (!isValidEmail(email.value)) {
    toast.error("Невірний формат електронної пошти!");
    return;
  }

  // handle registration submit
  if (password.value !== confirmPassword.value) {
    toast.error("Паролі не співпадають!");
    return;
  }

  const parts = name.value.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  try {
    await shoppingStore.signUp({
      email: email.value,
      password: password.value,
      first_name: firstName,
      last_name: lastName,
    });

    toast.success("Реєстрація успішна!");
    router.push("/sign-in");
  } catch (e) {
    toast.error(shoppingStore.error.auth || "Не вдалося зареєструватися");
  }
};
</script>

<style scoped>
.register-container {
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
  z-index: 1000;
  color: #ffffff;
}

.register-title {
  margin: 0 0 3rem;
  font-size: 1.75rem;
  text-align: center;
  color: #ffffff;
  font-weight: 400;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 600px;
  padding: 0 1rem;
}

.register-label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  gap: 0.4rem;
  color: #ffffff;
}

.register-label span {
  position: absolute;
  visibility: hidden;
  height: 0;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  opacity: 0.6;
  z-index: 10;
}

.password-toggle:hover {
  opacity: 1;
}

.password-icon {
  width: 20px;
  height: 20px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-10deg);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.register-input {
  padding: 1.25rem 3.5rem 1.25rem 1.5rem;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  background: transparent;
  transition: all 0.3s ease;
  width: 100%;
}

.register-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.register-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  color: #ffffff;
}

.register-button {
  margin-top: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-radius: 2rem;
  border: none;
  background: #ffffff;
  color: #000000;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.register-button:hover:not(:disabled) {
  background: #f0f0f0;
  transform: translateY(-1px);
}

.register-button:disabled {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(0, 0, 0, 0.4);
  cursor: not-allowed;
}

.register-link {
  margin-top: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

.register-link-text {
  color: #ffffff;
  text-decoration: none;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }

  .register-title {
    font-size: 1.5rem;
    margin: 0 0 2rem;
  }

  .register-form {
    gap: 1rem;
    max-width: 500px;
  }

  .register-input {
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
  }

  .register-button {
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 0.75rem;
  }

  .register-title {
    font-size: 1.25rem;
    margin: 0 0 1.5rem;
  }

  .register-form {
    gap: 0.875rem;
    padding: 0 0.5rem;
  }

  .register-input {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }

  .register-button {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
