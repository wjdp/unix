<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Button from "./components/Button.vue";
import CopyMe from "./components/CopyMe.vue";
import Precision from "./components/Precision.vue";
import RelativeTime from "./components/RelativeTime.vue";
import TimeDisplay from "./components/TimeDisplay.vue";
import TimeDisplayElement from "./components/TimeDisplayElement.vue";
import TimestampInput from "./components/TimestampInput.vue";
import { convertTimestampToDate, getTimestampPrecision } from "./timestamp";

const timestamp = ref<number>();
const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const localOffset = (new Date().getTimezoneOffset() * -1) / 60;

const LOCAL_STORE_KEY = "timestamp";

const loadStoredTimestamp = () => {
  const storedTimestamp = sessionStorage.getItem(LOCAL_STORE_KEY);
  if (storedTimestamp) {
    timestamp.value = parseInt(storedTimestamp);
  }
};

loadStoredTimestamp();

watch(timestamp, (newValue) => {
  if (newValue) {
    sessionStorage.setItem(LOCAL_STORE_KEY, newValue.toString());
  } else {
    sessionStorage.removeItem(LOCAL_STORE_KEY);
  }
});

const localOffsetFormatted = computed(() => {
  const offset = localOffset;
  if (offset > 0) {
    return `+${offset}`;
  }
  return offset;
});

const precision = computed(() => {
  if (!timestamp.value) return null;
  return getTimestampPrecision(timestamp.value);
});

const placeholder = computed(() => {
  return !timestamp.value;
});

const date = computed(() => {
  if (!timestamp.value || !precision.value) return new Date();
  return convertTimestampToDate(timestamp.value, precision.value);
});

const dateFormatted = computed(() => {
  if (!date.value) return null;
  return date.value.toLocaleString("en-GB", {
    timeZone: localTimezone,
    dateStyle: "full",
  });
});

const timeFormatted = computed(() => {
  if (!date.value) return null;
  return date.value.toLocaleString("en-GB", {
    timeZone: localTimezone,
    timeStyle: "short",
  });
});

const dateTimeAsIsoString = computed(() => {
  if (!date.value) return null;
  return date.value.toISOString();
});

const dateAsIsoString = computed(() => {
  if (!date.value) return null;
  return date.value.toISOString().split("T")[0];
});

const delta = computed(() => {
  if (!date.value) return null;
  const now = new Date();
  return Math.round(date.value.getTime() - now.getTime());
});

const deltaSeconds = computed(() => {
  if (delta.value === null) return null;
  return Math.round(delta.value / 1000);
});

const setTimestampNow = () => {
  const now = new Date();
  timestamp.value = Math.floor(now.getTime() / 1000);
};
</script>

<template>
  <main
    class="flex flex-col items-center min-h-screen bg-slate-600 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900"
  >
    <div class="grow flex flex-col justify-center">
      <div
        class="flex flex-col items-center justify-center bg-slate-200 px-4 py-4 border-3 border-slate-500 rounded-2xl gap-4 w-sm sm:w-lg"
      >
        <div class="flex flex-row gap-2 w-full">
          <TimestampInput v-model="timestamp" class="grow" />
          <Button @click="setTimestampNow">Now</Button>
          <Button @click="timestamp = undefined">Clear</Button>
        </div>
        <div class="w-full">
          <TimeDisplay>
            <TimeDisplayElement>
              <template #title>Precision</template>
              <template #value>
                <Precision v-if="precision" :precision="precision" />
                <Precision v-else precision="seconds" placeholder />
              </template>
            </TimeDisplayElement>
            <TimeDisplayElement :placeholder="placeholder">
              <template #title>Local</template>
              <template #value>
                {{ dateFormatted }} {{ timeFormatted }}
              </template>
            </TimeDisplayElement>
            <TimeDisplayElement :placeholder="placeholder">
              <template #title>Your Timezone</template>
              <template #value>
                {{ localTimezone }} ({{ localOffsetFormatted }} h)
              </template>
            </TimeDisplayElement>
            <TimeDisplayElement :placeholder="placeholder">
              <template #title>Date & Time (UTC)</template>
              <template #value>
                <CopyMe class="font-mono">{{ dateTimeAsIsoString }}</CopyMe>
              </template>
            </TimeDisplayElement>
            <TimeDisplayElement :placeholder="placeholder">
              <template #title>Date (UTC)</template>
              <template #value>
                <CopyMe class="font-mono">{{ dateAsIsoString }}</CopyMe>
              </template>
            </TimeDisplayElement>
            <TimeDisplayElement :placeholder="placeholder">
              <template #title>Relative</template>
              <template #value>
                <RelativeTime
                  v-if="deltaSeconds !== null"
                  :deltaSeconds="deltaSeconds"
                />
              </template>
            </TimeDisplayElement>
          </TimeDisplay>
        </div>
      </div>
    </div>
    <footer class="mb-2 text-slate-100 text-sm opacity-20">
      A lightweight utility by
      <a href="https://wjdp.uk" class="underline">wjdp.uk</a>
    </footer>
  </main>
</template>
