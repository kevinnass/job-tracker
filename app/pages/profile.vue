<template>
  <div class="max-w-6xl mx-auto px-4 py-10 space-y-8 animate-fade-in">

    <!-- Page Header -->
    <div class="relative overflow-hidden rounded-2xl bg-black p-8 text-white shadow-xl shadow-indigo-500/20">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
        <div class="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
      </div>
      <div class="relative flex items-start gap-5">
        <!-- Avatar Icon -->
        <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-black text-white tracking-tight">Mon Profil</h1>
          <p class="text-white/70 text-sm mt-1 leading-relaxed">
            Complétez votre profil pour que l'IA génère des lettres de motivation et e-mails de relance personnalisés avec vos vraies informations.
          </p>
          <!-- Completeness bar -->
          <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3 w-64">
              <div class="flex-1 h-1.5 rounded-full bg-white/20">
                <div class="h-1.5 rounded-full bg-white transition-all duration-500" :style="{ width: completenessPercent + '%' }"></div>
              </div>
              <span class="text-[10px] font-bold text-white/80 shrink-0">{{ completenessPercent }}% complet</span>
            </div>
            
            <div v-if="!isEditing" class="flex items-center gap-3">
              <button @click="isEditing = true" class="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Éditer le profil
              </button>
              <button @click="deleteProfile" :disabled="saving" class="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                Supprimer le profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Alerts -->
    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
      <div v-if="successMessage" class="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span class="font-semibold">{{ successMessage }}</span>
        <button @click="successMessage = null" class="ml-auto opacity-60 hover:opacity-100"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </Transition>
    <div v-if="errorMessage" class="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-500 text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span class="font-semibold">{{ errorMessage }}</span>
      <button @click="errorMessage = null" class="ml-auto opacity-60 hover:opacity-100"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>

    <!-- Main Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      <!-- LEFT SIDEBAR: Personal Identity, Contact Links, CV Upload & Education -->
      <div class="space-y-6 lg:col-span-1">

        <!-- Identity & Contact Info Card -->
        <div class="bg-white dark:bg-zinc-900/90 border border-slate-150 dark:border-zinc-800/60 rounded-3xl overflow-hidden shadow-2xl shadow-slate-100 dark:shadow-black/5">
          <!-- Read-Only State for Identity -->
          <div class="p-8 flex flex-col items-center text-center animate-fade-in" v-if="!isEditing">
            <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-950 dark:from-zinc-800 dark:via-zinc-900 dark:to-black flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-zinc-500/20">
              {{ form.full_name ? form.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U' }}
            </div>
            
            <h2 class="text-xl font-black text-slate-900 dark:text-white mt-4 tracking-tight leading-tight">
              {{ form.full_name || 'Votre Nom' }}
            </h2>
            <p class="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-500/10 px-3.5 py-1 rounded-full mt-2 inline-block">
              {{ form.job_title || 'Titre de poste non renseigné' }}
            </p>

            <div class="w-full border-t border-slate-100 dark:border-zinc-800/80 my-6"></div>

            <!-- Clickable Pill Links -->
            <div class="w-full space-y-3">
              <a v-if="form.linkedin_url" :href="form.linkedin_url" target="_blank" class="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 hover:bg-zinc-500/10 dark:hover:bg-zinc-500/10 hover:text-zinc-900 dark:hover:text-zinc-100 border border-slate-100 dark:border-zinc-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm hover:scale-[1.02] active:scale-100">
                <svg class="w-4 h-4 text-zinc-500 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                Profil LinkedIn
              </a>
              <a v-if="form.portfolio_url" :href="form.portfolio_url" target="_blank" class="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 hover:bg-zinc-500/10 dark:hover:bg-zinc-500/10 hover:text-zinc-900 dark:hover:text-zinc-100 border border-slate-100 dark:border-zinc-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all shadow-sm hover:scale-[1.02] active:scale-100">
                <svg class="w-4 h-4 text-zinc-500 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Portfolio / Site Web
              </a>
              <p v-if="!form.linkedin_url && !form.portfolio_url" class="text-xs text-slate-400 dark:text-zinc-650 italic py-2">
                Aucun lien de contact configuré.
              </p>
            </div>
          </div>

          <!-- Edit Mode for Identity & Contacts -->
          <div class="p-8 space-y-6 animate-fade-in" v-else>
            <h3 class="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Contact & Identité
            </h3>

            <div>
              <label class="profile-label">Nom complet *</label>
              <input v-model="form.full_name" type="text" placeholder="Prénom Nom" class="profile-input" />
            </div>

            <div>
              <label class="profile-label">Titre de poste visé</label>
              <input v-model="form.job_title" type="text" placeholder="ex: Développeur Full-Stack" class="profile-input" />
            </div>

            <div class="border-t border-slate-150 dark:border-zinc-800/80 pt-4 my-2"></div>

            <div>
              <label class="profile-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                Lien LinkedIn
              </label>
              <input v-model="form.linkedin_url" type="url" placeholder="https://linkedin.com/in/votre-profil" class="profile-input" />
            </div>

            <div>
              <label class="profile-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Portfolio ou Site Web
              </label>
              <input v-model="form.portfolio_url" type="url" placeholder="https://votre-site.com" class="profile-input" />
            </div>
          </div>
        </div>

        <!-- CV Upload Card -->
        <div class="bg-white dark:bg-zinc-900/90 border border-slate-150 dark:border-zinc-800/60 rounded-3xl overflow-hidden shadow-2xl shadow-slate-100 dark:shadow-black/5">
          <div class="px-8 py-6 border-b border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/40 dark:bg-zinc-950/30">
            <h2 class="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              CV & Documents
            </h2>
          </div>
          <div class="p-8 space-y-6">
            <!-- Drop Zone (Only visible when editing) -->
            <div v-if="isEditing"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="fileInput?.click()"
              class="relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group"
              :class="isDragging 
                ? 'border-zinc-500 bg-zinc-500/10 scale-[1.02]' 
                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-950/20 hover:border-zinc-400/50'"
            >
              <input ref="fileInput" type="file" accept=".pdf,.docx" class="hidden" @change="handleFileSelect" />
              <div class="flex flex-col items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div>
                  <p class="text-xs font-black text-slate-800 dark:text-slate-200">Mettre à jour le CV</p>
                  <p class="text-[10px] font-medium text-slate-500 mt-0.5">Glissez ou cliquez</p>
                </div>
              </div>
            </div>

            <!-- Upload error -->
            <p v-if="uploadError" class="text-[10px] text-red-500 font-semibold bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-2">{{ uploadError }}</p>

            <!-- Selected file info -->
            <div v-if="selectedFile" class="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border border-border/50 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span class="font-semibold truncate flex-1">{{ selectedFile.name }}</span>
              <span class="text-muted-foreground shrink-0">{{ (selectedFile.size / 1024 / 1024).toFixed(1) }} Mo</span>
            </div>

            <!-- Existing CV indicator -->
            <div v-if="existingCvPath && !selectedFile" class="flex items-center justify-between p-3 bg-emerald-500/8 dark:bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-xs">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span class="font-bold text-emerald-700 dark:text-emerald-400">CV chargé</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-semibold opacity-65 mr-1">cv.pdf</span>
                <button @click="viewCv" type="button" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold transition-all text-[10px] active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Voir
                </button>
              </div>
            </div>

            <!-- Empty state in read-only mode -->
            <div v-else-if="!isEditing" class="text-center py-6 text-muted-foreground bg-slate-50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p class="text-xs font-semibold text-slate-400">Aucun CV chargé</p>
            </div>

            <button
              v-if="isEditing"
              @click="uploadAndParseCv"
              :disabled="!selectedFile || uploadLoading"
              class="w-full h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2"
            >
              <div v-if="uploadLoading" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0"></div>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ uploadLoading ? 'Analyse en cours...' : 'Lancer l\'analyse' }}
            </button>
          </div>
        </div>

        <!-- Education Card (moved below CV Upload Card) -->
        <div class="bg-white dark:bg-zinc-900/90 border border-slate-150 dark:border-zinc-800/60 rounded-3xl overflow-hidden shadow-2xl shadow-slate-100 dark:shadow-black/5">
          <div class="px-8 py-6 border-b border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/40 dark:bg-zinc-950/30 flex flex-wrap gap-4 items-center justify-between">
            <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-500/10 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              Formation
            </h2>
            <button v-if="isEditing" @click="addEducation" class="flex items-center gap-1.5 text-sm font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-150 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2 rounded-xl transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Ajouter
            </button>
          </div>
          
          <div class="p-8">
            <!-- Empty state -->
            <div v-if="form.education.length === 0" class="text-center py-8 text-muted-foreground bg-slate-50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mx-auto mb-2 opacity-30 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              <p class="text-xs font-semibold">Aucune formation renseignée</p>
            </div>

            <!-- Read Only: Beautiful timeline view -->
            <div v-else-if="!isEditing" class="relative border-l-2 border-zinc-250 dark:border-zinc-800 ml-4 pl-6 space-y-6">
              <div v-for="(edu, i) in form.education" :key="i" class="relative">
                <div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-zinc-650 border-4 border-white dark:border-zinc-900 shadow-sm"></div>
                <div>
                  <h3 class="text-base font-bold text-slate-800 dark:text-slate-100">{{ edu.degree || 'Diplôme non spécifié' }}</h3>
                  <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
                    <span>{{ edu.institution || 'Établissement non spécifié' }}</span>
                    <span class="text-slate-350 dark:text-zinc-700">•</span>
                    <span>{{ edu.year || '?' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Edit Mode: Form inputs view -->
            <div v-else class="space-y-6">
              <div v-for="(edu, i) in form.education" :key="i" class="bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-6 relative group transition-all duration-300 hover:bg-white dark:hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-zinc-500/5">
                <button @click="removeEducation(i)" class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-zinc-700 shadow-md border border-zinc-100 dark:border-zinc-600 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-500/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
                  <div class="sm:col-span-2">
                    <label class="profile-label">Diplôme / Formation</label>
                    <input v-model="edu.degree" type="text" placeholder="ex: Master Informatique" class="profile-input" />
                  </div>
                  <div>
                    <label class="profile-label">Année</label>
                    <input v-model="edu.year" type="text" placeholder="ex: 2021" class="profile-input" />
                  </div>
                  <div class="sm:col-span-3">
                    <label class="profile-label">Établissement</label>
                    <input v-model="edu.institution" type="text" placeholder="ex: Université Paris-Saclay" class="profile-input mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT SIDE: Presentation, Experience -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Presentation & Skills Card -->
        <div class="bg-white dark:bg-zinc-900/90 border border-slate-150 dark:border-zinc-800/60 rounded-3xl overflow-hidden shadow-2xl shadow-slate-100 dark:shadow-black/5">
          <div class="px-8 py-6 border-b border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/40 dark:bg-zinc-950/30">
            <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-500/10 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </div>
              Présentation & Compétences
            </h2>
          </div>
          <div class="p-8 space-y-6">
            <!-- Professional Summary -->
            <div>
              <label class="profile-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
                Résumé professionnel
              </label>
              <p v-if="isEditing" class="text-xs text-muted-foreground mb-2 -mt-1 ml-[1.6rem]">Une brève présentation de votre parcours et de vos objectifs.</p>
              
              <div v-if="!isEditing" class="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
                {{ form.professional_summary || 'Aucun résumé défini.' }}
              </div>
              <textarea v-else v-model="form.professional_summary" rows="4" placeholder="Décrivez votre parcours, vos atouts et vos objectifs professionnels..." class="profile-input resize-none"></textarea>
            </div>

            <!-- Skills & Languages (Grid columns) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-zinc-800/80">
              
              <!-- Key Skills -->
              <div>
                <label class="profile-label">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/></svg>
                  Compétences clés
                </label>
                <p v-if="isEditing" class="text-[10px] text-muted-foreground mb-2 -mt-1 ml-[1.6rem]">Séparez par des virgules + Entrée.</p>
                <input v-if="isEditing" v-model="skillsInput" type="text" placeholder="ex: Vue.js, TypeScript, SQL" class="profile-input" @blur="syncSkills" @keydown.enter.prevent="syncSkills" />
                
                <div v-if="form.skills.length > 0" class="flex flex-wrap gap-1.5 mt-3 max-h-36 overflow-y-auto pr-2 custom-scrollbar">
                  <span v-for="(skill, i) in form.skills" :key="i" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 shadow-sm transition-all" :class="{ 'hover:shadow-md hover:-translate-y-0.5': isEditing }">
                    {{ skill }}
                    <button v-if="isEditing" @click="removeSkill(i)" class="opacity-50 hover:opacity-100 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </span>
                </div>
                <p v-else class="text-xs text-slate-400 dark:text-zinc-650 italic mt-2">Aucune compétence enregistrée.</p>
              </div>

              <!-- Languages -->
              <div>
                <label class="profile-label">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Langues parlées
                </label>
                <p v-if="isEditing" class="text-[10px] text-muted-foreground mb-2 -mt-1 ml-[1.6rem]">Séparez par des virgules + Entrée.</p>
                <input v-if="isEditing" v-model="languagesInput" type="text" placeholder="ex: Français, Anglais" class="profile-input" @blur="syncLanguages" @keydown.enter.prevent="syncLanguages" />
                
                <div v-if="form.languages.length > 0" class="flex flex-wrap gap-1.5 mt-3 max-h-36 overflow-y-auto pr-2 custom-scrollbar">
                  <span v-for="(lang, i) in form.languages" :key="i" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 shadow-sm transition-all" :class="{ 'hover:shadow-md hover:-translate-y-0.5': isEditing }">
                    {{ lang }}
                    <button v-if="isEditing" @click="removeLanguage(i)" class="opacity-50 hover:opacity-100 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </span>
                </div>
                <p v-else class="text-xs text-slate-400 dark:text-zinc-650 italic mt-2">Aucune langue enregistrée.</p>
              </div>

            </div>
          </div>
        </div>

        <!-- Experience Card -->
        <div class="bg-white dark:bg-zinc-900/90 border border-slate-150 dark:border-zinc-800/60 rounded-3xl overflow-hidden shadow-2xl shadow-slate-100 dark:shadow-black/5">
          <div class="px-8 py-6 border-b border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/40 dark:bg-zinc-950/30 flex flex-wrap gap-4 items-center justify-between">
            <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-500/10 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              Expériences professionnelles
            </h2>
            <button v-if="isEditing" @click="addExperience" class="flex items-center gap-1.5 text-sm font-bold text-zinc-900 dark:text-zinc-100 bg-zinc-150 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-4 py-2 rounded-xl transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Ajouter
            </button>
          </div>
          
          <div class="p-8">
            <!-- Empty state -->
            <div v-if="form.experience.length === 0" class="text-center py-8 text-muted-foreground bg-slate-50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-250 dark:border-zinc-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mx-auto mb-2 opacity-30 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <p class="text-xs font-semibold">Aucune expérience renseignée</p>
            </div>

            <!-- Read Only: Beautiful timeline view -->
            <div v-else-if="!isEditing" class="relative border-l-2 border-zinc-250 dark:border-zinc-800 ml-4 pl-6 space-y-6">
              <div v-for="(exp, i) in form.experience" :key="i" class="relative">
                <div class="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-zinc-650 border-4 border-white dark:border-zinc-900 shadow-sm"></div>
                <div>
                  <h3 class="text-base font-bold text-slate-800 dark:text-slate-100">{{ exp.title || 'Poste sans nom' }}</h3>
                  <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
                    <span>{{ exp.company || 'Entreprise non spécifiée' }}</span>
                    <span class="text-slate-350 dark:text-zinc-700">•</span>
                    <span>{{ exp.start || '?' }} — {{ exp.end || '?' }}</span>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-line leading-relaxed">{{ exp.description || 'Pas de description de mission.' }}</p>
                </div>
              </div>
            </div>

            <!-- Edit Mode: Form inputs view -->
            <div v-else class="space-y-6">
              <div v-for="(exp, i) in form.experience" :key="i" class="bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl p-6 relative group transition-all duration-300 hover:bg-white dark:hover:bg-zinc-800/60 hover:shadow-xl hover:shadow-zinc-500/5">
                <button @click="removeExperience(i)" class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white dark:bg-zinc-700 shadow-md border border-zinc-100 dark:border-zinc-600 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-5">
                  <div>
                    <label class="profile-label">Intitulé du poste</label>
                    <input v-model="exp.title" type="text" placeholder="ex: Développeur Front-End" class="profile-input" />
                  </div>
                  <div>
                    <label class="profile-label">Entreprise</label>
                    <input v-model="exp.company" type="text" placeholder="ex: ACME Corp" class="profile-input" />
                  </div>
                  <div>
                    <label class="profile-label">Date de début</label>
                    <input v-model="exp.start" type="text" placeholder="ex: 01/2022 ou 2022" class="profile-input" />
                  </div>
                  <div>
                    <label class="profile-label">Date de fin</label>
                    <input v-model="exp.end" type="text" placeholder="ex: 12/2023 ou Présent" class="profile-input" />
                  </div>
                </div>
                <div>
                  <label class="profile-label">Description des missions</label>
                  <textarea v-model="exp.description" rows="3" placeholder="Décrivez vos principales missions et réalisations..." class="profile-input resize-none mt-1"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save & Cancel Action Bar -->
        <div v-if="isEditing" class="flex justify-end gap-4 mt-6">
          <button
            @click="cancelEditing"
            class="px-6 h-11 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all"
          >
            Annuler
          </button>
          <button
            @click="saveProfile"
            :disabled="saving"
            class="flex items-center gap-2.5 px-8 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-sm shadow-md transition-all duration-200"
          >
            <div v-if="saving" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0"></div>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {{ saving ? 'Enregistrement...' : 'Enregistrer le profil' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const isEditing = ref(true)

// ── Form State ─────────────────────────────────────────────────────────────────

interface Experience {
  title: string
  company: string
  start: string
  end: string
  description: string
}

interface Education {
  degree: string
  institution: string
  year: string
}

const form = reactive({
  full_name: '',
  job_title: '',
  professional_summary: '',
  skills: [] as string[],
  languages: [] as string[],
  experience: [] as Experience[],
  education: [] as Education[],
  linkedin_url: '',
  portfolio_url: '',
})

// Tag input helpers
const skillsInput = ref('')
const languagesInput = ref('')

function syncSkills() {
  if (!skillsInput.value.trim()) return
  const parsed = skillsInput.value.split(',').map(s => s.trim()).filter(Boolean)
  form.skills = [...new Set([...form.skills, ...parsed])]
  skillsInput.value = ''
}

function syncLanguages() {
  if (!languagesInput.value.trim()) return
  const parsed = languagesInput.value.split(',').map(s => s.trim()).filter(Boolean)
  form.languages = [...new Set([...form.languages, ...parsed])]
  languagesInput.value = ''
}

function removeSkill(i: number) { form.skills.splice(i, 1) }
function removeLanguage(i: number) { form.languages.splice(i, 1) }

function addExperience() {
  form.experience.push({ title: '', company: '', start: '', end: '', description: '' })
}
function removeExperience(i: number) { form.experience.splice(i, 1) }

function addEducation() {
  form.education.push({ degree: '', institution: '', year: '' })
}
function removeEducation(i: number) { form.education.splice(i, 1) }

// ── Completeness ───────────────────────────────────────────────────────────────

const completenessPercent = computed(() => {
  let score = 0
  if (form.full_name) score += 20
  if (form.job_title) score += 15
  if (form.professional_summary) score += 20
  if (form.skills.length > 0) score += 15
  if (form.experience.length > 0) score += 20
  if (form.education.length > 0) score += 10
  return Math.min(score, 100)
})

// ── Load Profile ───────────────────────────────────────────────────────────────

const saving = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

async function getUserId() {
  if (user.value?.id) return user.value.id
  const { data } = await supabase.auth.getUser()
  return data.user?.id || null
}

async function loadProfile() {
  const userId = await getUserId()
  if (!userId) return

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error loading profile:', error)
    return
  }

  if (data) {
    form.full_name = data.full_name || ''
    form.job_title = data.job_title || ''
    form.professional_summary = data.professional_summary || ''
    form.skills = data.skills || []
    form.languages = data.languages || []
    form.experience = data.experience_json || []
    form.education = data.education_json || []
    form.linkedin_url = data.linkedin_url || ''
    form.portfolio_url = data.portfolio_url || ''
    
    // Switch to read-only mode if profile is not completely empty
    if (form.full_name) {
      isEditing.value = false
    }
  }

  // Check for existing CV in storage
  await checkExistingCv(userId)
}

async function cancelEditing() {
  isEditing.value = false
  await loadProfile()
}

onMounted(async () => {
  await loadProfile()
})

// ── Save Profile ───────────────────────────────────────────────────────────────

async function saveProfile() {
  saving.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Session utilisateur introuvable.')

    const payload = {
      user_id: userId,
      full_name: form.full_name,
      job_title: form.job_title,
      professional_summary: form.professional_summary,
      skills: form.skills,
      languages: form.languages,
      experience_json: form.experience,
      education_json: form.education,
      linkedin_url: form.linkedin_url,
      portfolio_url: form.portfolio_url,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert(payload, { onConflict: 'user_id' })

    if (error) throw error

    successMessage.value = 'Profil sauvegardé avec succès.'
    isEditing.value = false
  } catch (err: any) {
    errorMessage.value = err.message || 'Une erreur est survenue.'
  } finally {
    saving.value = false
  }
}

// ── Delete Profile ───────────────────────────────────────────────────────────────

async function deleteProfile() {
  if (!confirm('Êtes-vous sûr de vouloir supprimer votre profil ? Cette action effacera définitivement votre profil et votre CV chargé.')) {
    return
  }

  saving.value = true
  successMessage.value = null
  errorMessage.value = null

  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Session utilisateur introuvable.')

    // 1. Delete CV file from Supabase storage if it exists
    if (existingCvPath.value) {
      const { error: cvDeleteError } = await supabase.storage
        .from('cv-uploads')
        .remove([existingCvPath.value])
      
      if (cvDeleteError) {
        console.error('Error deleting CV file:', cvDeleteError)
      }
      existingCvPath.value = null
    }

    // 2. Delete profile row in Supabase table
    const { error: dbDeleteError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId)

    if (dbDeleteError) throw dbDeleteError

    // 3. Reset local form state
    form.full_name = ''
    form.job_title = ''
    form.professional_summary = ''
    form.skills = []
    form.languages = []
    form.experience = []
    form.education = []
    form.linkedin_url = ''
    form.portfolio_url = ''
    selectedFile.value = null

    // 4. Force edit mode since it's empty
    isEditing.value = true
    successMessage.value = 'Profil et CV associés supprimés avec succès.'
  } catch (err: any) {
    errorMessage.value = err.message || 'Une erreur est survenue lors de la suppression.'
    console.error('Delete profile error:', err)
  } finally {
    saving.value = false
  }
}

// ── CV Upload ──────────────────────────────────────────────────────────────────

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const uploadLoading = ref(false)
const uploadError = ref<string | null>(null)
const existingCvPath = ref<string | null>(null)

async function checkExistingCv(userId: string) {
  const { data } = await supabase.storage.from('cv-uploads').list(userId)
  if (data && data.length > 0) {
    existingCvPath.value = `${userId}/${data[0].name}`
  }
}

async function viewCv() {
  if (!existingCvPath.value) return
  try {
    const { data, error } = await supabase.storage
      .from('cv-uploads')
      .createSignedUrl(existingCvPath.value, 300)
    
    if (error) throw error
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    }
  } catch (err) {
    console.error('Error opening CV:', err)
    alert('Impossible de charger le CV.')
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) validateAndSetFile(file)
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) validateAndSetFile(file)
}

function validateAndSetFile(file: File) {
  uploadError.value = null
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'Seuls les fichiers PDF et DOCX sont acceptés.'
    selectedFile.value = null
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'Le fichier ne doit pas dépasser 5 Mo.'
    selectedFile.value = null
    return
  }
  selectedFile.value = file
}

async function uploadAndParseCv() {
  if (!selectedFile.value) return

  uploadLoading.value = true
  uploadError.value = null

  try {
    const userId = await getUserId()
    if (!userId) throw new Error('Session utilisateur introuvable.')

    const ext = selectedFile.value.name.split('.').pop()?.toLowerCase() || 'pdf'
    const filePath = `${userId}/cv.${ext}`

    // Upload to storage
    const { error: uploadErr } = await supabase.storage
      .from('cv-uploads')
      .upload(filePath, selectedFile.value, { upsert: true, contentType: selectedFile.value.type })

    if (uploadErr) throw uploadErr

    existingCvPath.value = filePath

    // Call parse-cv Edge Function
    const { data, error: parseErr } = await supabase.functions.invoke('parse-cv', {
      body: { filePath, fileType: selectedFile.value.type }
    })

    if (parseErr) throw parseErr
    if (!data?.profile) throw new Error("Aucune donnée extraite du CV.")

    // Pre-fill form with extracted data
    const p = data.profile
    if (p.full_name) form.full_name = p.full_name
    if (p.job_title) form.job_title = p.job_title
    if (p.professional_summary) form.professional_summary = p.professional_summary
    if (Array.isArray(p.skills) && p.skills.length > 0) form.skills = p.skills
    if (Array.isArray(p.languages) && p.languages.length > 0) form.languages = p.languages
    if (Array.isArray(p.experience) && p.experience.length > 0) form.experience = p.experience
    if (Array.isArray(p.education) && p.education.length > 0) form.education = p.education

    successMessage.value = 'CV analysé avec succès ! Vérifiez les informations pré-remplies ci-dessous.'
    selectedFile.value = null
  } catch (err: any) {
    uploadError.value = "L'analyse du CV a échoué. Veuillez remplir le profil manuellement."
    console.error('CV parse error:', err)
  } finally {
    uploadLoading.value = false
  }
}
</script>

<style scoped>
.profile-input {
  width: 100%;
  font-size: 0.875rem;
  padding: 0.625rem 1rem;
  height: 2.75rem;
  background: rgba(15, 23, 42, 0.015);
  border: 1.5px solid rgba(226, 232, 240, 0.8);
  border-radius: 0.875rem;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: hsl(var(--foreground));
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.dark .profile-input {
  background: rgba(255, 255, 255, 0.025);
  border: 1.5px solid rgba(63, 63, 70, 0.7);
}

.profile-input:hover:not(:disabled) {
  border-color: hsl(var(--foreground) / 0.3);
  background: rgba(15, 23, 42, 0.03);
}

.dark .profile-input:hover:not(:disabled) {
  border-color: hsl(var(--foreground) / 0.4);
  background: rgba(255, 255, 255, 0.04);
}

.profile-input:focus {
  background: hsl(var(--background));
  border-color: hsl(var(--foreground) / 0.6);
  box-shadow: 0 0 0 4px hsl(var(--foreground) / 0.08), inset 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.dark .profile-input:focus {
  background: hsl(var(--background));
  border-color: hsl(var(--foreground) / 0.6);
  box-shadow: 0 0 0 4px hsl(var(--foreground) / 0.08), inset 0 1px 2px 0 rgba(0, 0, 0, 0.02);
}

.profile-input:disabled {
  background: transparent;
  border-color: transparent;
  padding-left: 0;
  padding-right: 0;
  height: auto;
  color: hsl(var(--foreground));
  font-weight: 500;
  box-shadow: none;
  cursor: default;
  resize: none;
}

.profile-input[rows] {
  height: auto;
  padding: 0.75rem 1rem;
}

.profile-input::placeholder {
  color: hsl(var(--muted-foreground) / 0.5);
}

.profile-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: hsl(var(--foreground) / 0.85);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.profile-label svg {
  width: 1.05rem;
  height: 1.05rem;
  color: hsl(var(--foreground) / 0.45);
  opacity: 0.85;
}

.dark .profile-label svg {
  color: hsl(var(--foreground) / 0.5);
}

/* Custom internal scrollbars */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.2);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.4);
}
</style>
