import { defineStore } from 'pinia'

export interface JobApplication {
  id: string
  user_id: string
  url: string
  company_name: string
  company_info: string
  job_profile: string
  main_missions: string
  primary_skills: string
  proposed_salary: string
  applied_at: string | null
  company_feedback: string
  status: 'draft' | 'applied' | 'interview' | 'rejected' | 'accepted'
  created_at: string
  updated_at: string
}

export type NewJobApplication = Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export const useApplicationsStore = defineStore('applications', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const applications = ref<JobApplication[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const sortedApplications = computed(() => {
    return [...applications.value].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  })

  const stats = computed(() => {
    const total = applications.value.length
    const applied = applications.value.filter(a => a.status === 'applied').length
    const interviews = applications.value.filter(a => a.status === 'interview').length
    const accepted = applications.value.filter(a => a.status === 'accepted').length
    const rejected = applications.value.filter(a => a.status === 'rejected').length
    return { total, applied, interviews, accepted, rejected }
  })

  async function getCurrentUserId() {
    if (user.value?.id) return user.value.id
    const { data: { user: authUser } } = await supabase.auth.getUser()
    return authUser?.id || null
  }

  async function fetchApplications() {
    const userId = await getCurrentUserId()
    if (!userId) {
      // Pas d'erreur, on affiche simplement une liste vide pour les invités
      applications.value = []
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (err) throw err
      applications.value = data as JobApplication[]
    } catch (e: any) {
      error.value = e.message || 'Impossible de récupérer les candidatures.'
      console.error('Error fetching applications:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function addApplication(app: NewJobApplication) {
    const userId = await getCurrentUserId()
    if (!userId) {
      const msg = 'Session introuvable. Veuillez vous reconnecter.'
      error.value = msg
      throw new Error(msg)
    }
    loading.value = true
    error.value = null
    try {
      // Nettoyage de l'objet pour ne pas envoyer d'undefined ou de strings vides
      // pour les champs qui attendent des types spécifiques (ex: dates)
      const payload: any = { 
        ...app,
        user_id: userId
      }
      if (payload.status !== 'draft' && !payload.applied_at) {
        payload.applied_at = new Date().toISOString()
      } else if (!payload.applied_at) {
        payload.applied_at = null
      }

      const { data, error: err } = await supabase
        .from('job_applications')
        .insert(payload)
        .select()
        .single()

      if (err) throw err
      applications.value.unshift(data as JobApplication)
      return data
    } catch (e: any) {
      error.value = e.message || "Erreur lors de l'ajout de la candidature."
      console.error('Error adding application:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateApplication(id: string, updates: Partial<JobApplication>) {
    const userId = await getCurrentUserId()
    if (!userId) {
      const msg = 'Session expirée (update).'
      error.value = msg
      throw new Error(msg)
    }
    loading.value = true
    error.value = null
    try {
      const existing = applications.value.find(a => a.id === id)

      const payload: any = { 
        ...updates, 
        user_id: userId,
        updated_at: new Date().toISOString() 
      }

      // Auto-set today's date if transitioning from draft (or missing applied_at) to applied / active status
      if (payload.status && payload.status !== 'draft') {
        if (!payload.applied_at && (!existing?.applied_at || existing?.status === 'draft')) {
          payload.applied_at = new Date().toISOString()
        }
      }
      
      const { data, error: err } = await supabase
        .from('job_applications')
        .update(payload as any)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      const index = applications.value.findIndex(a => a.id === id)
      if (index !== -1) {
        applications.value[index] = data as JobApplication
      }
      return data
    } catch (e: any) {
      error.value = e.message || "Erreur lors de la mise à jour."
      console.error('Error updating application:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteApplication(id: string) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id)

      if (err) throw err
      applications.value = applications.value.filter(a => a.id !== id)
    } catch (e: any) {
      error.value = e.message || "Erreur lors de la suppression."
      console.error('Error deleting application:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    applications,
    sortedApplications,
    stats,
    loading,
    error,
    fetchApplications,
    addApplication,
    updateApplication,
    deleteApplication,
  }
})
