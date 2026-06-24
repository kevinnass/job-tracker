<template>
  <header class="sticky top-0 z-40 w-full border-b-2 border-primary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="h-6 w-6 rounded bg-primary flex items-center justify-center">
            <span class="text-[10px] font-bold text-primary-foreground">JT</span>
          </div>
          <span class="text-sm font-bold tracking-tight text-foreground uppercase">JobTracker</span>
        </NuxtLink>
        
        <nav v-if="user" class="hidden md:flex items-center gap-1.5 p-1 bg-muted/40 rounded-full border border-border/50">
          <NuxtLink 
            to="/" 
            class="text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all duration-200 text-muted-foreground hover:text-foreground"
            active-class="bg-background text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-500/10 font-bold"
            exact-active-class="bg-background text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-500/10 font-bold"
          >
            Tableau de bord
          </NuxtLink>
          <NuxtLink 
            to="/assistant" 
            class="text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all duration-200 text-muted-foreground hover:text-foreground"
            active-class="bg-background text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-500/10 font-bold"
          >
            Assistant IA
          </NuxtLink>
        </nav>
      </div>
      
      <div class="flex items-center gap-4">
        <button 
          v-if="user"
          @click="showExtensionModal = true"
          class="hidden sm:flex items-center gap-2 px-4 h-9 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 rounded-full transition-all duration-200 text-[10px] font-extrabold uppercase tracking-widest shadow-sm hover:shadow-[0_0_12px_rgba(99,102,241,0.15)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
          </svg>
          Ajouter l'extension
        </button>

        <ThemeToggle />
        
        <!-- User Dropdown -->
        <div v-if="user" class="relative" ref="userMenuRef">
          <button 
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 px-3 h-9 rounded-xl border border-border/60 bg-card hover:bg-muted/60 transition-all duration-200 text-xs font-semibold group"
            :class="showUserMenu ? 'border-indigo-500/30 bg-indigo-500/5' : ''"
          >
            <img v-if="user.user_metadata?.avatar_url" :src="user.user_metadata.avatar_url" alt="Avatar" class="h-5 w-5 rounded-full border border-border" />
            <div v-else class="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
              <span class="text-[8px] font-black text-white">{{ (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase() }}</span>
            </div>
            <span class="hidden sm:block text-muted-foreground group-hover:text-foreground transition-colors max-w-[120px] truncate">
              {{ user.user_metadata?.full_name || user.email }}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="w-3 h-3 text-muted-foreground transition-transform duration-200 shrink-0"
              :class="showUserMenu ? 'rotate-180' : ''"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <!-- Dropdown Panel -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 translate-y-1 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-1 scale-95"
          >
            <div 
              v-if="showUserMenu"
              class="absolute right-0 top-full mt-2 w-52 bg-card border border-border/70 rounded-xl shadow-xl shadow-black/10 overflow-hidden z-50"
            >
              <!-- User info header -->
              <div class="px-3 py-2.5 border-b border-border/50 bg-muted/30">
                <p class="text-[10px] font-bold text-foreground truncate">{{ user.user_metadata?.full_name || 'Mon compte' }}</p>
                <p class="text-[9px] text-muted-foreground truncate mt-0.5">{{ user.email }}</p>
              </div>

              <!-- Menu items -->
              <div class="p-1">
                <button 
                  @click="navigateToProfile"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-indigo-500/8 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Mon Profil
                </button>

                <div class="h-px bg-border/50 my-1"></div>

                <button 
                  @click="logout"
                  class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-red-500/8 hover:text-red-500 transition-colors text-left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Se déconnecter
                </button>
              </div>
            </div>
          </Transition>
        </div>
        
        <NuxtLink v-else-if="route.path !== '/login'" to="/login" class="text-xs font-medium underline text-muted-foreground hover:text-foreground transition-colors">
          Connexion
        </NuxtLink>
      </div>
    </div>

    <!-- Installation Modal -->
    <ExtensionInstructionModal v-if="showExtensionModal" @close="showExtensionModal = false" />
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const showExtensionModal = ref(false)
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

// Close dropdown on outside click
function handleOutsideClick(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    showUserMenu.value = false
  }
}

// Close dropdown on Escape key
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') showUserMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleKeydown)
})

function navigateToProfile() {
  showUserMenu.value = false
  router.push('/profile')
}

async function logout() {
  showUserMenu.value = false
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>
