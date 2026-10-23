<template>
  <div class="min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/20 selection:text-indigo-500 overflow-x-hidden">
    <!-- Ambient Background Glows -->
    <div class="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent blur-[140px] rounded-full -z-10" />
    <div class="pointer-events-none fixed top-1/2 -right-40 w-[600px] h-[500px] bg-gradient-to-tl from-indigo-500/10 via-pink-500/5 to-transparent blur-[160px] rounded-full -z-10" />

    <!-- 1. Header / Navbar -->
    <header class="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <span class="text-xs font-black text-white tracking-widest">JT</span>
          </div>
          <span class="text-sm font-black tracking-tight text-foreground uppercase">
            JobTracker
          </span>
        </NuxtLink>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-6 text-xs font-bold text-muted-foreground">
          <a href="#features" class="hover:text-foreground transition-colors">Fonctionnalités</a>
          <a href="#how-it-works" class="hover:text-foreground transition-colors">Comment ça marche</a>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <ThemeToggle />
          <NuxtLink 
            to="/login"
            class="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center gap-2 group"
          >
            <span>Démarrer</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- 2. Hero Section (Centered Vertically and Horizontally in Viewport) -->
    <section class="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center py-16 sm:py-20 space-y-10">
      
      <!-- Headline & Subtitle -->
      <div class="max-w-4xl mx-auto space-y-5">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
          Suivez vos candidatures.<br />
          <span class="text-blue-500">
            Décrochez votre prochain job.
          </span>
        </h1>
        <p class="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
          Fini le casse-tête des tableurs Excel. Centralisez vos offres, scrapez-les en 1 clic avec l’extension Chrome, analysez les salaires et missions avec l'IA et préparez vos entretiens.
        </p>
      </div>

      <!-- Hero CTAs -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        <NuxtLink 
          to="/login"
          class="w-full sm:w-auto h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 group"
        >
          <span>Démarrer</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </NuxtLink>

        <a 
          href="#features"
          class="w-full sm:w-auto h-12 px-6 rounded-2xl border border-border/80 hover:bg-muted/60 text-foreground font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
          </svg>
          Installer l'extension
        </a>
      </div>

      <!-- Trust highlights -->
      <div class="pt-2 flex items-center justify-center flex-wrap gap-6 sm:gap-10 text-xs text-muted-foreground font-medium">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>100% Gratuit</span>
        </div>
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Sans carte bancaire</span>
        </div>
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Analyse IA intégrée</span>
        </div>
      </div>

    </section>

    <!-- 3. Features Grid Section -->
    <section id="features" class="py-20 sm:py-28 border-t border-border/50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
      <div class="max-w-2xl mx-auto space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
          Fonctionnalités
        </div>
        <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Tout pour piloter votre recherche avec précision.
        </h2>
        <p class="text-sm sm:text-base text-muted-foreground">
          Découvrez une suite d'outils pensés pour les candidats exigeants qui veulent maximiser leur taux de réussite.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
        <!-- Feature 1 -->
        <div class="p-7 rounded-3xl bg-card border border-border/70 shadow-sm hover:border-indigo-500/40 transition-all space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
            </div>
            <h3 class="text-base font-bold text-foreground">Tableau de bord</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Filtrez vos candidatures en un clin d'œil par statut (Brouillon, Postulé, Entretien, Offre, Refusé) et ne manquez aucune relance stratégique.
            </p>
          </div>
        </div>

        <!-- Feature 2 -->
        <div id="assistant" class="p-7 rounded-3xl bg-card border border-border/70 shadow-sm hover:border-indigo-500/40 transition-all space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v1"/><path d="M5 10v1"/><path d="M10 5h1"/><path d="M6 5h1"/><path d="M9 10h1"/><path d="M10 9v1"/><path d="m2 2 1 1"/><path d="m22 22 1 1"/></svg>
            </div>
            <h3 class="text-base font-bold text-foreground">Assistant IA conversationnel</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Rédigez des lettres de motivation percutantes basées sur votre profil et l'offre ciblée, et préparez vos simulations d'entretiens.
            </p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div id="analytics" class="p-7 rounded-3xl bg-card border border-border/70 shadow-sm hover:border-indigo-500/40 transition-all space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="h-10 w-10 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <h3 class="text-base font-bold text-foreground">Analyses & Graphiques</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Visualisez votre taux de conversion (candidature -> entretien), la progression mensuelle de vos envois et vos plateformes les plus réactives.
            </p>
          </div>
        </div>

        <!-- Feature 4 -->
        <div class="p-7 rounded-3xl bg-card border border-border/70 shadow-sm hover:border-indigo-500/40 transition-all space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <h3 class="text-base font-bold text-foreground">Export CSV & PDF</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Exportez à tout moment l'ensemble de vos données dans des formats standards pour vos bilans, entretiens ou démarches administratives.
            </p>
          </div>
        </div>

        <!-- Feature 5 -->
        <div class="p-7 rounded-3xl bg-card border border-border/70 shadow-sm hover:border-indigo-500/40 transition-all space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect width="22" height="5" x="1" y="3" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
            </div>
            <h3 class="text-base font-bold text-foreground">Espace "Candidatures Masquées"</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Conservez un espace de travail épuré en masquant les offres refusées ou closes, sans jamais perdre leur historique précieux.
            </p>
          </div>
        </div>

        <!-- Feature 6 -->
        <div class="p-7 rounded-3xl bg-card border border-border/70 shadow-sm hover:border-indigo-500/40 transition-all space-y-4 flex flex-col justify-between">
          <div class="space-y-3">
            <div class="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <h3 class="text-base font-bold text-foreground">Vie privée & Sécurité</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Vos candidatures et documents restent strictement personnels et protégés par les protocoles de sécurité Supabase et Google OAuth.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. How it works section -->
    <section id="how-it-works" class="py-20 sm:py-28 border-t border-border/50 bg-muted/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
        <div class="max-w-xl mx-auto space-y-3">
          <h2 class="text-3xl font-extrabold tracking-tight text-foreground">
            Comment ça marche ?
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground">
            Prenez en main JobTracker en trois étapes simples.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          <div class="p-7 rounded-2xl bg-card border border-border/60 space-y-3">
            <span class="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-500 font-extrabold flex items-center justify-center text-xs">01</span>
            <h3 class="text-sm font-bold text-foreground">Connectez-vous avec Google</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Aucun formulaire interminable : votre compte est actif en un clic et prêt à accueillir vos candidatures.
            </p>
          </div>

          <div class="p-7 rounded-2xl bg-card border border-border/60 space-y-3">
            <span class="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-500 font-extrabold flex items-center justify-center text-xs">02</span>
            <h3 class="text-sm font-bold text-foreground">Scrapez vos offres d'emploi</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Ajoutez les offres depuis votre navigateur ou saisissez-les manuellement avec détection automatique par IA.
            </p>
          </div>

          <div class="p-7 rounded-2xl bg-card border border-border/60 space-y-3">
            <span class="h-8 w-8 rounded-xl bg-pink-500/10 text-pink-500 font-extrabold flex items-center justify-center text-xs">03</span>
            <h3 class="text-sm font-bold text-foreground">Pilotez</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Consultez vos statistiques, entraînez-vous avec l'assistant IA et suivez l'avancée de vos entretiens jusqu'à l'embauche.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Public Footer -->
    <footer class="border-t border-border/60 py-12 bg-card/40 text-xs text-muted-foreground">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
            JT
          </div>
          <span class="font-bold text-foreground">JobTracker</span>
          <span class="text-muted-foreground/50">| L'outil de suivi de candidatures intelligent</span>
        </div>

        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="hover:text-foreground transition-colors">
            Confidentialité
          </NuxtLink>
          <NuxtLink to="/login" class="hover:text-foreground transition-colors">
            Se connecter
          </NuxtLink>
        </div>

        <p>© {{ new Date().getFullYear() }} JobTracker. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Landing Page public component
</script>
