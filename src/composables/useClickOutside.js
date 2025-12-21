import { onMounted, onUnmounted } from "vue";

export function useClickOutside(targetRef, handler) {
  function onDocumentClick(e) {
    const el = targetRef?.value;
    if (!el) return;

    const target = e.target;
    if (el === target || el.contains(target)) return;

    handler(e);
  }

  onMounted(() => {
    document.addEventListener("click", onDocumentClick);
  });

  onUnmounted(() => {
    document.removeEventListener("click", onDocumentClick);
  });
}
