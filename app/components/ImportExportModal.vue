<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-md max-h-[90vh] flex flex-col bg-card border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <!-- Header -->
        <div class="p-6 border-b bg-muted/30">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold tracking-tight">Exporter les données</h2>
                <p class="text-xs text-muted-foreground mt-0.5">Sauvegardez vos candidatures locales au format CSV ou PDF.</p>
              </div>
            </div>
            <button @click="$emit('close')" class="p-2 hover:bg-muted rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <p class="text-xs text-muted-foreground leading-relaxed">
            Téléchargez l'intégralité de vos candidatures sauvegardées. Pratique pour faire vos propres analyses ou relire vos dossiers hors-ligne.
          </p>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- CSV Export -->
            <button @click="handleExportCSV" class="btn-secondary h-16 flex flex-col items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <span>Format CSV</span>
            </button>
            
            <!-- PDF Export -->
            <button @click="handleExportPDF" class="btn-primary h-16 flex flex-col items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 18H4a2 2 0 0 1-2-2v-2m14 4h2a2 2 0 0 0 2-2v-2M6 4H4a2 2 0 0 0-2 2v2m14-4h2a2 2 0 0 1 2 2v2"/>
                <rect width="16" height="10" x="4" y="7" rx="2"/>
                <line x1="12" y1="17" x2="12" y2="17"/>
              </svg>
              <span>Format PDF</span>
            </button>
          </div>

          <!-- Error Alert -->
          <div v-if="errorMessage" class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs flex gap-3 items-start animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{{ errorMessage }}</p>
          </div>
        </div>

        <div class="p-4 border-t bg-muted/30 flex justify-end">
          <button @click="$emit('close')" class="btn-secondary h-9 px-6 text-xs font-bold uppercase tracking-wide">
            Fermer
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { generateCSV } from '~/utils/csv'
import { exportToPDF } from '~/utils/pdf'

defineEmits(['close'])

const store = useApplicationsStore()
const errorMessage = ref<string | null>(null)

function handleExportCSV() {
  try {
    errorMessage.value = null
    generateCSV(store.applications)
  } catch (err: any) {
    errorMessage.value = `Erreur lors de l'export CSV : ${err.message}`
  }
}

function handleExportPDF() {
  try {
    errorMessage.value = null
    exportToPDF(store.applications)
  } catch (err: any) {
    errorMessage.value = `Erreur lors de l'export PDF : ${err.message}`
  }
}
</script>
