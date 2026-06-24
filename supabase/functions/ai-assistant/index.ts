import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const API_KEY = Deno.env.get('ZHIPU_API_KEY')
const API_URL_GLOBAL = 'https://api.z.ai/api/paas/v4/chat/completions'
const API_URL_DOMESTIC = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, context } = await req.json()

    if (!API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'ZHIPU_API_KEY non configurée sur le serveur. Veuillez configurer la clé d\'API Zhipu.' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages manquants ou invalides.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Build context system prompt
    let systemPrompt = "Tu es un assistant virtuel expert en recrutement et recherche d'emploi pour l'application JobTracker. Ton but est d'aider le candidat dans toutes ses démarches (rédaction de lettres de motivation, d'e-mails de relance, préparation aux questions d'entretiens d'embauche). Réponds en français de manière claire, concise, professionnelle et bien structurée en Markdown."

    if (context) {
      systemPrompt += `\n\nVoici le contexte de la candidature actuelle sélectionnée par le candidat :
- **Entreprise** : ${context.company_name || '—'}
- **Poste** : ${context.job_profile || '—'}
- **Salaire proposé** : ${context.proposed_salary || '—'}
- **Lien de l'offre** : ${context.url || '—'}
- **Missions principales** : ${context.main_missions || '—'}
- **Compétences clés** : ${context.primary_skills || '—'}
- **Notes / Retours d'entretien** : ${context.company_feedback || '—'}

Utilise ces informations pour personnaliser et contextualiser tes réponses si l'utilisateur te demande de rédiger ou de préparer quelque chose en rapport avec ce poste.`
    }

    const payload = {
      model: 'glm-4.7-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7
    }

    let response;
    let lastError = '';

    // 1. Try global Z.AI endpoint first
    try {
      response = await fetch(API_URL_GLOBAL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        lastError = `Z.AI status ${response.status}: ${await response.text()}`;
        response = null; // trigger fallback
      }
    } catch (e: any) {
      lastError = `Z.AI fetch error: ${e.message}`;
    }

    // 2. Fallback to domestic Chinese endpoint if global failed
    if (!response) {
      console.log(`Global Z.AI call failed (${lastError}). Trying domestic endpoint (open.bigmodel.cn)...`);
      try {
        response = await fetch(API_URL_DOMESTIC, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } catch (e: any) {
        throw new Error(`Both Zhipu API endpoints failed. Last error: ${lastError}. Domestic error: ${e.message}`);
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Zhipu API error: ${response.status} - ${errorText} (Previous Z.AI error: ${lastError})`)
    }

    const result = await response.json()
    const content = result.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('Réponse vide reçue de l\'API de Zhipu AI.')
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
