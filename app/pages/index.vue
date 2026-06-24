<template>
  <div class="space-y-10 animate-fade-in">
    <!-- Header/Stats Section -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <div class="flex items-center gap-2">
          <button @click="showImportExportModal = true" class="btn-secondary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter
          </button>
          <button @click="handleAdd" class="btn-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14" /><path d="M5 12h14" />
            </svg>
            Add Application
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard 
          label="Total" 
          :value="store.stats.total"
          :active="!activeFilter"
          @click="toggleFilter(null)"
        >
          <template #icon>
            <div class="p-1.5 rounded-md bg-slate-500/10 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
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
            <div class="p-1.5 rounded-md bg-blue-500/10 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
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
            <div class="p-1.5 rounded-md bg-orange-500/10 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
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
            <div class="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
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
            <div class="p-1.5 rounded-md bg-red-500/10 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            </div>
          </template>
        </StatCard>
      </div>
    </div>
 
    <!-- Main Content Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div class="relative flex-1 max-w-sm">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une candidature..."
            class="input-field pl-9 bg-muted/50 border-none h-9 text-xs"
          />
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
      <div v-else-if="!store.applications.length" class="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl space-y-4">
        <div class="text-3xl grayscale opacity-50">📭</div>
        <div class="text-center">
          <h2 class="text-sm font-semibold">Aucune candidature pour le moment</h2>
          <p class="text-xs text-muted-foreground mt-1">Prêt à commencer votre prochain chapitre ?</p>
        </div>
        <button @click="handleAdd" class="btn-secondary h-8 text-xs font-bold uppercase tracking-wide">
          Commencer
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
</template>

<script setup lang="ts">
import type { JobApplication } from '~/stores/applications'

const store = useApplicationsStore()
const searchQuery = ref('')
const activeFilter = ref<string | null>(null)
const showAddModal = ref(false)
const showImportExportModal = ref(false)
const editingApplication = ref<JobApplication | null>(null)
const viewingApplication = ref<JobApplication | null>(null)
const applicationToDelete = ref<JobApplication | null>(null)

const filteredApplications = computed(() => {
  let list = store.sortedApplications

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

onMounted(() => {
  store.fetchApplications()
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

