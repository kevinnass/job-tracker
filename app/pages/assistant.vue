<template>
  <div class="h-full flex flex-col md:flex-row gap-4 animate-fade-in">
    
    <!-- Sidebar - Applications Selector (Desktop only) -->
    <div class="hidden md:flex w-72 shrink-0 flex-col bg-card border border-border/60 rounded-2xl shadow-lg overflow-hidden h-full">
      <!-- Sidebar gradient header -->
      <div class="px-4 py-3.5 border-b border-border/60 bg-gradient-to-br from-indigo-500/8 to-violet-500/5">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
          <h2 class="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Candidatures</h2>
        </div>
        <p class="text-[10px] text-muted-foreground leading-relaxed">Sélectionnez un contexte pour charger l'historique.</p>
      </div>

      <!-- Application List -->
      <div class="flex-1 overflow-y-auto p-2.5 space-y-1">
        <!-- General chat -->
        <button 
          @click="activeApp = null"
          class="w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-all duration-200 flex items-center gap-2.5 group"
          :class="!activeApp 
            ? 'border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-violet-500/5 text-indigo-600 dark:text-indigo-400 shadow-sm' 
            : 'border-transparent hover:border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground'"
        >
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            :class="!activeApp ? 'bg-indigo-500/15 text-indigo-500' : 'bg-muted text-muted-foreground group-hover:bg-indigo-500/10 group-hover:text-indigo-400'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <span class="font-semibold block text-[11px]">Chat Général</span>
            <span class="text-[9px] opacity-60">Questions d'emploi générales</span>
          </div>
          <svg v-if="!activeApp" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </button>

        <!-- Section label -->
        <div v-if="store.sortedApplications.length > 0" class="px-1 pt-2 pb-0.5">
          <span class="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Mes candidatures</span>
        </div>

        <!-- Apps -->
        <button 
          v-for="app in store.sortedApplications" 
          :key="app.id"
          @click="activeApp = app"
          class="w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-all duration-200 flex items-center gap-2.5 group"
          :class="activeApp?.id === app.id 
            ? 'border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-violet-500/5 shadow-sm' 
            : 'border-transparent hover:border-border hover:bg-muted/60'"
        >
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black text-white"
            :class="activeApp?.id === app.id 
              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm' 
              : 'bg-gradient-to-br from-slate-400 to-slate-500 group-hover:from-indigo-400 group-hover:to-violet-500'">
            {{ app.company_name?.[0]?.toUpperCase() || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <span class="font-semibold truncate text-[11px]" :class="activeApp?.id === app.id ? 'text-indigo-700 dark:text-indigo-300' : ''">{{ app.company_name }}</span>
              <span class="text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full shrink-0"
                :class="{
                  'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400': app.status === 'accepted',
                  'bg-orange-500/15 text-orange-600 dark:text-orange-400': app.status === 'interview',
                  'bg-sky-500/15 text-sky-600 dark:text-sky-400': app.status === 'applied',
                  'bg-red-500/15 text-red-500': app.status === 'rejected',
                  'bg-muted text-muted-foreground': !['accepted','interview','applied','rejected'].includes(app.status)
                }">{{ app.status }}</span>
            </div>
            <span class="text-[9px] text-muted-foreground truncate block mt-0.5">{{ app.job_profile || 'Poste non précisé' }}</span>
          </div>
        </button>

        <!-- Empty state -->
        <div v-if="store.sortedApplications.length === 0" class="px-3 py-8 text-center">
          <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </div>
          <p class="text-[10px] text-muted-foreground leading-relaxed">Aucune candidature.<br>Ajoutez-en une depuis<br>le tableau de bord.</p>
        </div>
      </div>

      <!-- Demo Mode Toggle -->
      <div class="p-3.5 border-t border-border/60 bg-muted/20">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Mode Démo</span>
            <span class="text-[9px] text-muted-foreground/60">Simulation sans API</span>
          </div>
          <button 
            @click="useMock = !useMock" 
            class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
            :class="useMock ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-700'"
          >
            <span 
              class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              :class="useMock ? 'translate-x-4' : 'translate-x-0'"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Interface -->
    <div class="flex-1 flex flex-col bg-card border border-border/60 rounded-2xl shadow-lg overflow-hidden h-full relative">
      
      <!-- Ambient gradient blobs -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div class="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-indigo-500/8 blur-[80px]"></div>
        <div class="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-violet-500/8 blur-[80px]"></div>
      </div>

      <!-- Chat Header -->
      <div class="px-5 py-3.5 border-b border-border/60 bg-card/90 backdrop-blur-md flex flex-col gap-3 z-10 relative">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- AI Avatar with online indicator -->
            <div class="relative shrink-0">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><circle cx="7.5" cy="14.5" r="1.5" fill="white" stroke="none"/><circle cx="16.5" cy="14.5" r="1.5" fill="white" stroke="none"/></svg>
              </div>
              <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-card"></div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-bold tracking-tight text-foreground">Assistant IA</h2>
                <span class="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black font-mono">GLM-4.7-flash</span>
              </div>
              <p class="text-[10px] text-muted-foreground mt-0.5">
                <span v-if="activeApp" class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block shrink-0"></span>
                  <span class="font-semibold text-indigo-600 dark:text-indigo-400">{{ activeApp.company_name }}</span>
                  <span class="opacity-40">·</span>
                  <span>{{ activeApp.job_profile }}</span>
                </span>
                <span v-else>Posez vos questions de recherche d'emploi.</span>
              </p>
            </div>
          </div>
          <!-- Mobile demo toggle -->
          <div class="flex md:hidden items-center gap-2">
            <span class="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Démo</span>
            <button 
              @click="useMock = !useMock" 
              class="relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="useMock ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-700'"
            >
              <span class="pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="useMock ? 'translate-x-3' : 'translate-x-0'" />
            </button>
          </div>
        </div>

        <!-- Mobile app selector -->
        <div class="block md:hidden w-full">
          <select 
            @change="onMobileSelectChange"
            class="w-full h-9 text-xs px-3 bg-card border border-border rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Chat Général — Questions emploi</option>
            <option 
              v-for="app in store.sortedApplications" 
              :key="app.id" 
              :value="app.id"
              :selected="activeApp?.id === app.id"
            >
              {{ app.company_name }} — {{ app.job_profile || '—' }}
            </option>
          </select>
        </div>

        <!-- Shortcut pills row -->
        <div class="flex items-center gap-2 flex-wrap">
          <div class="flex gap-1.5 flex-wrap flex-1">
            <button 
              @click="triggerShortcut('coverLetter')"
              :disabled="!activeApp || loading"
              class="px-2.5 py-1 text-[10px] border rounded-full font-bold tracking-wide transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 border-violet-500/25 text-violet-600 dark:text-violet-400 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/40"
              title="Générer une lettre de motivation"
            >✉️ <span class="hidden sm:inline">Lettre</span></button>
            <button 
              @click="triggerShortcut('followUp')"
              :disabled="!activeApp || loading"
              class="px-2.5 py-1 text-[10px] border rounded-full font-bold tracking-wide transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 border-sky-500/25 text-sky-600 dark:text-sky-400 bg-sky-500/5 hover:bg-sky-500/10 hover:border-sky-500/40"
              title="Générer un e-mail de relance"
            >📩 <span class="hidden sm:inline">Relance</span></button>
            <button 
              @click="triggerShortcut('interview')"
              :disabled="!activeApp || loading"
              class="px-2.5 py-1 text-[10px] border rounded-full font-bold tracking-wide transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 border-emerald-500/25 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40"
              title="Préparer l'entretien"
            >🤝 <span class="hidden sm:inline">Entretien</span></button>
          </div>
          <!-- Clear chat -->
          <button 
            @click="clearActiveConversation"
            :disabled="loading || loadingHistory || messages.length <= 1"
            class="px-2.5 py-1 text-[10px] border rounded-full font-bold tracking-wide transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30"
            title="Effacer toute la discussion"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            <span class="hidden sm:inline">Effacer</span>
          </button>
        </div>
      </div>

      <!-- Messages Stream -->
      <div ref="messageContainer" class="flex-1 overflow-y-auto px-4 py-5 space-y-5 z-10 relative">
        <!-- Loading history -->
        <div v-if="loadingHistory" class="flex items-center justify-center h-full">
          <div class="flex flex-col items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <div class="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
            <span class="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Chargement...</span>
          </div>
        </div>

        <template v-else>
          <!-- Empty / welcome state -->
          <div v-if="messages.length <= 1" class="flex flex-col items-center justify-center h-full text-center px-6 gap-5 py-10">
            <div class="relative">
              <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/25">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><circle cx="7.5" cy="14.5" r="1.5" fill="white" stroke="none"/><circle cx="16.5" cy="14.5" r="1.5" fill="white" stroke="none"/></svg>
              </div>
              <div class="absolute -inset-3 rounded-[1.5rem] bg-indigo-500/10 blur-2xl -z-10"></div>
            </div>
            <div>
              <h3 class="text-sm font-bold text-foreground mb-1.5">
                {{ activeApp ? `Contexte : ${activeApp.company_name}` : 'Comment puis-je vous aider ?' }}
              </h3>
              <p class="text-xs text-muted-foreground max-w-xs leading-relaxed">
                {{ activeApp 
                  ? `Utilisez les raccourcis ci-dessus pour générer une lettre, un e-mail de relance ou préparer votre entretien chez ${activeApp.company_name}.`
                  : 'Sélectionnez une candidature dans le panneau gauche pour un contexte personnalisé, ou posez directement votre question.' }}
              </p>
            </div>
            <div v-if="activeApp" class="flex flex-wrap gap-2 justify-center">
              <button @click="triggerShortcut('coverLetter')" :disabled="loading" class="px-3 py-1.5 text-[10px] rounded-full border border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/5 hover:bg-violet-500/10 font-bold transition-all">✉️ Générer une lettre</button>
              <button @click="triggerShortcut('interview')" :disabled="loading" class="px-3 py-1.5 text-[10px] rounded-full border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 font-bold transition-all">🤝 Préparer l'entretien</button>
            </div>
          </div>

          <!-- Message bubbles -->
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            class="flex items-end gap-2"
            :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
          >
            <!-- Avatar -->
            <div class="shrink-0 mb-5">
              <div v-if="msg.role === 'assistant'" class="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <div v-else class="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            </div>

            <!-- Bubble + actions -->
            <div class="max-w-[78%] sm:max-w-[68%] flex flex-col gap-1.5">
              <div 
                class="rounded-2xl px-4 py-3 text-xs leading-relaxed border"
                :class="msg.role === 'user' 
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-600 border-indigo-500/30 text-white rounded-br-sm shadow-[0_4px_20px_rgba(79,70,229,0.2)]' 
                  : 'bg-card/90 border-border/60 text-foreground rounded-bl-sm shadow-sm'"
              >
                <div v-html="formatMessage(msg.content)"></div>
              </div>

              <!-- User actions -->
              <div v-if="msg.role === 'user'" class="flex justify-end">
                <button @click="deleteSingleMessage(msg, index)" class="p-1 rounded-md hover:bg-red-500/10 text-muted-foreground/40 hover:text-red-400 transition-colors" title="Supprimer">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>

              <!-- Assistant actions -->
              <div v-if="msg.role === 'assistant'" class="flex items-center gap-1 flex-wrap">
                <button @click="copyToClipboard(msg.content, index)" :title="copiedMessageIndex === index ? 'Copié !' : 'Copier'" class="flex items-center gap-1 px-2 py-1 rounded-lg bg-card border border-border/70 text-[9px] font-bold text-muted-foreground hover:text-foreground hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
                  <svg v-if="copiedMessageIndex === index" xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  {{ copiedMessageIndex === index ? 'Copié' : 'Copier' }}
                </button>
                <button @click="printSingleMessage(msg.content, activeApp ? `JobTracker — ${activeApp.company_name}` : 'JobTracker')" title="PDF" class="flex items-center gap-1 px-2 py-1 rounded-lg bg-card border border-border/70 text-[9px] font-bold text-muted-foreground hover:text-foreground hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  PDF
                </button>
                <button @click="deleteSingleMessage(msg, index)" title="Supprimer" class="flex items-center gap-1 px-2 py-1 rounded-lg bg-card border border-border/70 text-[9px] font-bold text-muted-foreground hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
                <div v-if="activeApp" class="flex gap-1 ml-0.5 pl-2 border-l border-border/50">
                  <button @click="triggerShortcut('coverLetter')" :disabled="loading" class="px-2 py-1 rounded-lg bg-card border border-border/70 text-[9px] font-bold text-muted-foreground hover:text-violet-600 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">✉️ Lettre</button>
                  <button @click="triggerShortcut('followUp')" :disabled="loading" class="px-2 py-1 rounded-lg bg-card border border-border/70 text-[9px] font-bold text-muted-foreground hover:text-sky-600 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">📩 Relance</button>
                  <button @click="triggerShortcut('interview')" :disabled="loading" class="px-2 py-1 rounded-lg bg-card border border-border/70 text-[9px] font-bold text-muted-foreground hover:text-emerald-600 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">🤝 Entretien</button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- AI Thinking -->
        <div v-if="loading" class="flex items-end gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <div class="bg-card/90 border border-border/60 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2 shadow-sm">
            <div class="flex gap-1">
              <span class="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style="animation-delay:0ms"></span>
              <span class="h-1.5 w-1.5 bg-violet-500 rounded-full animate-bounce" style="animation-delay:150ms"></span>
              <span class="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
            </div>
            <span class="text-[10px] text-muted-foreground font-medium">L'IA réfléchit...</span>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mx-4 mb-3 p-3 bg-red-500/8 border border-red-500/20 text-red-500 rounded-xl text-xs flex gap-2.5 items-start z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div class="flex-1">
          <p class="font-bold">Erreur</p>
          <p class="mt-0.5 opacity-80 text-[10px]">{{ errorMessage }}</p>
          <button @click="useMock = true; errorMessage = null" class="mt-1.5 text-[9px] uppercase tracking-wide font-bold underline hover:opacity-70">Activer le Mode Démo</button>
        </div>
        <button @click="errorMessage = null" class="shrink-0 opacity-60 hover:opacity-100 transition-opacity"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>

      <!-- Chat Input -->
      <div class="px-4 pb-4 pt-3 border-t border-border/60 bg-card/90 backdrop-blur-md z-10 relative">
        <form @submit.prevent="sendMessage" class="flex gap-2 items-end">
          <textarea 
            v-model="inputMessage"
            @keydown.enter.exact.prevent="sendMessage"
            rows="1"
            placeholder="Posez votre question… (Entrée pour envoyer)"
            class="flex-1 resize-none bg-muted/40 border border-border/70 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all max-h-32 min-h-[38px] placeholder:text-muted-foreground/50"
            :disabled="loading || loadingHistory"
          ></textarea>
          <button 
            type="submit" 
            :disabled="loading || loadingHistory || !inputMessage.trim()"
            class="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-200"
            title="Envoyer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>

    </div>

  </div>

  <!-- Deletion Confirmation Modal -->
  <Teleport to="body">
    <div v-if="showDeleteConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-md" @click="showDeleteConfirmModal = false" />
      <div class="relative w-full max-w-sm bg-card border border-border/60 rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-foreground">Effacer la discussion ?</h3>
            <p class="text-[10px] text-muted-foreground mt-0.5">Cette action est irréversible.</p>
          </div>
        </div>
        <p class="text-xs text-muted-foreground leading-relaxed bg-muted/50 rounded-xl p-3">
          Tout l'historique des messages de cette conversation sera définitivement supprimé de votre compte.
        </p>
        <div class="flex justify-end gap-2">
          <button @click="showDeleteConfirmModal = false" class="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            Annuler
          </button>
          <button @click="confirmClearConversation" class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-500/20 hover:scale-[1.02] transition-all">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useApplicationsStore } from '~/stores/applications'

definePageMeta({ layout: 'assistant' })

const store = useApplicationsStore()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()
const router = useRouter()

const activeApp = ref<any | null>(null)
const inputMessage = ref('')
const loading = ref(false)
const loadingHistory = ref(false)
const errorMessage = ref<string | null>(null)
const useMock = ref(false)
const messageContainer = ref<HTMLDivElement | null>(null)
const copiedMessageIndex = ref<number | null>(null)
const showDeleteConfirmModal = ref(false)

interface Message {
  id?: string
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([])

// Check route queries for automatic generation redirect
watch(
  [() => store.applications, () => route.query],
  ([newApps, newQuery]) => {
    if (newApps && newApps.length && newQuery.appId && newQuery.generate) {
      const queryAppId = newQuery.appId as string
      const queryGenerate = newQuery.generate as string
      const found = newApps.find(a => a.id === queryAppId)
      if (found) {
        activeApp.value = found
        // Trigger shortcut after a short delay to allow context loading
        nextTick(() => {
          setTimeout(() => {
            if (queryGenerate === 'coverLetter') {
              triggerShortcut('coverLetter')
            } else if (queryGenerate === 'followUp') {
              triggerShortcut('followUp')
            } else if (queryGenerate === 'interview') {
              triggerShortcut('interview')
            }
          }, 300)
        })
        // Clean query params so refresh doesn't trigger again
        router.replace({ path: route.path })
      }
    }
  },
  { immediate: true, deep: true }
)

// Monitor application selection changes to reload history
watch(activeApp, () => {
  fetchChatHistory()
}, { immediate: true })

// Ensure applications list is ready
onMounted(() => {
  if (user.value) {
    store.fetchApplications()
  }
})

// Auto scroll to bottom
function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

// Helper to get authenticated user ID reliably (Nuxt SSR/hydration friendly fallback)
async function getUserId() {
  if (user.value?.id) return user.value.id
  const { data } = await supabase.auth.getUser()
  return data.user?.id || null
}

// Fetch chat logs from database
async function fetchChatHistory() {
  const userId = await getUserId()
  if (!userId) {
    // Guest or not logged-in, reset local chat to welcome greeting
    messages.value = [
      { 
        role: 'assistant', 
        content: activeApp.value 
          ? `Bonjour ! Je suis votre assistant virtuel JobTracker. Je suis prêt à vous aider pour concevoir ou préparer des candidatures chez **${activeApp.value.company_name}**.` 
          : 'Bonjour ! Je suis votre assistant virtuel JobTracker. Je peux vous aider à rédiger des lettres de motivation, à concevoir des e-mails de relance, ou à vous préparer à des entretiens d\'embauche. Sélectionnez une candidature pour commencer.' 
      }
    ]
    scrollToBottom()
    return
  }

  loadingHistory.value = true
  errorMessage.value = null
  try {
    let query = supabase
      .from('ia_chat_messages')
      .select('id, role, content')
      .order('created_at', { ascending: true })

    if (activeApp.value) {
      query = query.eq('application_id', activeApp.value.id)
    } else {
      query = query.is('application_id', null)
    }

    const { data, error } = await query
    if (error) throw error

    if (data && data.length > 0) {
      messages.value = data as Message[]
    } else {
      // Default welcome greeting
      messages.value = [
        { 
          role: 'assistant', 
          content: activeApp.value 
            ? `Bonjour ! Je suis votre assistant virtuel JobTracker. Je suis prêt à vous aider pour concevoir ou préparer des candidatures chez **${activeApp.value.company_name}**.` 
            : 'Bonjour ! Je suis votre assistant virtuel JobTracker. Je peux vous aider à rédiger des lettres de motivation, à concevoir des e-mails de relance, ou à vous préparer à des entretiens d\'embauche. Sélectionnez une candidature pour commencer.' 
        }
      ]
    }
  } catch (err: any) {
    console.error('Error fetching chat history:', err)
    errorMessage.value = `Impossible de charger l'historique : ${err.message}`
  } finally {
    loadingHistory.value = false
    scrollToBottom()
  }
}

// Markdown formatting helper
function formatMessage(text: string): string {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Headers: ###, ##, #
  html = html.replace(/^###\s+(.*)$/gm, '<h4 class="text-xs font-bold mt-3 mb-1 text-indigo-600 dark:text-indigo-400">$1</h4>')
  html = html.replace(/^##\s+(.*)$/gm, '<h3 class="text-sm font-bold mt-4 mb-1 text-foreground border-b pb-0.5">$1</h3>')
  html = html.replace(/^#\s+(.*)$/gm, '<h2 class="text-base font-bold mt-5 mb-2 text-foreground">$1</h2>')

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-indigo-700 dark:text-indigo-300">$1</strong>')

  // Bullet points
  html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li class="ml-4 list-disc my-0.5">$1</li>')

  // Convert newlines to br
  html = html.replace(/\n/g, '<br>')

  return html
}

// Mobile selection mapping
function onMobileSelectChange(e: Event) {
  const target = e.target as HTMLSelectElement
  const val = target.value
  if (!val) {
    activeApp.value = null
  } else {
    const found = store.applications.find(a => a.id === val)
    activeApp.value = found || null
  }
}

// Active shortcut memory
const activeShortcut = ref<'cover_letter' | 'follow_up' | 'interview_prep' | null>(null)

// Send message action
async function sendMessage() {
  if (!inputMessage.value.trim() || loading.value) return
  
  errorMessage.value = null
  const userText = inputMessage.value
  inputMessage.value = ''
  
  const userMsgIndex = messages.value.length
  messages.value.push({ role: 'user', content: userText })
  scrollToBottom()
  
  loading.value = true

  // Save user query to DB (Async, non-blocking)
  getUserId().then(userId => {
    if (userId) {
      supabase.from('ia_chat_messages').insert({
        application_id: activeApp.value?.id || null,
        user_id: userId,
        role: 'user',
        content: userText
      }).select('id').single().then(({ data, error }) => {
        if (error) console.error('Error saving user message:', error)
        if (data && data.id) {
          messages.value[userMsgIndex].id = data.id
        }
      })
    }
  })
  
  // Capture current active shortcut type and reset it for the next manual message
  const currentShortcut = activeShortcut.value
  activeShortcut.value = null

  try {
    let replyText = ''

    if (useMock.value) {
      // Simulate mock response
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const lower = userText.toLowerCase()
      if (lower.includes('lettre') || lower.includes('motivation')) {
        replyText = getMockTemplate('coverLetter')
      } else if (lower.includes('relance') || lower.includes('mail')) {
        replyText = getMockTemplate('followUp')
      } else if (lower.includes('entretien') || lower.includes('préparer')) {
        replyText = getMockTemplate('interview')
      } else {
        replyText = "Ceci est une réponse générique en mode Démo. Activez l'API Zhipu dans Supabase pour obtenir des réponses personnalisées par l'IA."
      }
    } else {
      // Invoke Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          messages: messages.value.map(m => ({ role: m.role, content: m.content })),
          context: activeApp.value ? {
            company_name: activeApp.value.company_name,
            job_profile: activeApp.value.job_profile,
            proposed_salary: activeApp.value.proposed_salary,
            url: activeApp.value.url,
            main_missions: activeApp.value.main_missions,
            primary_skills: activeApp.value.primary_skills,
            company_feedback: activeApp.value.company_feedback
          } : null
        }
      })

      if (error) {
        let errorMsg = error.message
        try {
          if (error.context) {
            const errBody = await error.context.json()
            if (errBody && errBody.error) {
              errorMsg = errBody.error
            }
          }
        } catch (e) {
          console.error('Failed to parse error context:', e)
        }
        throw new Error(errorMsg)
      }

      if (!data || !data.content) {
        throw new Error("Réponse vide de la fonction IA.")
      }
      replyText = data.content
    }

    // Add assistant reply to stream
    const assistantMsgIndex = messages.value.length
    messages.value.push({ role: 'assistant', content: replyText })
    scrollToBottom()

    // Save assistant response to DB
    getUserId().then(userId => {
      if (userId) {
        supabase.from('ia_chat_messages').insert({
          application_id: activeApp.value?.id || null,
          user_id: userId,
          role: 'assistant',
          content: replyText
        }).select('id').single().then(({ data, error }) => {
          if (error) console.error('Error saving assistant message:', error)
          if (data && data.id) {
            messages.value[assistantMsgIndex].id = data.id
          }
        })

        // Silently save content generated via shortcut to ia_contents table
        if (activeApp.value && currentShortcut) {
          saveContentToAppSilently(replyText, currentShortcut)
        }
      }
    })
  } catch (err: any) {
    console.error('Error in sendMessage:', err)
    errorMessage.value = err.message || "Failed to communicate with AI Assistant."
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

// Delete single message from DB and stream
async function deleteSingleMessage(msg: Message, index: number) {
  // Remove locally immediately for snappy responsiveness
  messages.value.splice(index, 1)
  
  // If the chat is completely empty now, add a default greeting
  if (messages.value.length === 0) {
    messages.value = [
      { 
        role: 'assistant', 
        content: activeApp.value 
          ? `Bonjour ! Je suis votre assistant virtuel JobTracker. Je suis prêt à vous aider pour concevoir ou préparer des candidatures chez **${activeApp.value.company_name}**.` 
          : 'Bonjour ! Je suis votre assistant virtuel JobTracker. Je peux vous aider à rédiger des lettres de motivation, à concevoir des e-mails de relance, ou à vous préparer à des entretiens d\'embauche. Sélectionnez une candidature pour commencer.' 
      }
    ]
  }

  if (msg.id) {
    const userId = await getUserId()
    if (userId) {
      try {
        const { error } = await supabase
          .from('ia_chat_messages')
          .delete()
          .eq('id', msg.id)
        if (error) throw error
      } catch (err) {
        console.error('Error deleting message:', err)
      }
    }
  }
}

// Clear all active conversation messages
async function clearActiveConversation() {
  showDeleteConfirmModal.value = true
}

async function confirmClearConversation() {
  showDeleteConfirmModal.value = false
  errorMessage.value = null
  loadingHistory.value = true

  try {
    const userId = await getUserId()
    if (userId) {
      let deleteQuery = supabase.from('ia_chat_messages').delete().eq('user_id', userId)
      if (activeApp.value) {
        if (!activeApp.value.id) {
          throw new Error("L'identifiant de la candidature est manquant.")
        }
        deleteQuery = deleteQuery.eq('application_id', activeApp.value.id)
      } else {
        deleteQuery = deleteQuery.is('application_id', null)
      }
      
      const { error } = await deleteQuery
      if (error) throw error
    }

    // Reset local chat (for both logged-in and guest users)
    messages.value = [
      { 
        role: 'assistant', 
        content: activeApp.value 
          ? `Bonjour ! Je suis votre assistant virtuel JobTracker. Je suis prêt à vous aider pour concevoir ou préparer des candidatures chez **${activeApp.value.company_name}**.` 
          : 'Bonjour ! Je suis votre assistant virtuel JobTracker. Je peux vous aider à rédiger des lettres de motivation, à concevoir des e-mails de relance, ou à vous préparer à des entretiens d\'embauche. Sélectionnez une candidature pour commencer.' 
      }
    ]
  } catch (err: any) {
    console.error('Error clearing conversation:', err)
    errorMessage.value = `Impossible d'effacer la discussion : ${err.message}`
  } finally {
    loadingHistory.value = false
    scrollToBottom()
  }
}

// Shortcut triggers
function triggerShortcut(type: 'coverLetter' | 'followUp' | 'interview') {
  if (!activeApp.value) return
  
  let promptText = ''
  if (type === 'coverLetter') {
    promptText = `Rédige-moi une lettre de motivation personnalisée pour ma candidature chez ${activeApp.value.company_name} pour le poste de ${activeApp.value.job_profile || 'collaborateur'}.`
    activeShortcut.value = 'cover_letter'
  } else if (type === 'followUp') {
    promptText = `Rédige-moi un e-mail professionnel pour relancer ${activeApp.value.company_name} suite à ma candidature pour le poste de ${activeApp.value.job_profile || 'collaborateur'}.`
    activeShortcut.value = 'follow_up'
  } else if (type === 'interview') {
    promptText = `Prépare-moi des questions d'entretien d'embauche spécifiques pour le poste de ${activeApp.value.job_profile || 'collaborateur'} chez ${activeApp.value.company_name} et donne-moi des pistes pour y répondre.`
    activeShortcut.value = 'interview_prep'
  }

  inputMessage.value = promptText
  sendMessage()
}

// Generate mock copy with template replacement
function getMockTemplate(type: 'coverLetter' | 'followUp' | 'interview'): string {
  const company = activeApp.value?.company_name || '[Nom de l\'entreprise]'
  const role = activeApp.value?.job_profile || '[Profil du poste]'
  
  const mockTemplates = {
    coverLetter: `**[Votre Prénom] [Votre Nom]**\n[Votre Adresse]\n\nÀ l'attention de l'équipe de recrutement\n**${company}**\n\n**Objet : Candidature au poste de ${role}**\n\nMadame, Monsieur,\n\nC'est avec un vif intérêt que j'ai pris connaissance de votre opportunité pour le poste de **${role}** au sein de **${company}**.\n\nEn analysant le profil recherché, j'ai constaté que mes compétences clés correspondent précisément à vos besoins. Je serais particulièrement ravi de pouvoir contribuer aux missions de votre entreprise.\n\nJe reste disponible pour tout entretien.\n\nCordialement,\n\n**[Votre Prénom] [Votre Nom]**`,
    
    followUp: `**Sujet : Suivi de candidature - ${role} - [Votre Nom]**\n\nBonjour Madame, Monsieur,\n\nJe me permets de vous contacter pour faire suite à ma candidature déposée récemment pour le poste de **${role}** au sein de **${company}**.\n\nTrès motivé à l'idée de rejoindre vos équipes et de participer aux projets de développement de votre entreprise, je souhaitais m'assurer que mon dossier vous est bien parvenu.\n\nCordialement,\n\n**[Votre Prénom] [Votre Nom]**`,
    
    interview: `### Préparation à l'entretien - ${role} chez ${company}\n\nVoici 3 questions d'entraînement adaptées :\n\n1. **Pourquoi postulez-vous chez ${company} ?**\n   * *Piste* : Valorisez la culture et les objectifs de l'entreprise.\n2. **Qu'avez-vous compris des enjeux du rôle de ${role} ?**\n   * *Piste* : Reliez cela aux missions clés du descriptif.\n3. **Parlez-moi d'une compétence que vous maîtrisez.**\n   * *Piste* : Donnez un exemple de situation concrète.`
  }
  
  return mockTemplates[type]
}

// Silent saving to DB
async function saveContentToAppSilently(content: string, type: 'cover_letter' | 'follow_up' | 'interview_prep') {
  if (!activeApp.value) return
  const userId = await getUserId()
  if (!userId) return
  try {
    await supabase.from('ia_contents').upsert({
      application_id: activeApp.value.id,
      user_id: userId,
      content_type: type,
      content: content
    }, {
      onConflict: 'application_id,content_type'
    })
  } catch (err) {
    console.error('Error saving AI content silently:', err)
  }
}

// Clipboard copying utility (no alert)
function copyToClipboard(text: string, index?: number) {
  if (!text) return
  navigator.clipboard.writeText(text)
  if (index !== undefined) {
    copiedMessageIndex.value = index
    setTimeout(() => {
      if (copiedMessageIndex.value === index) {
        copiedMessageIndex.value = null
      }
    }, 2000)
  }
}

// Print single message layout as PDF
function printSingleMessage(content: string, title: string) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert("Veuillez autoriser les fenêtres contextuelles (pop-ups) pour imprimer.")
    return
  }

  const formattedHtml = formatMessage(content)
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', -apple-system, sans-serif;
            padding: 40px;
            color: #09090b;
            background: #ffffff;
            line-height: 1.6;
            font-size: 13px;
          }
          h2, h3, h4, h5 {
            font-weight: 700;
            color: #4f46e5;
            margin-top: 20px;
            margin-bottom: 8px;
          }
          strong {
            font-weight: 600;
            color: #1e1b4b;
          }
          pre {
            white-space: pre-wrap;
            font-family: inherit;
          }
          li {
            margin-bottom: 6px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div style="border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 24px;">
          <h2 style="margin: 0; font-size: 18px; text-transform: uppercase; tracking: 0.5px;">JobTracker AI Document</h2>
          <div style="font-size: 11px; color: #71717a; margin-top: 4px;">Rapport généré automatiquement</div>
        </div>
        <div>${formattedHtml}</div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          }
        <\/script>
      </body>
    </html>
  `
  printWindow.document.write(html)
  printWindow.document.close()
}
</script>
