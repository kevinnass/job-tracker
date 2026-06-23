<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-card border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b bg-muted/30">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-primary/10 rounded-lg text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold tracking-tight">Installer l'extension</h2>
                <p class="text-xs text-muted-foreground mt-0.5">Ajoutez l'extension JobTracker à votre navigateur pour capturer des offres en un clic.</p>
              </div>
            </div>
            <button @click="$emit('close')" class="p-2 hover:bg-muted rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div class="space-y-4">
            <!-- Step 1 -->
            <div class="flex gap-4">
              <div class="flex-none w-6 h-6 rounded-full bg-secondary border flex items-center justify-center text-[10px] font-bold">1</div>
              <div class="space-y-2">
                <h3 class="text-sm font-semibold leading-none">Téléchargement</h3>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Cliquez sur le bouton ci-dessous pour ouvrir la page de l'extension sur le Chrome Web Store et cliquez sur <strong>Ajouter à Chrome</strong>.
                </p>
                <div class="pt-1">
                  <a 
                    href="https://chromewebstore.google.com/detail/knbmpoomilinaimijfjlaocpimmkhpml?utm_source=item-share-cb" 
                    target="_blank" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1.5c4.14 0 7.5 3.36 7.5 7.5S16.14 18.5 12 18.5 4.5 15.14 4.5 11s3.36-7.5 7.5-7.5zm-5 7.5c0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5-5 2.24-5 5z"/>
                    </svg>
                    Installer depuis le Web Store
                  </a>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex gap-4">
              <div class="flex-none w-6 h-6 rounded-full bg-secondary border flex items-center justify-center text-[10px] font-bold">2</div>
              <div class="space-y-1">
                <h3 class="text-sm font-semibold leading-none">Scraper les offres</h3>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  Naviguez sur n'importe quel site d'emploi (LinkedIn, Indeed, Welcome to the Jungle, etc.) et ouvrez l'extension pour capturer automatiquement les détails de l'opportunité.
                </p>
              </div>
            </div>
          </div>

          <div class="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-500 mt-0.5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <p class="text-[11px] text-indigo-900 dark:text-indigo-200 leading-relaxed">
              <strong>Important :</strong> Assurez-vous d'être connecté à ce tableau de bord sur votre navigateur pour que l'extension puisse synchroniser votre session de manière automatique.
            </p>
          </div>
        </div>

        <div class="p-4 border-t bg-muted/30 flex justify-end">
          <button @click="$emit('close')" class="btn-secondary h-9 px-6 text-xs font-bold uppercase tracking-wide">
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>
