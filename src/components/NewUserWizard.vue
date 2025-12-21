<template>
  <div class="login-container">
    <p class="hello-text" v-if="step === 1">для кого шукаємо взуття?</p>
    <p class="hello-text" v-else-if="step === 2">що саме шукаємо?</p>
    <p class="hello-text" v-else-if="step === 3">який розмір?</p>
    <p class="hello-text" v-else-if="step === 4">який бренд?</p>
    <p class="hello-text" v-else-if="step === 5">який колір?</p>
    <p class="hello-text" v-else>який бюджет?</p>

    <form class="login-form" @submit.prevent="onNext">
      <select
        v-if="step === 1"
        v-model="targetAudienceId"
        class="login-input"
        :disabled="isLoading"
        required
      >
        <option value="" disabled>Оберіть аудиторію</option>
        <option
          v-for="ta in targetAudiences"
          :key="ta.id"
          :value="String(ta.id)"
        >
          {{ ta.name }}
        </option>
      </select>

      <select
        v-else-if="step === 2"
        v-model="categoryId"
        class="login-input"
        :disabled="isLoading"
        required
      >
        <option value="" disabled>Оберіть категорію</option>
        <option v-for="c in categories" :key="c.id" :value="String(c.id)">
          {{ c.name }}
        </option>
      </select>

      <template v-else-if="step === 3">
        <MultiSelectDropdown
          v-model="sizeIds"
          :options="sizes"
          placeholder="Оберіть розмір"
          :disabled="isLoading"
        />
      </template>

      <template v-else-if="step === 4">
        <MultiSelectDropdown
          v-model="brandIds"
          :options="brands"
          placeholder="Оберіть бренд"
          :disabled="isLoading"
        />
      </template>

      <template v-else-if="step === 5">
        <MultiSelectDropdown
          v-model="colorIds"
          :options="colors"
          placeholder="Оберіть колір"
          :disabled="isLoading"
        />
      </template>

      <div v-else class="price-range">
        <input
          v-model="priceMin"
          class="login-input price-input"
          type="number"
          inputmode="numeric"
          placeholder="Мінімум"
          :disabled="isLoading"
          min="0"
          required
        />
        <input
          v-model="priceMax"
          class="login-input price-input"
          type="number"
          inputmode="numeric"
          placeholder="Максимум"
          :disabled="isLoading"
          min="0"
          required
        />
      </div>

      <button
        v-if="step > 1"
        type="button"
        class="google-login-button"
        @click="onBack"
      >
        Назад
      </button>

      <button
        type="submit"
        class="login-button"
        :disabled="isLoading || !canProceed"
      >
        {{ step < 6 ? "Далі" : "Готово" }}
      </button>

      <p v-if="errorMessage" class="login-link">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useShoppingStore } from "../store/shoppingStore";
import MultiSelectDropdown from "./MultiSelectDropdown.vue";

const emit = defineEmits(["complete"]);

const router = useRouter();
const shoppingStore = useShoppingStore();

const step = ref(1);
const targetAudienceId = ref("");
const categoryId = ref("");
const sizeIds = ref([]);
const brandIds = ref([]);
const colorIds = ref([]);
const priceMin = ref("");
const priceMax = ref("");

const targetAudiences = computed(() => shoppingStore.targetAudiences);
const brands = computed(() => shoppingStore.brands);
const categories = computed(() => shoppingStore.categories);
const sizes = computed(() => shoppingStore.sizes);
const colors = computed(() => shoppingStore.colors);

const isLoading = computed(() => {
  return (
    shoppingStore.loading.targetAudiences ||
    shoppingStore.loading.brands ||
    shoppingStore.loading.categories ||
    shoppingStore.loading.sizes ||
    shoppingStore.loading.colors ||
    shoppingStore.loading.searches
  );
});

const errorMessage = computed(() => {
  return (
    shoppingStore.error.targetAudiences ||
    shoppingStore.error.brands ||
    shoppingStore.error.categories ||
    shoppingStore.error.sizes ||
    shoppingStore.error.colors ||
    shoppingStore.error.searches ||
    null
  );
});

const canProceed = computed(() => {
  if (step.value === 1) return !!targetAudienceId.value;
  if (step.value === 2) return !!categoryId.value;
  if (step.value === 3)
    return Array.isArray(sizeIds.value) && sizeIds.value.length > 0;
  if (step.value === 4)
    return Array.isArray(brandIds.value) && brandIds.value.length > 0;
  if (step.value === 5)
    return Array.isArray(colorIds.value) && colorIds.value.length > 0;

  if (priceMin.value === "" || priceMax.value === "") return false;
  const min = Number(priceMin.value);
  const max = Number(priceMax.value);
  return (
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    min >= 0 &&
    max >= 0 &&
    min <= max
  );
});

onMounted(async () => {
  if (!shoppingStore.targetAudiences.length) {
    await shoppingStore.fetchTargetAudiences();
  }
  if (!shoppingStore.brands.length) {
    await shoppingStore.fetchBrands();
  }
  if (!shoppingStore.categories.length) {
    await shoppingStore.fetchCategories();
  }
  if (!shoppingStore.sizes.length) {
    await shoppingStore.fetchSizes();
  }
  if (!shoppingStore.colors.length) {
    await shoppingStore.fetchColors();
  }
});

const onBack = () => {
  if (step.value > 1) {
    step.value -= 1;
  }
};

const onNext = async () => {
  if (step.value < 6) {
    step.value += 1;
    return;
  }

  try {
    const response = await shoppingStore.createSearch({
      target_audience_ids: [Number(targetAudienceId.value)],
      category_ids: [Number(categoryId.value)],
      size_ids: sizeIds.value.map((id) => Number(id)),
      brand_ids: brandIds.value.map((id) => Number(id)),
      color_ids: colorIds.value.map((id) => Number(id)),
      price_min: Number(priceMin.value),
      price_max: Number(priceMax.value),
    });

    console.log("Search response:", response);

    // Check if search_id exists in response and redirect
    if (response?.search_id || shoppingStore.searchId) {
      console.log("Redirecting to shoes catalog...");
      router.push("/shoes");
    } else {
      console.log("No search_id found in response");
    }
  } catch (error) {
    console.error("Failed to create search:", error);
  }
};
</script>

<style scoped>
.price-range {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.price-input {
  padding-right: 1.65rem;
}

.price-input::-webkit-outer-spin-button,
.price-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.price-input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

@media (max-width: 520px) {
  .price-range {
    grid-template-columns: 1fr;
  }
}
</style>
