<template>
  <div>
    <!-- Mobile Backdrop -->
    <Transition
      enter-active-class="transition-opacity ease-linear duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isMobileOpen" 
        @click="isMobileOpen = false"
        class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
      />
    </Transition>

    <!-- Sidebar Container -->
    <aside 
      class="fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-card border-r border-border/80 transition-all duration-300 ease-in-out"
      :class="[
        // Mobile positioning: slide-over, Desktop: fixed width
        isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0',
        'w-64'
      ]"
    >
      <!-- Sidebar Header (Brand) -->
      <div class="h-16 px-4 flex items-center justify-between border-b border-border/60 shrink-0">
        <NuxtLink to="/" class="flex items-center gap-3 overflow-hidden group">
          <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <span class="text-xs font-black text-white tracking-widest">JT</span>
          </div>
          <span class="text-sm font-extrabold tracking-tight text-foreground uppercase truncate">
            JobTracker
          </span>
        </NuxtLink>

        <!-- Mobile Close Button -->
        <button 
          @click="isMobileOpen = false"
          class="flex md:hidden h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-muted-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group relative"
          active-class="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm"
          exact-active-class="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm"
        >
          <component 
            :is="item.icon" 
            class="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" 
          />
          <span class="truncate">
            {{ item.label }}
          </span>
        </NuxtLink>
      </nav>

      <!-- Actions & Extension Button -->
      <div class="px-3 py-3 border-t border-border/60 space-y-2 shrink-0">
        <!-- Extension Button -->
        <button 
          v-if="user"
          @click="showExtensionModal = true"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-xl transition-all duration-200 text-xs font-bold group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
          </svg>
          <span class="truncate">Extension</span>
        </button>

        <!-- Theme Toggle & Quick Actions bar -->
        <div class="flex items-center justify-between p-1.5 rounded-xl bg-muted/40 border border-border/40">
          <ThemeToggle />
          <NuxtLink 
            to="/profile" 
            class="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Mon Profil"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </NuxtLink>
        </div>
      </div>

      <!-- User Profile Footer -->
      <div v-if="user" class="p-3 border-t border-border/60 bg-muted/20 shrink-0">
        <div class="flex items-center gap-3">
          <img 
            v-if="user.user_metadata?.avatar_url" 
            :src="user.user_metadata.avatar_url" 
            alt="Avatar" 
            class="h-8 w-8 rounded-full border border-border/80 shrink-0" 
          />
          <div v-else class="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
            <span class="text-xs font-black text-white">{{ (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase() }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-foreground truncate">{{ user.user_metadata?.full_name || 'Utilisateur' }}</p>
            <p class="text-[10px] text-muted-foreground truncate">{{ user.email }}</p>
          </div>

          <button 
            @click="logout"
            class="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
            title="Se déconnecter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Extension Modal -->
    <ExtensionInstructionModal v-if="showExtensionModal" @close="showExtensionModal = false" />
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

const route = useRoute()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const isMobileOpen = useState('sidebar-mobile-open', () => false)
const showExtensionModal = ref(false)

// Close mobile sidebar on route change
watch(() => route.path, () => {
  isMobileOpen.value = false
})

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}

// Icon definitions
const IconDashboard = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('rect', { x: '3', y: '3', width: '7', height: '9', rx: '1' }),
  h('rect', { x: '14', y: '3', width: '7', height: '5', rx: '1' }),
  h('rect', { x: '14', y: '12', width: '7', height: '9', rx: '1' }),
  h('rect', { x: '3', y: '16', width: '7', height: '5', rx: '1' })
])

const IconAssistant = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', { d: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' }),
  h('path', { d: 'm5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z' }),
  h('path', { d: 'm19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z' })
])

const IconProfile = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
  h('circle', { cx: '12', cy: '7', r: '4' })
])

const navItems = [
  { label: 'Tableau de bord', to: '/', icon: IconDashboard },
  { label: 'Assistant IA', to: '/assistant', icon: IconAssistant },
  { label: 'Mon Profil', to: '/profile', icon: IconProfile }
]
</script>
