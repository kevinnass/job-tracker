<template>
  <div class="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-fade-in">
    
    <!-- Sidebar - Applications Selector (Desktop only) -->
    <div class="hidden md:flex w-80 shrink-0 flex-col bg-card border rounded-xl shadow-sm overflow-hidden h-full">
      <div class="p-4 border-b bg-muted/30">
        <h2 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Associer une candidature</h2>
        <p class="text-[10px] text-muted-foreground mt-0.5">Sélectionnez une entreprise pour charger l'historique et contextualiser l'IA.</p>
      </div>

      <!-- Application List -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <button 
          @click="activeApp = null"
          class="w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between"
          :class="!activeApp ? 'border-indigo-500/30 bg-indigo-500/5 font-semibold text-indigo-600 dark:text-indigo-400' : 'border-border hover:bg-muted/50'"
        >
          <span>Aucune candidature (Chat Général)</span>
          <svg v-if="!activeApp" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>

        <button 
          v-for="app in store.sortedApplications" 
          :key="app.id"
          @click="activeApp = app"
          class="w-full text-left p-3 rounded-lg border text-xs transition-all flex flex-col gap-1"
          :class="activeApp?.id === app.id ? 'border-indigo-500/30 bg-indigo-500/5 font-semibold text-indigo-600 dark:text-indigo-400' : 'border-border hover:bg-muted/50'"
        >
          <div class="flex items-center justify-between w-full">
            <span class="font-bold truncate max-w-[150px]">{{ app.company_name }}</span>
            <span class="text-[9px] uppercase tracking-wider font-bold text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
              {{ app.status }}
            </span>
          </div>
          <span class="text-[10px] text-muted-foreground truncate">{{ app.job_profile || '—' }}</span>
        </button>
      </div>

      <!-- Demo Mock Toggle in Desktop Sidebar -->
      <div class="p-4 border-t bg-muted/20 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mode Démo (Simulation)</span>
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
        <p class="text-[9px] text-muted-foreground leading-relaxed">
          Activez ce mode si la clé <code class="bg-muted px-1 rounded">ZHIPU_API_KEY</code> n'est pas configurée dans Supabase.
        </p>
      </div>
    </div>

    <!-- Chat Interface -->
    <div class="flex-1 flex flex-col bg-card border rounded-xl shadow-sm overflow-hidden h-full">
      <!-- Chat Header -->
      <div class="p-4 border-b bg-muted/30 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-sm font-semibold tracking-tight">Assistant IA (GLM-4.7-flash)</h2>
              <p class="text-[10px] text-muted-foreground mt-0.5">
                <span v-if="activeApp" class="font-medium text-indigo-600 dark:text-indigo-400">Contexte : {{ activeApp.company_name }} — {{ activeApp.job_profile }}</span>
                <span v-else>Posez vos questions de recherche d'emploi de façon générale.</span>
              </p>
            </div>
          </div>
          
          <!-- Mock Toggle for Mobile -->
          <div class="flex md:hidden items-center gap-2">
            <span class="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Démo</span>
            <button 
              @click="useMock = !useMock" 
              class="relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
              :class="useMock ? 'bg-indigo-500' : 'bg-zinc-300 dark:bg-zinc-700'"
            >
              <span 
                class="pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="useMock ? 'translate-x-3' : 'translate-x-0'"
              />
            </button>
          </div>
        </div>

        <!-- Mobile application selector (Visible only on mobile/tablet) -->
        <div class="block md:hidden w-full">
          <select 
            @change="onMobileSelectChange"
            class="w-full h-9 text-xs px-3 bg-card border border-border rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Sélectionner une candidature (Chat Général)</option>
            <option 
              v-for="app in store.sortedApplications" 
              :key="app.id" 
              :value="app.id"
              :selected="activeApp?.id === app.id"
            >
              {{ app.company_name }} — {{ app.job_profile || '—' }} ({{ app.status }})
            </option>
          </select>
        </div>

        <!-- Shortcuts Panel -->
        <div class="flex gap-1.5 flex-wrap">
          <button 
            @click="triggerShortcut('coverLetter')"
            :disabled="!activeApp || loading"
            class="px-2.5 py-1 text-[10px] border rounded-full bg-card hover:bg-muted/50 transition-colors font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            title="Générer une lettre de motivation sur-mesure"
          >
            ✉️ Lettre de Motivation
          </button>
          <button 
            @click="triggerShortcut('followUp')"
            :disabled="!activeApp || loading"
            class="px-2.5 py-1 text-[10px] border rounded-full bg-card hover:bg-muted/50 transition-colors font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            title="Générer un e-mail de relance"
          >
            📞 E-mail de Relance
          </button>
          <button 
            @click="triggerShortcut('interview')"
            :disabled="!activeApp || loading"
            class="px-2.5 py-1 text-[10px] border rounded-full bg-card hover:bg-muted/50 transition-colors font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            title="Simuler des questions d'entretien"
          >
            🤝 Préparer Entretien
          </button>
        </div>
      </div>

      <!-- Messages Stream -->
      <div ref="messageContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Loading messages indicator -->
        <div v-if="loadingHistory" class="flex items-center justify-center py-10">
          <div class="flex flex-col items-center gap-2">
            <div class="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <span class="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Chargement de l'historique...</span>
          </div>
        </div>

        <template v-else>
          <!-- Message list -->
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div 
              class="max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs shadow-sm leading-relaxed flex flex-col gap-2"
              :class="msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-muted border border-border text-foreground rounded-bl-none'"
            >
              <!-- Render Markdown -->
              <div v-html="formatMessage(msg.content)"></div>

              <!-- Action buttons on assistant message bubble -->
              <div v-if="msg.role === 'assistant'" class="mt-2.5 pt-2 border-t border-border/30 flex items-center justify-between gap-4 text-[9px] text-muted-foreground">
                <span class="font-medium">Actions :</span>
                <div class="flex gap-1.5 shrink-0 items-center">
                  <!-- Copy Button (Icon) -->
                  <button 
                    @click="copyToClipboard(msg.content, index)" 
                    class="p-1.5 rounded bg-card hover:bg-muted border border-border flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    :title="copiedMessageIndex === index ? 'Copié !' : 'Copier dans le presse-papier'"
                  >
                    <svg v-if="copiedMessageIndex === index" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-emerald-500 animate-fade-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>

                  <!-- PDF Download Button (Icon) -->
                  <button 
                    @click="printSingleMessage(msg.content, activeApp ? `JobTracker — ${activeApp.company_name} — ${activeApp.job_profile}` : 'JobTracker — Conseils de recherche')" 
                    class="p-1.5 rounded bg-card hover:bg-muted border border-border flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Télécharger/Imprimer en PDF"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>

                  <!-- Generation triggers under message -->
                  <div v-if="activeApp" class="flex gap-1 border-l pl-1.5 border-border/60">
                    <button 
                      @click="triggerShortcut('coverLetter')" 
                      :disabled="loading"
                      class="px-2 py-0.5 rounded bg-card hover:bg-indigo-500/10 border border-border font-semibold text-[8px] hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Générer une lettre de motivation"
                    >
                      ✉️ Lettre
                    </button>
                    <button 
                      @click="triggerShortcut('followUp')" 
                      :disabled="loading"
                      class="px-2 py-0.5 rounded bg-card hover:bg-indigo-500/10 border border-border font-semibold text-[8px] hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Générer un e-mail de relance"
                    >
                      📞 Relance
                    </button>
                    <button 
                      @click="triggerShortcut('interview')" 
                      :disabled="loading"
                      class="px-2 py-0.5 rounded bg-card hover:bg-indigo-500/10 border border-border font-semibold text-[8px] hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Simuler des questions d'entretien"
                    >
                      🤝 Entretien
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- AI Thinking loading indicator -->
        <div v-if="loading" class="flex justify-start">
          <div class="bg-muted border border-border text-foreground rounded-2xl rounded-bl-none p-4 text-xs shadow-sm flex items-center gap-2">
            <div class="flex gap-1">
              <span class="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
            <span class="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">L'IA prépare sa réponse...</span>
          </div>
        </div>
      </div>

      <!-- Error Message Alert -->
      <div v-if="errorMessage" class="mx-4 mb-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs flex gap-3 items-start animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div class="flex-1">
          <p class="font-bold">Une erreur est survenue</p>
          <p class="mt-0.5 opacity-90">{{ errorMessage }}</p>
          <button @click="useMock = true; errorMessage = null" class="mt-2 text-[10px] uppercase tracking-wide font-bold underline block hover:opacity-85">
            Activer le Mode Démo (Simulation)
          </button>
        </div>
      </div>

      <!-- Chat Input Area -->
      <div class="p-4 border-t bg-muted/30">
        <form @submit.prevent="sendMessage" class="flex gap-3">
          <textarea 
            v-model="inputMessage"
            @keydown.enter.exact.prevent="sendMessage"
            rows="1"
            placeholder="Posez votre question ici..."
            class="input-field flex-1 resize-none bg-card py-2.5 px-4 text-xs h-10 border rounded-lg max-h-32 min-h-10 focus:outline-none"
            :disabled="loading || loadingHistory"
          ></textarea>
          <button 
            type="submit" 
            :disabled="loading || loadingHistory || !inputMessage.trim()"
            class="btn-primary shrink-0 px-4 h-10 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Envoyer</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { useApplicationsStore } from '~/stores/applications'

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

interface Message {
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

// Fetch chat logs from database
async function fetchChatHistory() {
  if (!user.value) return
  loadingHistory.value = true
  errorMessage.value = null
  try {
    let query = supabase
      .from('ia_chat_messages')
      .select('role, content')
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
  
  messages.value.push({ role: 'user', content: userText })
  scrollToBottom()
  
  loading.value = true

  // Save user query to DB (Async, non-blocking)
  if (user.value) {
    supabase.from('ia_chat_messages').insert({
      application_id: activeApp.value?.id || null,
      user_id: user.value.id,
      role: 'user',
      content: userText
    }).then(({ error }) => {
      if (error) console.error('Error saving user message:', error)
    })
  }
  
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
    messages.value.push({ role: 'assistant', content: replyText })
    scrollToBottom()

    // Save assistant response to DB
    if (user.value) {
      supabase.from('ia_chat_messages').insert({
        application_id: activeApp.value?.id || null,
        user_id: user.value.id,
        role: 'assistant',
        content: replyText
      }).then(({ error }) => {
        if (error) console.error('Error saving assistant message:', error)
      })

      // Silently save content generated via shortcut to ia_contents table
      if (activeApp.value && currentShortcut) {
        saveContentToAppSilently(replyText, currentShortcut)
      }
    }
  } catch (err: any) {
    console.error('Error in sendMessage:', err)
    errorMessage.value = err.message || "Failed to communicate with AI Assistant."
  } finally {
    loading.value = false
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
  if (!activeApp.value || !user.value) return
  try {
    await supabase.from('ia_contents').upsert({
      application_id: activeApp.value.id,
      user_id: user.value.id,
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
