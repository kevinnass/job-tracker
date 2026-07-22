<template>
  <div class="space-y-10 animate-fade-in pb-16">
    <!-- Empty State -->
    <div v-if="!store.applications.length && !store.loading" class="flex flex-col items-center justify-center py-24 border border-dashed rounded-2xl space-y-4">
      <div class="text-4xl grayscale opacity-60">📊</div>
      <div class="text-center space-y-1">
        <h2 class="text-sm font-semibold">Aucune donnée disponible</h2>
        <p class="text-xs text-muted-foreground">Ajoutez vos premières candidatures pour afficher les analyses graphiques.</p>
      </div>
      <NuxtLink to="/" class="btn-primary flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2">
        Retour au tableau de bord
      </NuxtLink>
    </div>

    <!-- Analytics Dashboard Content -->
    <div v-else class="space-y-8">
      <!-- Top Overview Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Taux de réponse -->
        <div class="p-5 rounded-2xl border border-border/60 bg-card shadow-sm space-y-3 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Taux de réponse</span>
            <div class="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-extrabold tracking-tight text-foreground">{{ formatPercent(responseRate) }}</h2>
            <p class="text-[9.5px] text-muted-foreground mt-0.5">Pourcentage de candidatures menant à un entretien</p>
          </div>
        </div>

        <!-- Taux d'offre -->
        <div class="p-5 rounded-2xl border border-border/60 bg-card shadow-sm space-y-3 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Taux de succès</span>
            <div class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-extrabold tracking-tight text-foreground">{{ formatPercent(successRate) }}</h2>
            <p class="text-[9.5px] text-muted-foreground mt-0.5">Taux de réussite (offres reçues / acceptées)</p>
          </div>
        </div>

        <!-- Moyenne mensuelle -->
        <div class="p-5 rounded-2xl border border-border/60 bg-card shadow-sm space-y-3 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Activité moyenne</span>
            <div class="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-extrabold tracking-tight text-foreground">{{ averagePerMonth.toFixed(1) }}</h2>
            <p class="text-[9.5px] text-muted-foreground mt-0.5">Nombre moyen de candidatures par mois</p>
          </div>
        </div>

        <!-- Total -->
        <div class="p-5 rounded-2xl border border-border/60 bg-card shadow-sm space-y-3 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total candidatures</span>
            <div class="p-1.5 rounded-lg bg-slate-500/10 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-extrabold tracking-tight text-foreground">{{ store.applications.length }}</h2>
            <p class="text-[9.5px] text-muted-foreground mt-0.5">Candidatures totales soumises</p>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Status Distribution Chart (Donut style) -->
        <div class="p-6 rounded-2xl border border-border/60 bg-card shadow-sm flex flex-col justify-between col-span-1 min-h-[360px]">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Répartition des statuts</h3>
            <p class="text-[10px] text-muted-foreground/80">Proportions actuelles de votre recherche</p>
          </div>

          <div class="flex items-center justify-center py-4 relative">
            <!-- Premium SVG Donut Chart -->
            <svg class="w-40 h-40 transform -rotate-90" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--border)" stroke-width="3" />
              <circle 
                v-for="(seg, idx) in donutSegments"
                :key="idx"
                cx="21" 
                cy="21" 
                r="15.915" 
                fill="transparent" 
                :stroke="seg.color" 
                stroke-width="4.2" 
                :stroke-dasharray="`${seg.value} ${100 - seg.value}`" 
                :stroke-dashoffset="seg.offset"
                stroke-linecap="round"
                class="transition-all duration-1000 ease-out"
              />
            </svg>
            <div class="absolute flex flex-col items-center justify-center">
              <span class="text-xl font-black text-foreground">{{ store.applications.length }}</span>
              <span class="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Projets</span>
            </div>
          </div>

          <!-- Donut Legend -->
          <div class="grid grid-cols-2 gap-2 text-[10px] pt-4 border-t border-border/50">
            <div v-for="seg in donutLegend" :key="seg.label" class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: seg.color }"></span>
              <span class="text-muted-foreground font-semibold truncate">{{ seg.label }}</span>
              <span class="text-foreground font-bold ml-auto">{{ seg.count }}</span>
            </div>
          </div>
        </div>

        <!-- Monthly progression (Bar chart) -->
        <div class="p-6 rounded-2xl border border-border/60 bg-card shadow-sm flex flex-col justify-between col-span-1 lg:col-span-2 min-h-[360px]">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Progression mensuelle</h3>
            <p class="text-[10px] text-muted-foreground/80">Nombre de candidatures soumises au fil des mois</p>
          </div>

          <div class="flex-1 flex items-end justify-between gap-2.5 px-2 pt-8 pb-4 h-full min-h-[180px]">
            <div 
              v-for="month in monthlyData" 
              :key="month.name" 
              class="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
            >
              <!-- Bar value tooltip on hover -->
              <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                {{ month.count }}
              </div>
              <!-- Vertical Bar -->
              <div 
                class="w-full bg-indigo-500/10 group-hover:bg-indigo-500/20 dark:bg-indigo-500/5 dark:group-hover:bg-indigo-500/15 rounded-t-lg transition-all duration-500 relative flex items-end overflow-hidden"
                :style="{ height: getBarHeight(month.count) }"
              >
                <!-- Filled segment with gradient -->
                <div class="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 h-full rounded-t-lg transition-all duration-700 delay-100 transform origin-bottom scale-y-100"></div>
              </div>
              <span class="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/85 whitespace-nowrap">{{ month.name }}</span>
            </div>
          </div>

          <div v-if="!monthlyData.length" class="text-center py-10 text-[10px] text-muted-foreground">
            Pas assez de données temporelles pour générer l'analyse mensuelle.
          </div>
        </div>
      </div>

      <!-- Funnel & Platforms Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Platform distribution -->
        <div class="p-6 rounded-2xl border border-border/60 bg-card shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Sources & Plateformes</h3>
            <p class="text-[10px] text-muted-foreground/80">Origine des offres d'emploi postulées</p>
          </div>

          <div class="space-y-3 pt-6 flex-1 justify-center flex flex-col">
            <div v-for="platform in platformData" :key="platform.name" class="space-y-1.5">
              <div class="flex items-center justify-between text-[10px]">
                <span class="font-bold text-foreground truncate max-w-[150px]">{{ platform.name }}</span>
                <span class="text-muted-foreground font-semibold">{{ platform.count }} ({{ platform.percent }}%)</span>
              </div>
              <div class="h-2 w-full bg-muted/60 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: `${platform.percent}%` }"
                ></div>
              </div>
            </div>

            <div v-if="!platformData.length" class="text-center py-6 text-[10px] text-muted-foreground">
              Aucune plateforme identifiée. Renseignez l'URL de vos offres.
            </div>
          </div>
        </div>

        <!-- Conversion Pipeline / Funnel -->
        <div class="p-6 rounded-2xl border border-border/60 bg-card shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Entonnoir de conversion</h3>
            <p class="text-[10px] text-muted-foreground/80">Efficacité de votre pipeline de recrutement</p>
          </div>

          <div class="space-y-4 pt-6 flex-1 justify-center flex flex-col">
            <div v-for="(step, idx) in funnelSteps" :key="step.label" class="flex items-center gap-4">
              <!-- Left label & value -->
              <div class="w-24 text-[10px] shrink-0">
                <span class="block font-bold text-foreground truncate">{{ step.label }}</span>
                <span class="text-muted-foreground text-[9px]">{{ step.count }} candidatures</span>
              </div>
              
              <!-- Funnel block bar -->
              <div class="flex-1 h-8 bg-muted/40 dark:bg-zinc-800/40 rounded-lg relative overflow-hidden flex items-center px-3 border border-border/20">
                <div 
                  class="absolute left-0 top-0 bottom-0 bg-indigo-500/10 border-r border-indigo-500/20 transition-all duration-1000 ease-out"
                  :style="{ width: `${step.percent}%` }"
                ></div>
                <!-- Percentage conversion display -->
                <span class="text-[9.5px] font-bold text-indigo-600 dark:text-indigo-400 z-10">
                  {{ step.percent.toFixed(0) }}%
                </span>
                <span v-if="idx > 0" class="text-[8px] text-muted-foreground/75 ml-auto z-10">
                  Ref : {{ formatPercent(step.count / funnelSteps[0].count) }} du total
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useApplicationsStore()

onMounted(() => {
  store.fetchApplications()
})

// Conversion rate calculations
const responseRate = computed(() => {
  const total = store.applications.length
  if (!total) return 0
  const replies = store.applications.filter(
    a => a.status === 'interview' || a.status === 'accepted' || a.status === 'rejected'
  ).length
  return replies / total
})

const successRate = computed(() => {
  const total = store.applications.length
  if (!total) return 0
  const accepted = store.applications.filter(a => a.status === 'accepted').length
  return accepted / total
})

// Average per month calculation
const averagePerMonth = computed(() => {
  const apps = store.applications
  if (!apps.length) return 0
  
  const months = new Set<string>()
  apps.forEach(a => {
    if (a.created_at) {
      months.add(a.created_at.substring(0, 7)) // YYYY-MM
    }
  })
  
  const totalMonths = months.size || 1
  return apps.length / totalMonths
})

// Status Pie/Donut Chart calculations
const donutLegend = computed(() => {
  const list = store.applications
  const getCount = (status: string) => list.filter(a => a.status === status).length
  
  return [
    { label: 'Brouillon', status: 'draft', color: '#71717a', count: getCount('draft') },
    { label: 'Postulé', status: 'applied', color: '#3b82f6', count: getCount('applied') },
    { label: 'Entretien', status: 'interview', color: '#f97316', count: getCount('interview') },
    { label: 'Accepté', status: 'accepted', color: '#10b981', count: getCount('accepted') },
    { label: 'Refusé', status: 'rejected', color: '#ef4444', count: getCount('rejected') }
  ]
})

const donutSegments = computed(() => {
  const legend = donutLegend.value
  const total = store.applications.length
  if (!total) return []

  let accumulatedPercent = 0
  return legend
    .map(item => {
      const value = (item.count / total) * 100
      const offset = 100 - accumulatedPercent + 25 // 25 to start segment from the top instead of right
      accumulatedPercent += value
      return {
        color: item.color,
        value,
        offset: offset.toString()
      }
    })
    .filter(seg => seg.value > 0)
})

// Monthly progression chart calculations
const monthlyData = computed(() => {
  const apps = store.applications
  if (!apps.length) return []

  const counts: Record<string, number> = {}
  apps.forEach(a => {
    if (a.created_at) {
      const date = new Date(a.created_at)
      const label = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
      counts[label] = (counts[label] || 0) + 1
    }
  })

  // Sort chronologically (simplification: sort by entry order)
  return Object.keys(counts).map(name => ({
    name,
    count: counts[name]
  })).slice(-6) // Display last 6 months
})

const maxMonthCount = computed(() => {
  const data = monthlyData.value
  if (!data.length) return 1
  return Math.max(...data.map(d => d.count)) || 1
})

function getBarHeight(count: number) {
  const max = maxMonthCount.value
  const percent = (count / max) * 100
  return `${Math.max(percent, 8)}%` // Ensure a minimum height for visibility
}

// Funnel calculations
const funnelSteps = computed(() => {
  const list = store.applications
  const total = list.length
  if (!total) return []

  const applied = list.filter(a => a.status !== 'draft').length
  const interviews = list.filter(a => a.status === 'interview' || a.status === 'accepted').length
  const offers = list.filter(a => a.status === 'accepted').length

  return [
    { label: 'Total', count: total, percent: 100 },
    { label: 'Candidatures', count: applied, percent: total ? (applied / total) * 100 : 0 },
    { label: 'Entretiens', count: interviews, percent: applied ? (interviews / applied) * 100 : 0 },
    { label: 'Offres reçues', count: offers, percent: interviews ? (offers / interviews) * 100 : 0 }
  ]
})

// Platform distributions from URL hostname parsing
const platformData = computed(() => {
  const apps = store.applications
  if (!apps.length) return []

  const counts: Record<string, number> = {}
  apps.forEach(a => {
    if (!a.url) {
      counts['Non spécifié'] = (counts['Non spécifié'] || 0) + 1
      return
    }
    
    try {
      const hostname = new URL(a.url).hostname.replace('www.', '')
      let platform = 'Autre'
      if (hostname.includes('linkedin.com')) platform = 'LinkedIn'
      else if (hostname.includes('indeed.com')) platform = 'Indeed'
      else if (hostname.includes('welcometothejungle.com')) platform = 'Welcome to the Jungle'
      else if (hostname.includes('pole-emploi.fr') || hostname.includes('francetravail.fr')) platform = 'France Travail'
      else platform = hostname

      counts[platform] = (counts[platform] || 0) + 1
    } catch {
      counts['URL invalide'] = (counts['URL invalide'] || 0) + 1
    }
  })

  const total = apps.length
  return Object.keys(counts)
    .map(name => ({
      name,
      count: counts[name],
      percent: Math.round((counts[name] / total) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4) // Show top 4 platforms
})

function formatPercent(val: number) {
  return `${Math.round(val * 100)}%`
}
</script>
