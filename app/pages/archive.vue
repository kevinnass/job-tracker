<template>
  <div class="space-y-10 animate-fade-in">
    <!-- Header Section -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">Archives</h1>
          <p class="text-xs text-muted-foreground mt-1">Consultez l'historique de vos candidatures terminées (acceptées ou refusées).</p>
        </div>
      </div>
    </div>
 
    <!-- Main Content Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div 
          class="relative flex-1 max-w-md bg-zinc-100/80 dark:bg-zinc-900/60 border border-border/85 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all duration-300 rounded-xl shadow-sm flex items-center"
        >
          <svg class="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une candidature archivée..."
            @focus="isFocused = true"
            @blur="isFocused = false"
            class="w-full pl-9 pr-24 bg-transparent h-9 text-xs focus:outline-none placeholder-muted-foreground/60 font-medium"
          />
          
          <!-- Results Count Badge -->
          <span 
            v-if="searchQuery"
            class="absolute right-9 text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold px-2 py-0.5 rounded-full shrink-0 animate-fade-in"
          >
            {{ filteredApplications.length }} {{ filteredApplications.length > 1 ? 'résultats' : 'résultat' }}
          </span>

          <!-- Clear Search Button -->
          <button 
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-0.5"
            title="Effacer la recherche"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Keyboard Shortcut indicator -->
          <kbd 
            v-else-if="!isFocused"
            class="absolute right-3 hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/70 bg-background px-1.5 font-mono text-[9px] font-bold text-muted-foreground/75"
          >
            /
          </kbd>
        </div>
        
        <button 
          @click="store.fetchApplications()" 
          class="flex items-center gap-2 h-9 px-3 hover:bg-muted border border-dashed rounded-lg transition-colors text-muted-foreground text-[10px] font-bold uppercase tracking-wider"
          :class="{ 'opacity-50 cursor-not-allowed': store.loading }"
          :disabled="store.loading"
          title="Rafraîchir les données"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" :class="{ 'animate-spin': store.loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
          Actualiser
        </button>
      </div>
 
      <!-- Loading -->
      <div v-if="store.loading && !store.applications.length" class="flex items-center justify-center py-20 border border-dashed rounded-xl">
        <div class="flex flex-col items-center gap-3">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span class="text-xs text-muted-foreground font-medium uppercase tracking-wider">Synchronisation...</span>
        </div>
      </div>
 
      <!-- Empty state -->
      <div v-else-if="!filteredApplications.length && !searchQuery" class="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl space-y-3 text-center">
        <div class="text-3xl grayscale opacity-50">📦</div>
        <div>
          <h2 class="text-sm font-semibold">Aucune candidature archivée</h2>
          <p class="text-xs text-muted-foreground mt-1">Les candidatures acceptées ou refusées apparaîtront ici.</p>
        </div>
      </div>

      <!-- Applications Table -->
      <div v-else class="card border-none bg-transparent shadow-none">
        <ApplicationTable
          :applications="filteredApplications"
          @view="handleView"
          @edit="handleEdit"
          @delete="confirmDelete"
          @change-status="handleStatusChange"
        />
      </div>
    </div>

    <!-- Modals -->
    <EditApplicationModal
      v-if="editingApplication"
      :application="editingApplication"
      @close="editingApplication = null"
      @saved="onApplicationUpdated"
    />

    <ApplicationDetailModal
      v-if="viewingApplication"
      :application="viewingApplication"
      @close="viewingApplication = null"
      @edit="handleEditFromDetail"
    />

    <DeleteModal
      v-if="applicationToDelete"
      :company-name="applicationToDelete.company_name"
      @cancel="applicationToDelete = null"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { JobApplication } from '~/stores/applications'

const store = useApplicationsStore()
const searchQuery = ref('')
const editingApplication = ref<JobApplication | null>(null)
const viewingApplication = ref<JobApplication | null>(null)
const applicationToDelete = ref<JobApplication | null>(null)

const searchInputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

const filteredApplications = computed(() => {
  // Only display accepted and rejected applications in Archives page
  let list = store.sortedApplications.filter(
    app => app.status === 'accepted' || app.status === 'rejected'
  )

  // Filter by search query
  const query = searchQuery.value.toLowerCase()
  if (query) {
    list = list.filter(app => {
      const company = (app.company_name || '').toLowerCase()
      const profile = (app.job_profile || '').toLowerCase()
      const skills = (app.primary_skills || '').toLowerCase()
      const status = (app.status || '').toLowerCase()

      return company.includes(query) ||
             profile.includes(query) ||
             skills.includes(query) ||
             status.includes(query)
    })
  }

  return list
})

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === '/' && document.activeElement !== searchInputRef.value) {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

onMounted(() => {
  store.fetchApplications()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const user = useSupabaseUser()

function handleView(app: JobApplication) {
  viewingApplication.value = app
}

function handleEdit(app: JobApplication) {
  if (!user.value) return navigateTo('/login')
  editingApplication.value = { ...app }
}

function handleEditFromDetail() {
  if (!viewingApplication.value) return
  const app = { ...viewingApplication.value }
  viewingApplication.value = null
  handleEdit(app)
}
 
function confirmDelete(app: JobApplication) {
  if (!user.value) return navigateTo('/login')
  applicationToDelete.value = app
}

async function handleDelete() {
  if (!applicationToDelete.value) return
  const id = applicationToDelete.value.id
  applicationToDelete.value = null
  await store.deleteApplication(id)
}
 
async function handleStatusChange(id: string, status: string) {
  if (!user.value) return navigateTo('/login')
  try {
    await store.updateApplication(id, { status: status as any })
  } catch (e) {
    console.error('Failed to update status inline:', e)
  }
}

function onApplicationUpdated() {
  editingApplication.value = null
}
</script>
