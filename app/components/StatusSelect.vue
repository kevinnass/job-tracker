<template>
  <div class="relative inline-block" ref="selectRef">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      class="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all duration-300 cursor-pointer select-none"
      :class="[
        currentConfig.bg,
        isOpen
          ? 'ring-2 ring-offset-1 ring-offset-background shadow-lg scale-105 ' + currentConfig.ring
          : 'hover:shadow-md hover:scale-[1.02]'
      ]"
    >
      <span 
        class="h-1.5 w-1.5 rounded-full shadow-sm transition-transform duration-300"
        :class="[currentConfig.dot, isOpen ? 'scale-125' : '']"
      />
      {{ currentConfig.label }}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-3 h-3 transition-all duration-300"
        :class="isOpen ? 'rotate-180 opacity-100' : 'opacity-40'"
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

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 left-0 min-w-[160px] bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/20 p-1.5 overflow-hidden"
      >
        <button
          v-for="option in statusOptions"
          :key="option.value"
          @click="selectStatus(option.value)"
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer group/option"
          :class="[
            option.value === modelValue
              ? option.activeBg + ' shadow-sm'
              : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
          ]"
        >
          <span
            class="h-2 w-2 rounded-full transition-all duration-300 shadow-sm"
            :class="[
              option.dot,
              option.value === modelValue ? 'scale-110' : 'scale-75 opacity-50 group-hover/option:scale-100 group-hover/option:opacity-100'
            ]"
          />
          <span class="flex-1 text-left">{{ option.label }}</span>
          <!-- Checkmark for selected -->
          <svg
            v-if="option.value === modelValue"
            xmlns="http://www.w3.org/2000/svg"
            class="w-3 h-3 opacity-60"
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
const selectRef = ref<HTMLElement | null>(null)

const statusOptions = [
  {
    value: 'draft',
    label: 'Brouillon',
    bg: 'bg-muted/50 text-muted-foreground border-border',
    activeBg: 'bg-muted/60 text-foreground',
    dot: 'bg-muted-foreground',
    ring: 'ring-muted-foreground/30',
  },
  {
    value: 'applied',
    label: 'Postulé',
    bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    activeBg: 'bg-blue-500/15 text-blue-400',
    dot: 'bg-blue-500',
    ring: 'ring-blue-500/30',
  },
  {
    value: 'interview',
    label: 'Entretien',
    bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    activeBg: 'bg-amber-500/15 text-amber-400',
    dot: 'bg-amber-500',
    ring: 'ring-amber-500/30',
  },
  {
    value: 'rejected',
    label: 'Refusé',
    bg: 'bg-red-500/10 text-red-400 border-red-500/20',
    activeBg: 'bg-red-500/15 text-red-400',
    dot: 'bg-red-500',
    ring: 'ring-red-500/30',
  },
  {
    value: 'accepted',
    label: 'Accepté',
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    activeBg: 'bg-emerald-500/15 text-emerald-400',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-500/30',
  },
]

const currentConfig = computed(() => {
  return statusOptions.find((o) => o.value === props.modelValue) || statusOptions[0]
})

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
