<template>
  <div ref="rootRef" class="msd-wrapper">
    <button
      type="button"
      class="msd-control login-input"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="msd-text">{{ label }}</span>
    </button>

    <div v-if="isOpen" class="msd-menu" @click.stop>
      <button
        v-for="opt in options"
        :key="String(opt.id)"
        type="button"
        class="msd-item"
        @click="toggleOption(String(opt.id))"
      >
        <span class="msd-check" :class="{ checked: modelValue.includes(String(opt.id)) }">
          ✓
        </span>
        <span class="msd-item-text">{{ opt.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useClickOutside } from "../composables/useClickOutside";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Select",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const rootRef = ref(null);

function toggle() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}

function toggleOption(id) {
  const next = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  const idx = next.indexOf(id);
  if (idx >= 0) {
    next.splice(idx, 1);
  } else {
    next.push(id);
  }
  emit("update:modelValue", next);
}

const label = computed(() => {
  if (!props.modelValue?.length) return props.placeholder;

  const selectedNames = props.options
    .filter((o) => props.modelValue.includes(String(o.id)))
    .map((o) => o.name);

  return selectedNames.length ? selectedNames.join(", ") : props.placeholder;
});

useClickOutside(rootRef, close);
</script>
