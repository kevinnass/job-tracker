<template>
  <header class="h-16 px-4 md:px-8 flex items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-30 shrink-0">
    <div class="flex items-center gap-3">
      <!-- Mobile Menu Toggle Button -->
      <button 
        @click="isMobileOpen = !isMobileOpen"
        class="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <!-- Page Title / Breadcrumb -->
      <div>
        <h1 class="text-sm font-bold text-foreground tracking-tight">{{ pageTitle }}</h1>
      </div>
    </div>

    <!-- Right Topbar Items (Quick links on desktop) -->
    <div class="flex items-center gap-3">
      <NuxtLink 
        v-if="user"
        to="/profile" 
        class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/60 hover:bg-muted/60 transition-colors text-xs font-semibold"
      >
        <img v-if="user.user_metadata?.avatar_url" :src="user.user_metadata.avatar_url" alt="Avatar" class="h-5 w-5 rounded-full border border-border" />
        <div v-else class="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
          <span class="text-[8px] font-black text-white">{{ (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase() }}</span>
        </div>
        <span class="hidden sm:inline-block max-w-[100px] truncate text-muted-foreground">{{ user.user_metadata?.full_name || 'Profil' }}</span>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const user = useSupabaseUser()
const isMobileOpen = useState('sidebar-mobile-open', () => false)

const pageTitle = computed(() => {
  if (route.path === '/') return 'Tableau de bord'
  if (route.path === '/assistant') return 'Assistant IA'
  if (route.path === '/profile') return 'Mon Profil'
  return 'JobTracker'
})
</script>
