<template>
  <div class="min-h-screen bg-background text-foreground font-sans relative flex flex-col justify-between overflow-hidden selection:bg-indigo-500/20 selection:text-indigo-500">
    <!-- Ambient Gradient Glow Effects -->
    <div class="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent blur-[120px] rounded-full" />
    <div class="pointer-events-none absolute -bottom-40 -right-20 w-[500px] h-[400px] bg-gradient-to-tl from-indigo-500/10 via-pink-500/5 to-transparent blur-[140px] rounded-full" />

    <!-- Top Navigation -->
    <header class="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]">
        <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
          <span class="text-xs font-black text-white tracking-widest">JT</span>
        </div>
        <span class="text-base font-black tracking-tight text-foreground uppercase">
          JobTracker
        </span>
      </NuxtLink>

      <div class="flex items-center gap-4">
        <ThemeToggle />
        <NuxtLink 
          to="/" 
          class="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Accueil
        </NuxtLink>
      </div>
    </header>

    <!-- Main Auth Card Container -->
    <main class="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md animate-fade-in">
        <div class="p-8 sm:p-10 rounded-3xl bg-card/90 backdrop-blur-xl border border-border/80 shadow-2xl shadow-black/10 dark:shadow-indigo-950/20 space-y-8">
          
          <!-- Card Header -->
          <div class="text-center space-y-3">
            <div class="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <span class="text-sm font-black text-white tracking-wider">JT</span>
            </div>
            <div class="space-y-1">
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Bon retour parmi nous
              </h1>
              <p class="text-xs sm:text-sm text-muted-foreground">
                Connectez-vous pour piloter vos candidatures et réussir vos recrutements.
              </p>
            </div>
          </div>

          <!-- Error Feedback -->
          <div v-if="errorMessage" class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Actions -->
          <div class="space-y-4">
            <button 
              @click="signInWithGoogle" 
              :disabled="loading"
              class="w-full h-12 px-5 rounded-2xl bg-foreground text-background font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-95 hover:shadow-lg disabled:opacity-50 cursor-pointer group"
            >
              <div v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              <template v-else>
                <!-- Google SVG Logo -->
                <svg class="h-4 w-4 transition-transform group-hover:scale-110 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continuer avec Google</span>
              </template>
            </button>

            <!-- Reassurance bullets -->
            <div class="pt-4 border-t border-border/50 space-y-2 text-[11px] text-muted-foreground font-medium">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Connexion sécurisée en 1 clic sans mot de passe</span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-indigo-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Synchronisation instantanée avec l'extension Chrome</span>
              </div>
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-purple-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Données strictement privées et exportables à tout moment</span>
              </div>
            </div>
          </div>

          <!-- Legal / Terms Notice -->
          <div class="text-center pt-2">
            <p class="text-[11px] text-muted-foreground/80 leading-relaxed">
              En continuant, vous acceptez notre 
              <NuxtLink to="/privacy" class="underline underline-offset-4 hover:text-foreground text-foreground/80 transition-colors">
                Politique de Confidentialité
              </NuxtLink>.
            </p>
          </div>

        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 w-full py-6 text-center text-xs text-muted-foreground/60 border-t border-border/40">
      <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {{ new Date().getFullYear() }} JobTracker. Tous droits réservés.</p>
        <NuxtLink to="/privacy" class="hover:text-foreground transition-colors">
          Confidentialité & Mentions Légales
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const loading = ref(false)
const errorMessage = ref('')

async function signInWithGoogle() {
  loading.value = true
  errorMessage.value = ''
  try {
    const redirectTo = `${window.location.origin}/confirm`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })
    if (error) throw error
  } catch (e: any) {
    console.error('Login error:', e.message)
    errorMessage.value = e.message || 'Une erreur est survenue lors de la tentative de connexion.'
    loading.value = false
  }
}
</script>
