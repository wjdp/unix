<script lang="ts" setup>
import type { Precision } from "../timestamp";
const props = defineProps<{
  precision: Precision;
  placeholder?: boolean;
}>();

const checkPrecision = (a: Precision, b: Precision) => {
  return a === b && !props.placeholder;
};
</script>

<template>
  <span
    class="text-sm px-2 py-0.5 rounded font-semibold"
    :class="{
      'bg-green-300': checkPrecision(precision, 'seconds'),
      'bg-amber-300': checkPrecision(precision, 'milliseconds'),
      'bg-red-300': checkPrecision(precision, 'microseconds'),
      'bg-blue-300': checkPrecision(precision, 'nanoseconds'),
      'bg-slate-300 opacity-40': placeholder,
    }"
    >{{ precision }}</span
  >
</template>
