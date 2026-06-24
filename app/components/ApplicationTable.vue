<template>
  <div class="w-full overflow-hidden">
    <!-- Desktop Table -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="w-full table-fixed">
        <thead>
          <tr class="border-b-2 border-border/50">
            <th
              v-for="col in columns"
              :key="col.key"
              @click="toggleSort(col.key)"
              class="h-11 px-4 text-left align-middle font-bold text-muted-foreground uppercase tracking-wider text-[11px] cursor-pointer hover:text-foreground transition-colors select-none w-[15%]"
            >
              <span class="flex items-center gap-1.5">
                {{ col.label }}
                <svg v-if="sortBy === col.key" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-primary transition-transform"
                     :class="{ 'rotate-180': sortOrder === 'asc' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </span>
            </th>
            <th class="h-11 px-4 w-[10%]"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(app, index) in sortedApplications"
            :key="app.id"
            @click="$emit('view', app)"
            class="group cursor-pointer transition-all duration-150 border-b border-border/30"
            :class="index % 2 === 0 ? 'bg-transparent hover:bg-muted/40' : 'bg-muted/15 hover:bg-muted/40'"
          >
            <!-- Entreprise -->
            <td class="px-4 py-4 align-middle">
              <div class="flex items-center gap-3">
                <!-- Mini monogram -->
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[10px] font-black" :class="getMonogramColor(app.status)">
                  {{ getMonogram(app.company_name) }}
                </div>
                <div class="min-w-0">
                  <span class="font-bold text-[13px] text-foreground block truncate max-w-[140px]">{{ app.company_name || '—' }}</span>
                  <span class="text-[12px] block max-w-[140px]">{{ app.job_profile || '' }}</span>
                </div>
                <a v-if="app.url" :href="app.url" target="_blank" @click.stop
                   class="text-muted-foreground/40 hover:text-primary opacity-0 group-hover:opacity-100 transition-all ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </td>
            <!-- Missions -->
            <td class="px-4 py-4 align-middle">
              <p class="text-[13px] text-foreground/90 leading-relaxed line-clamp-3">
                {{ formatMissions(app.main_missions) }}
              </p>
            </td>
            <!-- Compétences -->
            <td class="px-4 py-4 align-middle">
              <div v-if="app.primary_skills" class="flex flex-wrap items-center gap-1.5">
                <span
                  v-for="skill in formatSkills(app.primary_skills).slice(0, 3)"
                  :key="skill"
                  class="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 whitespace-nowrap"
                >
                  {{ skill }}
                </span>
                <span
                  v-if="formatSkills(app.primary_skills).length > 3"
                  class="inline-flex px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground/60"
                >
                  +{{ formatSkills(app.primary_skills).length - 3 }}
                </span>
              </div>
              <span v-else class="text-muted-foreground/40 text-xs">—</span>
            </td>
            <!-- Salaire -->
            <td class="px-4 py-4 align-middle overflow-hidden">
              <div v-if="app.proposed_salary" :title="formatProposedSalary(app.proposed_salary)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 max-w-[130px]">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>
                </svg>
                <span class="text-[12px] font-bold truncate min-w-0">
                  {{ formatProposedSalary(app.proposed_salary) }}
                </span>
              </div>
              <span v-else class="text-muted-foreground/40 text-xs">—</span>
            </td>
            <!-- Date -->
            <td @click.stop class="px-4 py-4 align-middle whitespace-nowrap">
              <span class="text-[12px] font-medium text-foreground/60">
                {{ app.applied_at ? formatDate(app.applied_at) : '—' }}
              </span>
            </td>
            <!-- Statut -->
            <td @click.stop class="px-4 py-4 align-middle">
              <StatusSelect
                :model-value="app.status"
                @change="(newStatus) => $emit('changeStatus', app.id, newStatus)"
              />
            </td>
            <!-- Actions -->
            <td class="px-4 py-4 align-middle">
              <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click.stop="$emit('edit', app)" class="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Modifier">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted-foreground hover:text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                  </svg>
                </button>
                <button @click.stop="$emit('delete', app)" class="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors" title="Supprimer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-muted-foreground hover:text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="lg:hidden space-y-3">
      <div
        v-for="app in sortedApplications"
        :key="app.id"
        @click="$emit('view', app)"
        class="bg-card border rounded-xl p-4 space-y-3 cursor-pointer hover:border-primary/30 transition-colors active:scale-[0.99]"
      >
        <!-- Header -->
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-[10px] font-black" :class="getMonogramColor(app.status)">
            {{ getMonogram(app.company_name) }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-foreground text-[14px] leading-tight truncate">{{ app.company_name || 'Entreprise inconnue' }}</h3>
            <p class="text-[12px] text-muted-foreground mt-0.5">{{ app.job_profile || 'Profil non spécifié' }}</p>
          </div>
          <StatusSelect
            :model-value="app.status"
            @click.stop
            @change="(newStatus) => $emit('changeStatus', app.id, newStatus)"
          />
        </div>

        <!-- Skills -->
        <div v-if="app.primary_skills" class="flex flex-wrap gap-1.5">
          <span
            v-for="skill in formatSkills(app.primary_skills).slice(0, 4)"
            :key="skill"
            class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-700 dark:text-violet-300 rounded-md border border-violet-500/20"
          >
            {{ skill }}
          </span>
        </div>

        <!-- Bottom row: salary + date + actions -->
        <div class="flex items-center justify-between pt-2 border-t border-border/30">
          <div class="flex items-center gap-4">
            <div v-if="app.proposed_salary" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>
              </svg>
              <span class="text-[12px] font-bold whitespace-nowrap">
                {{ formatProposedSalary(app.proposed_salary) }}
              </span>
            </div>
            <span v-else class="text-muted-foreground/40 text-xs">—</span>
            <span class="text-[11px] font-medium text-muted-foreground">
              {{ app.applied_at ? formatDate(app.applied_at) : 'Non postulé' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <a v-if="app.url" :href="app.url" target="_blank" @click.stop class="text-muted-foreground hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <button @click.stop="$emit('edit', app)" class="p-1.5 hover:bg-muted rounded-lg border border-border/50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
              </svg>
            </button>
            <button @click.stop="$emit('delete', app)" class="p-1.5 hover:bg-destructive/10 rounded-lg border border-border/50">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JobApplication } from '~/stores/applications'
import {
  formatProposedSalary,
  formatSkills,
  formatCompanyInfo,
  formatMissions
} from '~/utils/formatters'

const props = defineProps<{
  applications: JobApplication[]
}>()

defineEmits<{
  edit: [app: JobApplication]
  delete: [app: JobApplication]
  changeStatus: [id: string, status: string]
  view: [app: JobApplication]
}>()

const sortBy = ref<string>('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')

const columns = [
  { key: 'company_name', label: 'Entreprise' },
  { key: 'main_missions', label: 'Missions' },
  { key: 'primary_skills', label: 'Compétences' },
  { key: 'proposed_salary', label: 'Salaire' },
  { key: 'applied_at', label: 'Date' },
  { key: 'status', label: 'Statut' },
]

const sortedApplications = computed(() => {
  const sorted = [...props.applications]
  sorted.sort((a: any, b: any) => {
    const valA = a[sortBy.value] || ''
    const valB = b[sortBy.value] || ''
    if (sortOrder.value === 'asc') return valA > valB ? 1 : -1
    return valA < valB ? 1 : -1
  })
  return sorted
})

function toggleSort(key: string) {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'desc'
  }
}

function formatDate(date: string) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getMonogram(name: string | undefined) {
  if (!name) return '?'
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) return ((words[0]?.[0] || '') + (words[1]?.[0] || '')).toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

function getMonogramColor(status: string) {
  const colors: Record<string, string> = {
    draft: 'bg-gradient-to-br from-zinc-500 to-zinc-600',
    applied: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    interview: 'bg-gradient-to-br from-amber-400 to-orange-500',
    rejected: 'bg-gradient-to-br from-red-400 to-rose-500',
    accepted: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  }
  return colors[status] || colors.draft
}
</script>
