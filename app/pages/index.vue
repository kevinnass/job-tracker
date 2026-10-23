<template>
  <div>
    <!-- Session Checking Loader (prevent brief landing flash if user is already authenticated) -->
    <div v-if="authChecking" class="min-h-screen bg-background flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
          <span class="text-xs font-black text-white tracking-widest">JT</span>
        </div>
        <div class="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    </div>

    <!-- Authenticated: Full Dashboard inside default app layout (AppSidebar + AppTopbar) -->
    <NuxtLayout name="default" v-else-if="user">
      <div class="space-y-8 animate-fade-in">
        <!-- Header/Stats Section -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Tableau de bord</h1>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <span class="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                {{ store.stats.total }} candidature{{ store.stats.total > 1 ? 's' : '' }}
              </span>
            </div>
            <p class="text-xs sm:text-sm text-muted-foreground mt-1">
              Pilotez vos démarches, organisez vos entretiens et suivez vos réponses en temps réel.
            </p>
          </div>
          
          <div class="flex items-center gap-2.5 shrink-0">
            <button 
              @click="showImportExportModal = true" 
              class="flex items-center gap-2 px-3.5 h-10 rounded-xl border border-border/80 bg-card hover:bg-muted/70 text-foreground text-xs font-bold shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-95"
              title="Importer ou exporter des candidatures au format CSV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Exporter</span>
            </button>
            <button 
              @click="handleAdd" 
              class="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-black shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M12 5v14" /><path d="M5 12h14" />
              </svg>
              <span>Nouvelle candidature</span>
            </button>
          </div>
        </div>

        <!-- Stats KPIs Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard 
            label="Total" 
            :value="store.stats.total"
            :active="!activeFilter"
            @click="toggleFilter(null)"
          >
            <template #icon>
              <div class="p-2 rounded-xl bg-slate-500/10 text-slate-500 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </div>
            </template>
          </StatCard>
          <StatCard 
            label="Postulé" 
            :value="store.stats.applied"
            :active="activeFilter === 'applied'"
            @click="toggleFilter('applied')"
          >
            <template #icon>
              <div class="p-2 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </div>
            </template>
          </StatCard>
          <StatCard 
            label="Entretiens" 
            :value="store.stats.interviews"
            :active="activeFilter === 'interview'"
            @click="toggleFilter('interview')"
          >
            <template #icon>
              <div class="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
            </template>
          </StatCard>
          <StatCard 
            label="Accepté" 
            :value="store.stats.accepted"
            :active="activeFilter === 'accepted'"
            @click="toggleFilter('accepted')"
          >
            <template #icon>
              <div class="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
            </template>
          </StatCard>
          <StatCard 
            label="Refusé" 
            :value="store.stats.rejected"
            :active="activeFilter === 'rejected'"
            @click="toggleFilter('rejected')"
          >
            <template #icon>
              <div class="p-2 rounded-xl bg-red-500/10 text-red-500 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
              </div>
            </template>
          </StatCard>
        </div>

        <!-- Active Filter Indicator Banner -->
        <div 
          v-if="activeFilter" 
          class="flex items-center justify-between px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs shadow-sm animate-fade-in"
        >
          <div class="flex items-center gap-2.5">
            <span class="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span class="font-bold text-foreground">
              Filtre actif : 
              <span class="text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wide ml-1">
                {{ getFilterLabel(activeFilter) }}
              </span>
            </span>
            <span class="text-muted-foreground font-mono text-[11px]">
              ({{ filteredApplications.length }} {{ filteredApplications.length > 1 ? 'résultats' : 'résultat' }})
            </span>
          </div>
          <button 
            @click="activeFilter = null"
            class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background/80 hover:bg-background border border-border/60 text-muted-foreground hover:text-foreground text-[11px] font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>Afficher tout</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
    
        <!-- Main Content Section -->
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <!-- Search bar -->
            <div 
              class="relative flex-1 max-w-md bg-card border border-border/80 focus-within:border-indigo-500/60 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300 rounded-xl shadow-sm flex items-center"
            >
              <svg class="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher par entreprise, poste, compétence..."
                @focus="isFocused = true"
                @blur="isFocused = false"
                class="w-full pl-10 pr-24 bg-transparent h-10 text-xs focus:outline-none placeholder-muted-foreground/60 font-medium"
              />
              
              <!-- Results Count Badge -->
              <span 
                v-if="searchQuery"
                class="absolute right-9 text-[9px] bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-black px-2 py-0.5 rounded-full shrink-0"
              >
                {{ filteredApplications.length }} {{ filteredApplications.length > 1 ? 'résultats' : 'résultat' }}
              </span>

              <!-- Clear Search Button -->
              <button 
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-1"
                title="Effacer la recherche"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <!-- Keyboard Shortcut indicator -->
              <kbd 
                v-else-if="!isFocused"
                class="absolute right-3 hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/70 bg-muted/60 px-1.5 font-mono text-[9px] font-bold text-muted-foreground/75"
              >
                /
              </kbd>
            </div>
            
            <div class="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
              <!-- Hide Closed Toggle -->
              <div 
                @click="hideClosed = !hideClosed"
                class="flex items-center gap-2 px-3 h-10 bg-card hover:bg-muted/40 border border-border/80 rounded-xl shadow-sm cursor-pointer select-none transition-colors"
                title="Masquer les candidatures acceptées et refusées pour se concentrer sur les démarches en cours"
              >
                <div 
                  class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                  :class="hideClosed ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'"
                >
                  <span 
                    class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="hideClosed ? 'translate-x-4' : 'translate-x-0'"
                  />
                </div>
                <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Masquer refusées
                </span>
              </div>

              <!-- Actualiser -->
              <button 
                @click="store.fetchApplications()" 
                class="flex items-center gap-1.5 h-10 px-3.5 bg-card hover:bg-muted/70 border border-border/80 rounded-xl shadow-sm transition-all text-muted-foreground hover:text-foreground text-[11px] font-bold uppercase tracking-wider active:scale-95"
                :class="{ 'opacity-50 cursor-not-allowed': store.loading }"
                :disabled="store.loading"
                title="Rafraîchir les candidatures"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" :class="{ 'animate-spin': store.loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8"/>
                  <path d="M21 3v5h-5"/>
                </svg>
                <span class="hidden sm:inline">Actualiser</span>
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="store.loading && !store.applications.length" class="flex items-center justify-center py-24 border border-dashed border-border/80 rounded-2xl bg-card/50">
            <div class="flex flex-col items-center gap-3">
              <div class="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent shadow-sm" />
              <span class="text-xs text-muted-foreground font-bold uppercase tracking-widest">Chargement de vos candidatures...</span>
            </div>
          </div>
      
          <!-- Initial Empty state (0 total candidatures) -->
          <div 
            v-else-if="!store.applications.length" 
            class="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border/80 rounded-2xl bg-gradient-to-b from-card to-muted/20 text-center space-y-5"
          >
            <div class="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
                <circle cx="12" cy="13" r="2"/>
                <path d="M12 11v-1"/>
              </svg>
            </div>
            <div class="max-w-md space-y-1.5">
              <h2 class="text-lg font-bold text-foreground">Aucune candidature pour le moment</h2>
              <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Commencez à suivre vos opportunités d'emploi en créant votre première candidature ou en important un fichier CSV.
              </p>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button 
                @click="handleAdd" 
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 5v14" /><path d="M5 12h14" />
                </svg>
                Ajouter une candidature
              </button>
              <button 
                @click="showImportExportModal = true" 
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted/70 text-foreground text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Importer un CSV
              </button>
            </div>
          </div>

          <!-- Empty Search / Filter result state -->
          <div 
            v-else-if="!filteredApplications.length" 
            class="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border/80 rounded-2xl bg-card/60 text-center space-y-4"
          >
            <div class="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <div class="max-w-sm space-y-1">
              <h3 class="text-sm font-bold text-foreground">Aucune candidature correspondante</h3>
              <p class="text-xs text-muted-foreground">
                Aucun résultat ne correspond à vos critères de recherche ou de filtre actuels.
              </p>
            </div>
            <button 
              @click="clearAllFilters" 
              class="px-4 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
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
        <AddApplicationModal
          v-if="showAddModal"
          @close="showAddModal = false"
          @saved="onApplicationSaved"
        />

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

        <ImportExportModal
          v-if="showImportExportModal"
          @close="showImportExportModal = false"
        />
      </div>
    </NuxtLayout>

    <!-- Guest / Unauthenticated: High-converting Landing Page -->
    <LandingPage v-else />
  </div>
</template>

<script setup lang="ts">
import type { JobApplication } from '~/stores/applications'

definePageMeta({
  layout: false,
})

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const authChecking = ref(true)

const store = useApplicationsStore()
const searchQuery = ref('')
const activeFilter = ref<string | null>(null)
const showAddModal = ref(false)
const showImportExportModal = ref(false)
const editingApplication = ref<JobApplication | null>(null)
const viewingApplication = ref<JobApplication | null>(null)
const applicationToDelete = ref<JobApplication | null>(null)

const searchInputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const hideClosed = ref(false)

const filteredApplications = computed(() => {
  let list = store.sortedApplications

  // Filter out closed applications if hideClosed is checked, unless explicitly filtering by status
  if (hideClosed.value && activeFilter.value !== 'accepted' && activeFilter.value !== 'rejected') {
    list = list.filter(app => app.status !== 'accepted' && app.status !== 'rejected')
  }

  // Filter by status if a stat card is selected
  if (activeFilter.value) {
    list = list.filter(app => app.status === activeFilter.value)
  }

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

function toggleFilter(status: string | null) {
  if (activeFilter.value === status) {
    activeFilter.value = null
  } else {
    activeFilter.value = status
  }
}

function getFilterLabel(filter: string | null) {
  if (filter === 'applied') return 'Postulé'
  if (filter === 'interview') return 'Entretiens'
  if (filter === 'accepted') return 'Accepté'
  if (filter === 'rejected') return 'Refusé'
  return 'Toutes'
}

function clearAllFilters() {
  activeFilter.value = null
  searchQuery.value = ''
  hideClosed.value = false
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === '/' && document.activeElement !== searchInputRef.value) {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

onMounted(async () => {
  if (!user.value) {
    try {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) {
        user.value = data.session.user as any
      }
    } catch (e) {
      console.error('Session retrieval failed:', e)
    }
  }
  authChecking.value = false

  if (user.value) {
    store.fetchApplications()
    window.addEventListener('keydown', handleKeyDown)
  }
})

watch(user, (newUser) => {
  if (newUser) {
    store.fetchApplications()
    window.addEventListener('keydown', handleKeyDown)
  } else {
    window.removeEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

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

function handleAdd() {
  if (!user.value) return navigateTo('/login')
  showAddModal.value = true
}

function onApplicationSaved() {
  showAddModal.value = false
}

function onApplicationUpdated() {
  editingApplication.value = null
}
</script>
