<template>
  <div class="relative inline-block" ref="selectRef">
    <!-- Trigger Button -->
    <button
      @click="toggleOpen"
      type="button"
      class="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider border shadow-sm transition-all duration-200 cursor-pointer select-none"
      :class="[
        currentConfig.bg,
        isOpen
          ? 'ring-2 ring-offset-1 ring-offset-background shadow-md scale-[1.02] ' + currentConfig.ring
          : 'hover:shadow hover:scale-[1.02]'
      ]"
    >
      <span 
        class="h-2 w-2 rounded-full shadow-sm transition-transform duration-200 shrink-0"
        :class="[currentConfig.dot, isOpen ? 'scale-125' : '']"
      />
      <span>{{ currentConfig.label }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-3 h-3 transition-transform duration-200 shrink-0"
        :class="isOpen ? 'rotate-180 opacity-100' : 'opacity-60'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <!-- Dropdown (100% opaque solid background, perfectly legible in dark and light mode) -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 left-0 min-w-[160px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl shadow-black/30 dark:shadow-black/70 p-1.5 ring-1 ring-black/5 dark:ring-white/10"
        :class="openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'"
      >
        <button
          v-for="option in statusOptions"
          :key="option.value"
          @click="selectStatus(option.value)"
          type="button"
          class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer select-none group/option"
          :class="[
            option.value === modelValue
              ? option.activeBg + ' shadow-sm font-extrabold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
          ]"
        >
          <div class="flex items-center gap-2.5">
            <span
              class="h-2 w-2 rounded-full transition-transform duration-200 shadow-sm shrink-0"
              :class="[
                option.dot,
                option.value === modelValue ? 'scale-110' : 'scale-90 opacity-70 group-hover/option:scale-100 group-hover/option:opacity-100'
              ]"
            />
            <span class="text-left">{{ option.label }}</span>
          </div>

          <!-- Checkmark for selected -->
          <svg
            v-if="option.value === modelValue"
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5 shrink-0 opacity-80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [val: string]
  'change': [val: string]
}>()

const isOpen = ref(false)
const openUpward = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const statusOptions = [
  {
    value: 'draft',
    label: 'Brouillon',
    bg: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    activeBg: 'bg-zinc-100 text-zinc-900 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700',
    dot: 'bg-zinc-400',
    ring: 'ring-zinc-400/40',
  },
  {
    value: 'applied',
    label: 'Postulé',
    bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
    activeBg: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/60 dark:text-blue-200 dark:border-blue-700',
    dot: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]',
    ring: 'ring-blue-500/40',
  },
  {
    value: 'interview',
    label: 'Entretien',
    bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
    activeBg: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700',
    dot: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]',
    ring: 'ring-amber-500/40',
  },
  {
    value: 'rejected',
    label: 'Refusé',
    bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800',
    activeBg: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/60 dark:text-rose-200 dark:border-rose-700',
    dot: 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]',
    ring: 'ring-rose-500/40',
  },
  {
    value: 'accepted',
    label: 'Accepté',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
    activeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-700',
    dot: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]',
    ring: 'ring-emerald-500/40',
  },
]

const currentConfig = computed(() => {
  return statusOptions.find((o) => o.value === props.modelValue) || statusOptions[0]
})

function toggleOpen() {
  if (!isOpen.value) {
    if (selectRef.value) {
      const rect = selectRef.value.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      openUpward.value = spaceBelow < 220 && rect.top > 220
    }
    isOpen.value = true
  } else {
    isOpen.value = false
  }
}

function selectStatus(value: string) {
  isOpen.value = false
  if (value !== props.modelValue) {
    emit('update:modelValue', value)
    emit('change', value)
  }
}

// Close on outside click
function handleClickOutside(e: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
