<script setup lang="ts">
defineProps<{
  placeholder?: boolean;
}>();
</script>

<template>
  <dt class="font-medium sm:text-right"><slot name="title" /></dt>
  <dd
    class="mb-2 sm:mb-0 col-span-2"
    :class="{
      'opacity-20': placeholder,
    }"
  >
    <slot name="value" />
  </dd>
</template>
