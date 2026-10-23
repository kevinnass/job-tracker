<template>
  <div class="min-h-screen bg-background text-foreground font-sans">
    <div class="max-w-3xl mx-auto py-24 px-4 pb-32">
      <!-- Header with Brand and Lang Switcher -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-16">
        <NuxtLink to="/" class="flex flex-col group transition-all duration-300">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:rotate-[360deg] transition-all duration-700 shadow-xl shadow-primary/10">
              <span class="text-primary-foreground font-black text-sm italic">JT</span>
            </div>
            <span class="font-black text-foreground italic uppercase tracking-tighter text-2xl leading-none">JobTracker</span>
          </div>
          <p class="text-[10px] font-bold text-muted-foreground/40 mt-1.5 ml-0.5 uppercase tracking-[0.2em] group-hover:text-primary/40 transition-colors">Career Scraper Ecosystem</p>
        </NuxtLink>

        <!-- Language Switcher -->
        <div class="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/50">
          <button 
            v-for="l in (['fr', 'en'] as const)" 
            :key="l"
            @click="locale = l"
            :class="[
              'px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300',
              locale === l 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' 
                : 'text-muted-foreground/60 hover:text-foreground hover:bg-muted/50'
            ]"
          >
            {{ l }}
          </button>
        </div>
      </header>

      <!-- Title Section -->
      <div class="mb-20">
        <h1 class="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] text-foreground mb-6">
          {{ t.title }} <br class="sm:hidden" />
          <span class="text-primary drop-shadow-xl">{{ t.titleSuffix }}</span>
        </h1>
        <p class="text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.1em] border-l-2 border-primary/20 pl-4">
          {{ t.updated }}
        </p>
      </div>

      <!-- Content Sections -->
      <div class="space-y-20">
        <section v-for="section in t.sections" :key="section.id" :id="section.id" class="group">
          <h2 class="text-2xl font-black italic uppercase tracking-tight text-foreground mb-6 flex items-center gap-3 group-hover:translate-x-1 transition-transform">
            <span class="w-1.5 h-6 bg-primary/20 rounded-full group-hover:bg-primary transition-colors"></span>
            {{ section.title }}
          </h2>
          <div class="prose prose-invert max-w-none">
            <p class="text-muted-foreground leading-relaxed text-lg font-medium">
              {{ section.content }}
            </p>
            
            <!-- Specific Data Collection List -->
            <ul v-if="section.id === 'data'" class="mt-8 space-y-6 list-none p-0">
              <li v-for="item in t.dataCollected" :key="item.label" class="bg-muted/10 border border-border/50 p-6 rounded-2xl hover:bg-muted/20 transition-all group-hover/list:scale-[1.01]">
                <strong class="block text-foreground font-black italic uppercase tracking-wide text-sm mb-2">{{ item.label }}</strong>
                <span class="text-muted-foreground/80 leading-relaxed">{{ item.desc }}</span>
              </li>
            </ul>

            <!-- Specific Permissions List -->
            <div v-if="section.id === 'permissions'" class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="p in t.permissions" :key="p.perm" class="bg-muted/20 border border-border/50 p-6 rounded-2xl">
                <code class="text-primary font-black text-xs uppercase bg-primary/5 px-2 py-1 rounded mb-3 inline-block">{{ p.perm }}</code>
                <p class="text-xs text-muted-foreground/80 leading-relaxed font-bold">{{ p.reason }}</p>
              </div>
            </div>

            <!-- Specific CTA for Contact -->
            <div v-if="section.id === 'contact'" class="mt-10">
              <a href="mailto:nassarakevin@gmail.com" class="inline-flex items-center gap-4 bg-foreground text-background px-8 py-5 rounded-2xl font-black italic uppercase tracking-tighter hover:bg-primary hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-foreground/5">
                {{ t.cta }}
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7l10 10M17 7H7v10"/></svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Page Configuration & Meta
 */
definePageMeta({
  layout: false
})

const locale = ref<'fr' | 'en'>('en')

const i18n = {
  fr: {
    back: 'Retour au tableau de bord',
    title: 'Politique de',
    titleSuffix: 'Confidentialité',
    updated: 'Dernière mise à jour : 25 Mars 2026',
    extension: 'Extension Chrome JobTracker',
    cta: 'Nous écrire directement',
    rights: '— Tous droits réservés',
    sections: [
      { id: 'overview', title: 'Aperçu', content: 'JobTracker Scraper ("l\'Extension") est une extension Chrome conçue pour simplifier votre recherche d\'emploi. Elle vous permet de capturer instantanément des offres depuis n\'importe quel site et de les organiser dans votre tableau de bord. La protection de votre vie privée est au cœur de notre démarche.' },
      { id: 'data', title: 'Données collectées', content: 'Pour vous offrir un service optimal et une synchronisation parfaite, nous collectons de manière transparente les informations suivantes :' },
      { id: 'use', title: 'Utilisation des données', content: 'Vos données servent exclusivement au bon fonctionnement de l\'Extension : sauvegarde, analyse par IA et organisation de vos candidatures. Nous ne pratiquons aucune revente de données, aucun profilage publicitaire, ni aucune exploitation commerciale détournée.' },
      { id: 'storage', title: 'Stockage sécurisé', content: 'Nous utilisons Supabase pour le stockage de vos données, garantissant un haut niveau de sécurité. Le traitement du contenu des pages capturées s\'effectue via des fonctions "Edge" isolées. Vos informations sont privées et ne sont jamais partagées avec des tiers non essentiels au service.' },
      { id: 'local', title: 'Stockage local', content: 'Vos jetons d\'accès sont stockés de manière sécurisée dans le stockage local de votre navigateur Chrome. Ils restent sur votre appareil et ne sont transmis qu\'à notre backend lors de vos interactions avec l\'Extension.' },
      { id: 'permissions', title: 'Permissions requises', content: 'L\'Extension nécessite des accès spécifiques pour interagir avec les sites d\'emploi et capturer les informations pertinentes :' },
      { id: 'rights', title: 'Vos droits', content: 'Vous restez maître de vos données. À tout moment, vous pouvez demander la suppression intégrale de votre compte et de son historique. Cette action est irréversible et entraîne l\'effacement définitif de toutes vos candidatures enregistrées.' },
      { id: 'contact', title: 'Contactez-nous', content: 'Une question ou une préoccupation concernant votre vie privée ? Notre équipe est à votre disposition pour vous répondre.' }
    ],
    dataCollected: [
      { label: 'Authentification', desc: 'Votre e-mail et vos jetons de session sécurisés permettant de vous identifier et de lier vos captures à votre compte JobTracker personnel.' },
      { label: 'Contenu des captures', desc: 'Le texte, le titre et l\'URL de la page que vous choisissez activement de sauvegarder. Ce contenu est analysé par notre IA pour en extraire les détails du poste.' },
      { label: 'Données structurées', desc: 'Les informations spécifiques extraites (salaire, compétences, missions, entreprise) qui alimentent votre tableau de bord de suivi de carrière.' }
    ],
    permissions: [
      { perm: 'activeTab', reason: 'Nécessaire pour accéder au contenu de la page d\'offre que vous visualisez.' },
      { perm: 'scripting', reason: 'Permet à l\'extension de lire et d\'analyser intelligemment les données de la page.' },
      { perm: 'storage', reason: 'Utilisé pour conserver votre session active et éviter des reconnexions fréquentes.' },
      { perm: 'cookies', reason: 'Assure la synchronisation transparente entre votre navigateur et notre application web.' },
      { perm: 'host_permissions', reason: 'Permet de capturer des offres au-dessus de tous les sites d\'emploi.' }
    ],
    seo: {
      title: 'Politique de Confidentialité – JobTracker Scraper',
      description: 'Découvrez comment JobTracker Scraper protège vos données lors de la capture d\'offres d\'emploi.'
    }
  },
  en: {
    back: 'Return to Dashboard',
    title: 'Data Privacy',
    titleSuffix: 'Policy',
    updated: 'Last revised: March 25, 2026',
    extension: 'JobTracker Ecosystem',
    cta: 'Reach out directly',
    rights: '— All rights reserved',
    sections: [
      { id: 'overview', title: 'Overview', content: 'JobTracker Scraper ("the Extension") is a dedicated browser extension designed to streamline your career growth. It empowers you to instantly capture opportunities from any platform and organize them within your workspace. Data integrity and privacy are fundamental to our mission.' },
      { id: 'data', title: 'Information We Handle', content: 'To deliver a seamless experience and real-time synchronization, we process the following data points with full transparency:' },
      { id: 'use', title: 'Data Purpose', content: 'Your information is utilized exclusively for core platform functionality: application tracking, AI-powered analysis, and career organization. We never engage in data resale, advertising profiling, or any unauthorized commercial use.' },
      { id: 'storage', title: 'Secure Infrastructure', content: 'We leverage Supabase for encrypted data storage, ensuring institutional-grade security. Page content analysis is performed via isolated Edge functions. Your professional data remains private and is never disclosed to non-essential third parties.' },
      { id: 'local', title: 'Local Encryption', content: 'Your authentication credentials are encrypted and stored locally within your secure browser environment. This sensitive data never leaves your device except for authorized, authenticated API requests to our backend.' },
      { id: 'permissions', title: 'System Permissions', content: 'The Extension requires specific technical access to interact with job boards and deliver intelligent data extraction:' },
      { id: 'rights', title: 'User Agency', content: 'You maintain absolute ownership of your data. At any time, you may request the permanent deletion of your account and all associated history. This action is final and results in the immediate erasure of all career assets.' },
      { id: 'contact', title: 'Contact Support', content: 'Questions or feedback regarding your data privacy? Our dedicated support team is here to assist you.' }
    ],
    dataCollected: [
      { label: 'Authentication', desc: 'Secure email and session tokens used to synchronize your captures with your personal JobTracker workspace.' },
      { label: 'Intelligent Capture', desc: 'Page metadata and textual content you actively choose to save. This is processed by our AI to extract relevant professional insights.' },
      { label: 'Vector Data', desc: 'Structured professional attributes (salary, missions, core skills) that power your career tracking dashboard.' }
    ],
    permissions: [
      { perm: 'activeTab', reason: 'Enables access to the job listing content you choose to analyze.' },
      { perm: 'scripting', reason: 'Allows the extension to intelligently parse and extract key data from job boards.' },
      { perm: 'storage', reason: 'Used to maintain your secure session and prevent repeated logins.' },
      { perm: 'cookies', reason: 'Ensures a seamless, integrated session between your browser and our workspace.' },
      { perm: 'host_permissions', reason: 'Enables reliable capture across global job platforms (LinkedIn, Indeed, etc.).' }
    ],
    seo: {
      title: 'Privacy & Security – JobTracker Scraper',
      description: 'Learn how JobTracker Scraper safeguards your professional data and ensures privacy across the web.'
    }
  }
}

/**
 * Reactivity & SEO
 */
const t = computed(() => i18n[locale.value])

watchEffect(() => {
  useSeoMeta({
    title: t.value.seo.title,
    description: t.value.seo.description
  })
})
</script>

<style scoped>
.prose {
  --tw-prose-invert-body: #94a3b8;
}
</style>
