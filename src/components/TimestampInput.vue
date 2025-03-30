<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  modelValue: number | undefined;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
}>();

const maxValue = Math.pow(10, 21) - 1;
const invalid = ref(false);

const handleInput = (value: number | null) => {
  if (!value) {
    invalid.value = false;
    emit("update:modelValue", null);
    return;
  }
  if (value > maxValue) {
    invalid.value = true;
    return;
  }
  if (value < 0) {
    invalid.value = true;
    return;
  }
  invalid.value = false;
  emit("update:modelValue", value);
};
</script>

<template>
  <input
    type="number"
    placeholder="1234567890"
    pattern="[0-9]+"
    class="border-2 border-slate-600 rounded-md p-2 font-mono text-2xl bg-white placeholder:text-slate-300"
    :class="{
      '!border-red-500': invalid,
    }"
    :value="modelValue"
    @input.number="handleInput($event.target.value)"
    :min="0"
    :max="maxValue"
    :step="1"
  />
</template>
