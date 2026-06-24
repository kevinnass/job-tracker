import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { configureUnPDF, getDocumentProxy, extractText } from "https://esm.sh/unpdf@0.10.0"
import * as pdfjs from "https://esm.sh/unpdf@0.10.0/dist/pdfjs.mjs"

configureUnPDF({
  pdfjs: async () => pdfjs,
})

const ZHIPU_API_KEY = Deno.env.get('ZHIPU_API_KEY')
const API_URL_GLOBAL = 'https://api.z.ai/api/paas/v4/chat/completions'
const API_URL_DOMESTIC = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Text Extraction ────────────────────────────────────────────────────────────

/** Extract plain text from a PDF file buffer using unpdf (PDF.js) */
async function extractTextFromPdf(buffer: Uint8Array): Promise<string> {
  const pdf = await getDocumentProxy(buffer)
  const { text } = await extractText(pdf, { mergePages: true })
  return text
}

/** Extract plain text from a DOCX file buffer (ZIP containing word/document.xml) */
async function extractTextFromDocx(buffer: Uint8Array): Promise<string> {
  // Use DecompressionStream to read the zip — Deno supports Web Streams API
  // We'll look for the document.xml PK local file header in the raw bytes
  const text = new TextDecoder('utf-8', { fatal: false }).decode(buffer)
  
  // DOCX is a ZIP — find word/document.xml content embedded in raw bytes
  // Simple approach: extract all XML text between <w:t> tags
  const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g
  const chunks: string[] = []
  let m
  while ((m = wtRegex.exec(text)) !== null) {
    if (m[1].trim()) chunks.push(m[1])
  }
  
  return chunks.join(' ').replace(/\s+/g, ' ').trim()
}

// ── GLM Extraction ─────────────────────────────────────────────────────────────

async function extractProfileWithGLM(cvText: string): Promise<Record<string, unknown>> {
  if (!ZHIPU_API_KEY) throw new Error('ZHIPU_API_KEY not configured')
  
  const prompt = `Tu es un expert en analyse de CV. Voici le texte brut d'un CV. Extrais les informations et retourne UNIQUEMENT un objet JSON valide (sans markdown, sans explication) avec exactement ces champs :

{
  "full_name": "Prénom et nom complet (chaîne vide si absent)",
  "job_title": "Titre ou intitulé de poste principal (chaîne vide si absent)",
  "professional_summary": "Résumé ou accroche professionnelle (chaîne vide si absent)",
  "skills": ["compétence1", "compétence2"],
  "languages": ["Français", "Anglais"],
  "experience": [
    {
      "title": "Intitulé du poste",
      "company": "Nom de l'entreprise",
      "start": "MM/AAAA ou AAAA",
      "end": "MM/AAAA ou AAAA ou 'Présent'",
      "description": "Description courte des missions"
    }
  ],
  "education": [
    {
      "degree": "Diplôme ou formation",
      "institution": "École ou université",
      "year": "AAAA"
    }
  ]
}

Texte du CV :
${cvText.slice(0, 8000)}`

  const payload = {
    model: 'glm-4.7-flash',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
  }

  let response: Response | null = null

  // Try global endpoint first
  try {
    response = await fetch(API_URL_GLOBAL, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${ZHIPU_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) response = null
  } catch (_) {
    response = null
  }

  // Fallback to domestic endpoint
  if (!response) {
    response = await fetch(API_URL_DOMESTIC, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${ZHIPU_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  }

  if (!response.ok) {
    throw new Error(`GLM API error: ${response.status}`)
  }

  const result = await response.json()
  const content: string = result.choices?.[0]?.message?.content ?? ''

  // Extract JSON from the response (strip markdown code fences if any)
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No valid JSON in GLM response')
  
  return JSON.parse(jsonMatch[0])
}

// ── Main Handler ───────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { filePath, fileType } = await req.json()

    if (!filePath || !fileType) {
      return new Response(JSON.stringify({ error: 'filePath and fileType are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Download the file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('cv-uploads')
      .download(filePath)

    if (downloadError || !fileData) {
      throw new Error(`Failed to download CV: ${downloadError?.message}`)
    }

    const buffer = new Uint8Array(await fileData.arrayBuffer())

    // Extract text based on file type
    let extractedText = ''
    if (fileType === 'application/pdf') {
      extractedText = await extractTextFromPdf(buffer)
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await extractTextFromDocx(buffer)
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported file type' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    if (!extractedText || extractedText.length < 20) {
      throw new Error("Le texte extrait du CV est trop court ou vide. Essayez avec un autre fichier.")
    }

    // Parse profile using GLM
    const profile = await extractProfileWithGLM(extractedText)

    return new Response(JSON.stringify({ profile }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
