<template>
  <header class="sticky top-0 z-40 w-full border-b-2 border-primary bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="h-6 w-6 rounded bg-primary flex items-center justify-center">
          <span class="text-[10px] font-bold text-primary-foreground">JT</span>
        </div>
        <span class="text-sm font-bold tracking-tight text-foreground uppercase">JobTracker</span>
      </NuxtLink>
      
      <div class="flex items-center gap-4">
        <button 
          v-if="user"
          @click="showExtensionModal = true"
          class="hidden sm:flex items-center gap-2 px-3 h-8 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md transition-colors text-[10px] font-bold uppercase tracking-wider"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
          </svg>
          Ajouter l'extension
        </button>

        <ThemeToggle />
        
        <div v-if="user" class="flex items-center gap-4">
          <div class="flex items-center gap-2 pr-4 border-r border-border">
            <img v-if="user.user_metadata?.avatar_url" :src="user.user_metadata.avatar_url" alt="Avatar" class="h-6 w-6 rounded-full grayscale hover:grayscale-0 transition-all border border-border" />
            <span class="text-xs font-medium text-muted-foreground hidden sm:block">{{ user.user_metadata?.full_name || user.email }}</span>
          </div>
          <button @click="logout" class="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            Déconnexion
          </button>
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
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const showExtensionModal = ref(false)

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>
