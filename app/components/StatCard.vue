<template>
  <button 
    class="group relative text-left w-full p-4 sm:p-5 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer select-none"
    :class="[
      active 
        ? 'bg-card border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20 scale-[1.02]' 
        : 'bg-card/70 hover:bg-card border-border/70 hover:border-border hover:shadow-md hover:-translate-y-0.5'
    ]"
  >
    <!-- Subtle Ambient Top Gradient for Active Card -->
    <div 
      v-if="active" 
      class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" 
    />

    <div class="flex items-center justify-between gap-2 mb-3">
      <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors truncate">
        {{ label }}
      </span>
      <div class="shrink-0 transition-transform duration-200 group-hover:scale-110">
        <slot name="icon">
          <span class="text-base opacity-75">{{ icon }}</span>
        </slot>
      </div>
    </div>

    <div class="flex items-baseline justify-between">
      <div class="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono">
        {{ value }}
      </div>
      <span 
        v-if="active"
        class="text-[9px] font-extrabold text-indigo-500 uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-500/10"
      >
        Filtre actif
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: number
  icon?: string
  color?: string
  active?: boolean
}>()
</script>
