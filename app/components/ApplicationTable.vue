<template>
  <div class="w-full">
    <!-- Desktop Table (wrapped in clean container) -->
    <div class="hidden lg:block rounded-2xl border border-border bg-card shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full table-fixed text-left border-collapse">
          <thead>
            <tr class="border-b border-border/70 bg-muted/40">
              <th
                v-for="col in columns"
                :key="col.key"
                @click="toggleSort(col.key)"
                class="h-12 px-4 align-middle font-black text-muted-foreground uppercase tracking-widest text-[10px] cursor-pointer hover:text-foreground transition-colors select-none"
                :class="col.widthClass || 'w-[15%]'"
              >
                <span class="flex items-center gap-1.5 group">
                  <span>{{ col.label }}</span>
                  <svg 
                    v-if="sortBy === col.key" 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="w-3.5 h-3.5 text-indigo-500 transition-transform duration-200"
                    :class="{ 'rotate-180': sortOrder === 'asc' }" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2.5"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                  <svg 
                    v-else 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="w-3 h-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2"
                  >
                    <path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>
                  </svg>
                </span>
              </th>
              <th class="h-12 px-4 w-[8%] text-right font-black text-[10px] uppercase text-muted-foreground pr-5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/40">
            <tr
              v-for="app in sortedApplications"
              :key="app.id"
              @click="$emit('view', app)"
              class="group cursor-pointer transition-colors duration-150 hover:bg-muted/30"
            >
              <!-- Entreprise & Poste -->
              <td class="px-4 py-4 align-middle">
                <div class="flex items-center gap-3">
                  <!-- Monogram Icon -->
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[11px] font-black shadow-sm" :class="getMonogramColor(app.status)">
                    {{ getMonogram(app.company_name) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="font-bold text-[13px] text-foreground block truncate max-w-[150px] group-hover:text-indigo-500 transition-colors">
                      {{ app.company_name || '—' }}
                    </span>
                    <span class="text-[11.5px] text-muted-foreground block truncate max-w-[150px]">
                      {{ app.job_profile || 'Non spécifié' }}
                    </span>
                  </div>
                  <a 
                    v-if="app.url" 
                    :href="app.url" 
                    target="_blank" 
                    @click.stop
                    class="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-indigo-500 hover:bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    title="Voir l'offre originale"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>
              </td>

              <!-- Missions -->
              <td class="px-4 py-4 align-middle">
                <p class="text-[12.5px] text-foreground/85 leading-relaxed line-clamp-2">
                  {{ formatMissions(app.main_missions) || '—' }}
                </p>
              </td>

              <!-- Compétences -->
              <td class="px-4 py-4 align-middle">
                <div v-if="app.primary_skills" class="flex flex-wrap items-center gap-1.5">
                  <span
                    v-for="skill in formatSkills(app.primary_skills).slice(0, 3)"
                    :key="skill"
                    class="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 whitespace-nowrap"
                  >
                    {{ skill }}
                  </span>
                  <span
                    v-if="formatSkills(app.primary_skills).length > 3"
                    class="inline-flex px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground/70"
                  >
                    +{{ formatSkills(app.primary_skills).length - 3 }}
                  </span>
                </div>
                <span v-else class="text-muted-foreground/40 text-xs">—</span>
              </td>

              <!-- Salaire -->
              <td class="px-4 py-4 align-middle overflow-hidden">
                <div v-if="app.proposed_salary" :title="formatProposedSalary(app.proposed_salary)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 max-w-[130px]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>
                  </svg>
                  <span class="text-[11.5px] font-bold truncate min-w-0">
                    {{ formatProposedSalary(app.proposed_salary) }}
                  </span>
                </div>
                <span v-else class="text-muted-foreground/40 text-xs">—</span>
              </td>

              <!-- Date -->
              <td @click.stop class="px-4 py-4 align-middle whitespace-nowrap">
                <span class="text-[12px] font-medium text-muted-foreground font-mono">
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
              <td class="px-4 py-4 align-middle text-right pr-4">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    @click.stop="$emit('edit', app)" 
                    class="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" 
                    title="Modifier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                    </svg>
                  </button>
                  <button 
                    @click.stop="$emit('delete', app)" 
                    class="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors" 
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="lg:hidden space-y-3.5">
      <div
        v-for="app in sortedApplications"
        :key="app.id"
        @click="$emit('view', app)"
        class="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 space-y-3.5 cursor-pointer hover:border-indigo-500/40 hover:shadow-md transition-all active:scale-[0.99]"
      >
        <!-- Header -->
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[11px] font-black shadow-sm" :class="getMonogramColor(app.status)">
            {{ getMonogram(app.company_name) }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-foreground text-[14px] leading-tight truncate">{{ app.company_name || 'Entreprise inconnue' }}</h3>
            <p class="text-[12px] text-muted-foreground mt-0.5 truncate">{{ app.job_profile || 'Profil non spécifié' }}</p>
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
            class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-500/20"
          >
            {{ skill }}
          </span>
        </div>

        <!-- Bottom row: salary + date + actions -->
        <div class="flex items-center justify-between pt-3 border-t border-border/40">
          <div class="flex items-center gap-3">
            <div v-if="app.proposed_salary" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span class="text-[11px] font-bold whitespace-nowrap">
                {{ formatProposedSalary(app.proposed_salary) }}
              </span>
            </div>
            <span class="text-[11px] font-medium text-muted-foreground font-mono">
              {{ app.applied_at ? formatDate(app.applied_at) : 'Non postulé' }}
            </span>
          </div>

          <div class="flex items-center gap-1.5">
            <a 
              v-if="app.url" 
              :href="app.url" 
              target="_blank" 
              @click.stop 
              class="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-indigo-500 hover:bg-muted border border-border/50 transition-colors"
              title="Voir l'offre"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <button 
              @click.stop="$emit('edit', app)" 
              class="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 transition-colors"
              title="Modifier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
              </svg>
            </button>
            <button 
              @click.stop="$emit('delete', app)" 
              class="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-border/50 transition-colors"
              title="Supprimer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
  { key: 'company_name', label: 'Entreprise & Poste', widthClass: 'w-[20%]' },
  { key: 'main_missions', label: 'Missions clés', widthClass: 'w-[30%]' },
  { key: 'primary_skills', label: 'Compétences', widthClass: 'w-[18%]' },
  { key: 'proposed_salary', label: 'Salaire', widthClass: 'w-[12%]' },
  { key: 'applied_at', label: 'Date', widthClass: 'w-[10%]' },
  { key: 'status', label: 'Statut', widthClass: 'w-[10%]' },
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
