<script lang="ts" setup>
import { computed } from "vue";
import {
  AkCircleChevronLeftFill,
  AkCircleChevronRightFill,
  AkCircleFill,
} from "@kalimahapps/vue-icons";

const props = defineProps<{
  deltaSeconds: number;
}>();

const RELATIVE_TIME_FORMAT = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const RELATIVE_TIME_OPTIONS = [
  { value: 60, unit: "seconds", divisor: 1 },
  { value: 3600, unit: "minutes", divisor: 60 },
  { value: 86400, unit: "hours", divisor: 3600 },
  { value: 604800, unit: "days", divisor: 86400 },
  { value: 2419200, unit: "weeks", divisor: 604800 },
  { value: 29030400, unit: "months", divisor: 2419200 },
];

const getRelativeTimeUnit = (deltaSeconds: number) => {
  const deltaSecondsAbs = Math.abs(deltaSeconds);
  for (const { value, unit, divisor } of RELATIVE_TIME_OPTIONS) {
    if (deltaSecondsAbs < value) {
      console.log(
        `deltaSecondsAbs: ${deltaSecondsAbs}, value: ${value}, unit: ${unit}, divisor: ${divisor}`,
      );
      return { divisor, unit };
    }
  }
  return { unit: "years", divisor: 29030400 };
};

const relativeTime = computed(() => {
  if (props.deltaSeconds === null) return null;
  const { divisor, unit } = getRelativeTimeUnit(props.deltaSeconds);
  return RELATIVE_TIME_FORMAT.format(props.deltaSeconds / divisor, unit);
});

const NOW_LEEWAY = 5;

const pastPresentFuture = computed(() => {
  if (props.deltaSeconds === null) return null;
  if (props.deltaSeconds < -NOW_LEEWAY) {
    return "past";
  } else if (props.deltaSeconds > NOW_LEEWAY) {
    return "future";
  }
  return "present";
});
</script>

<template>
  <AkCircleChevronLeftFill
    v-if="pastPresentFuture === 'past'"
    class="inline-block text-red-400 align-sub"
  />
  <AkCircleChevronRightFill
    v-if="pastPresentFuture === 'future'"
    class="inline-block text-blue-500 align-sub"
  />
  <AkCircleFill
    v-if="pastPresentFuture === 'present'"
    class="inline-block align-sub opacity-50 text-green-500"
  />
  <span class="ml-1.5">{{ relativeTime }}</span>
</template>
