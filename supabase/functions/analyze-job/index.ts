import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
const ZHIPU_API_KEY = Deno.env.get('ZHIPU_API_KEY')

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const ZHIPU_API_URL_GLOBAL = 'https://api.z.ai/api/paas/v4/chat/completions'
const ZHIPU_API_URL_DOMESTIC = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function cleanJsonString(content: string): string {
  let cleaned = (content || '').trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  }
  return cleaned
}

/** Extract company name from known ATS and company job URLs */
function extractCompanyFromUrl(url: string): string {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase()
    const domainParts = hostname.split('.')
    
    // Check known ATS where company is in pathname
    // e.g. jobs.lever.co/theodo, jobs.ashbyhq.com/alpic, jobs.smartrecruiters.com/Ubisoft2, recruiterflow.com/licornesociety
    if (['jobs.lever.co', 'jobs.ashbyhq.com', 'jobs.smartrecruiters.com', 'recruiterflow.com'].some(ats => hostname.includes(ats))) {
      const segs = parsed.pathname.split('/').filter(Boolean)
      if (segs.length > 0) {
        const seg = segs[0].replace(/\d+$/, '')
        return seg.charAt(0).toUpperCase() + seg.slice(1)
      }
    }
    
    // Check werecruit: /fr/ionis-group/offres/...
    if (hostname.includes('werecruit.io')) {
      const segs = parsed.pathname.split('/').filter(Boolean)
      const companySeg = segs.find(s => s !== 'fr' && s !== 'en' && s !== 'offres' && s !== 'jobs')
      if (companySeg) {
        return companySeg.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }
    }

    // Check subdomains: 360learning.welcomekit.co, harfanglab.teamtailor.com, career.spendesk.com
    if (domainParts.length >= 3) {
      if (['welcomekit', 'teamtailor', 'workable', 'bamboohr', 'breezy'].some(ats => hostname.includes(ats))) {
        const sub = domainParts[0].split('-')[0]
        return sub.charAt(0).toUpperCase() + sub.slice(1)
      }
      if (['career', 'careers', 'jobs', 'recrutement', 'apply'].includes(domainParts[0])) {
        return domainParts[1].charAt(0).toUpperCase() + domainParts[1].slice(1)
      }
    }

    // Generic domain
    const candidate = domainParts[0]
    if (!['linkedin', 'hellowork', 'welcometothejungle', 'free-work', 'indeed', 'glassdoor', 'monster'].includes(candidate)) {
      return candidate.charAt(0).toUpperCase() + candidate.slice(1)
    }
  } catch {}
  return ''
}

/** Fallback extraction using heuristics and regex when AI quotas are exceeded */
function smartFallbackExtraction(content: string, title = '', url = '') {
  const safeContent = content || ''

  // 1. Extract Salary
  const salaryMatch = safeContent.match(/(\b\d{2,3}[\s\u202F\u00A0]*\d{3}\b(?:\s*[-–à]\s*\b\d{2,3}[\s\u202F\u00A0]*\d{3}\b)?\s*€|\b\d{2,3}\s*[-–à]\s*\d{2,3}\s*[kK]€?|\b\d{2,3}\s*[kK]€\b)/i)
  const proposed_salary = salaryMatch ? salaryMatch[0].trim() : 'Non spécifié'

  // 2. Extract technical skills
  const commonSkills = [
    'React', 'Vue.js', 'Vue', 'Next.js', 'Nuxt', 'Angular', 'TypeScript', 'JavaScript',
    'Node.js', 'Python', 'FastAPI', 'Django', 'PHP', 'Laravel', 'Symfony', 'Java', 'Spring',
    'Go', 'Golang', 'Rust', 'C++', 'C#', '.NET', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Redis', 'GraphQL', 'REST', 'API', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
    'CI/CD', 'Git', 'Tailwind', 'Sass', 'CSS', 'HTML', 'Linux'
  ]
  const foundSkills: string[] = []
  for (const skill of commonSkills) {
    try {
      const escaped = escapeRegex(skill)
      const regex = new RegExp(`(^|[^a-zA-Z0-9_])${escaped}([^a-zA-Z0-9_]|$)`, 'i')
      if (regex.test(safeContent) && !foundSkills.includes(skill)) {
        foundSkills.push(skill)
      }
    } catch {
      // safe fallback
    }
  }

  // 3. Extract missions (clean bullet points or mission section, avoid page navigation garbage)
  const lines = safeContent.split('\n').map(l => l.trim()).filter(Boolean)
  const bulletLines = lines.filter(line => 
    /^[-•*–—]\s+[A-ZÀ-ÖØ-ßa-z]/.test(line) && 
    line.length > 20 && 
    line.length < 350 &&
    !line.toLowerCase().includes('notification') &&
    !line.toLowerCase().includes('passer au contenu') &&
    !line.toLowerCase().includes('cookie') &&
    !line.toLowerCase().includes('connexion')
  )

  let main_missions = ''
  if (bulletLines.length >= 2) {
    main_missions = bulletLines.slice(0, 8).join('\n')
  } else {
    const missionSection = safeContent.match(/(?:vos missions|vos responsabilités|missions principales|le poste|description du poste)[\s\S]{30,800}?(?=(?:profil recherché|votre profil|ce que nous offrons|compétences|pourquoi nous rejoindre|\n\s*\n\s*\n))/i)
    if (missionSection) {
      main_missions = missionSection[0].trim()
    } else {
      main_missions = 'Consultez le lien de l\'offre pour le détail des missions.'
    }
  }

  // 4. Extract company_name and job_profile
  let company_name = ''
  let job_profile = ''

  // 4a. From title if provided
  if (title) {
    let cleanTitle = title.replace(/^\(\d+\)\s*/, '')
    cleanTitle = cleanTitle.replace(/\s*(?:\| LinkedIn|\| Welcome to the Jungle|\| HelloWork|Jobs).*$/i, '').trim()
    
    const chezMatch = cleanTitle.match(/^(.+?)\s+chez\s+(.+)$/i)
    if (chezMatch) {
      job_profile = chezMatch[1].trim()
      company_name = chezMatch[2].trim()
    } else {
      const parts = cleanTitle.split(/\s*[-|–—•]\s*/)
      if (parts.length >= 2) {
        if (/(?:développeur|developer|engineer|ingénieur|consultant|architecte|lead|manager|tech|software|stage)/i.test(parts[0])) {
          job_profile = parts[0].trim()
          company_name = parts[1].trim()
        } else if (/(?:développeur|developer|engineer|ingénieur|consultant|architecte|lead|manager|tech|software|stage)/i.test(parts[1])) {
          company_name = parts[0].trim()
          job_profile = parts[1].trim()
        } else {
          job_profile = parts[0].trim()
          company_name = parts[1].trim()
        }
      } else if (parts.length === 1 && !job_profile) {
        job_profile = parts[0].trim()
      }
    }
  }

  // 4b. From content "À propos de l'entreprise \n Company"
  if (!company_name) {
    const aboutCompanyMatch = safeContent.match(/À propos de l[’']entreprise\s*\n+([A-Za-z0-9À-ÿ\s.\-&]{2,40})/i)
    if (aboutCompanyMatch) {
      company_name = aboutCompanyMatch[1].trim()
    }
  }

  // 4c. From content "À propos de [Company] :"
  if (!company_name) {
    const aboutMatch = safeContent.match(/À propos de ([A-Za-z0-9À-ÿ\s.\-&]{2,30})\s*:/i)
    if (aboutMatch && !/ce poste|l[’']offre|cette offre|notre entreprise/i.test(aboutMatch[1])) {
      company_name = aboutMatch[1].trim()
    }
  }

  // 4d. From layout patterns in lines (LinkedIn / WTTJ / HelloWork headers)
  if (!company_name || !job_profile) {
    for (let i = 0; i < Math.min(lines.length - 2, 45); i++) {
      const l1 = lines[i]
      const l2 = lines[i+1]
      const l3 = lines[i+2]
      
      // Look for location indicator in line 3
      if (/(?:France|Paris|Lyon|Bordeaux|Nantes|Toulouse|Lille|Sur site|Hybride|Télétravail|CDI|Temps plein)/i.test(l3) && 
          l1.length < 50 && l2.length < 80 &&
          !/(?:recherche|accueil|réseau|emplois|messagerie|notification|connexion|passer au|linkedin learning)/i.test(l1) &&
          !/(?:recherche|accueil|réseau|emplois|messagerie|notification|connexion|passer au)/i.test(l2)) {
        
        if (/(?:développeur|developer|engineer|ingénieur|consultant|architecte|lead|manager|tech|software|stage)/i.test(l2)) {
          if (!company_name) company_name = l1
          if (!job_profile) job_profile = l2
          break
        } else if (/(?:développeur|developer|engineer|ingénieur|consultant|architecte|lead|manager|tech|software|stage)/i.test(l1)) {
          if (!job_profile) job_profile = l1
          if (!company_name) company_name = l2
          break
        }
      }
    }
  }

  // 4e. WTTJ layout: "COMPANY\nRole\nRÉSUMÉ DU POSTE"
  if (!company_name || !job_profile) {
    for (let i = 0; i < Math.min(lines.length - 2, 25); i++) {
      if (/RÉSUMÉ DU POSTE/i.test(lines[i+2]) && lines[i].length < 40 && lines[i+1].length < 80) {
        if (!company_name) company_name = lines[i]
        if (!job_profile) job_profile = lines[i+1]
        break
      }
    }
  }

  // 4f. Fallback search for job_profile in lines
  if (!job_profile) {
    for (const l of lines.slice(0, 40)) {
      if (/(?:développeur|developer|engineer|ingénieur|consultant|architecte|lead|manager|tech|software)/i.test(l) &&
          l.length < 75 && !/(?:passer|recherche|notification|accueil|profil)/i.test(l)) {
        job_profile = l.replace(/^[-•*–—]\s*/, '').trim()
        break
      }
    }
  }

  // 4g. Fallback company_name from URL
  if (!company_name && url) {
    company_name = extractCompanyFromUrl(url)
  }

  // 5. Company info (extract description paragraph after "À propos de...")
  let company_info = ''
  const companyInfoMatch = safeContent.match(/(?:À propos de [^\n:]+ :|À propos de l[’']entreprise)[\s\n]+([^\n]{30,300})/i)
  if (companyInfoMatch) {
    company_info = companyInfoMatch[1].trim()
  }

  return {
    company_name: company_name || 'Inconnue',
    job_profile: job_profile || 'Poste à pourvoir',
    proposed_salary,
    primary_skills: foundSkills.slice(0, 6).join(', '),
    main_missions,
    company_info
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, url, title } = await req.json()
    let contentToAnalyze = text;

    if (!contentToAnalyze && url) {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });
      if (!response.ok) throw new Error(`Impossible de récupérer l'URL: ${response.statusText}`);
      const rawHtml = await response.text();
      contentToAnalyze = rawHtml.replace(/<[^>]*>?/gm, ' ')
                                .replace(/\s+/g, ' ')
                                .trim();
    }

    if (!contentToAnalyze) {
      return new Response(JSON.stringify({ error: 'Données manquantes pour l\'analyse' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Always compute robust fallback extraction first
    const fallbackData = smartFallbackExtraction(contentToAnalyze, title, url)

    const prompt = `Analyze this job offer content and extract a clean JSON object.
Context Title: ${title || ''}
Context URL: ${url || ''}
Fields to extract:
- company_name: string (short company name, NEVER empty)
- job_profile: string (job title / role, NEVER empty)
- proposed_salary: string (salary indication or "Non spécifié")
- main_missions: string (list 3 to 6 key missions as bullet points, NEVER raw page dump)
- primary_skills: string (comma-separated key technical skills)
- company_info: string (short 1-2 sentence description of the company)

Job Content:
${contentToAnalyze.substring(0, 5000)}`

    let parsedData: any = null;
    let lastError = null;

    // 1. Try Groq with fast models
    if (GROQ_API_KEY) {
      const groqModels = ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'gemma2-9b-it']
      for (const model of groqModels) {
        if (parsedData) break;
        try {
          const body: any = {
            model,
            messages: [
              { role: 'system', content: 'You are an HR expert system. Return ONLY a valid JSON object matching the requested schema. Do not add markdown formatting or extra text outside JSON.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.1
          }
          if (model.startsWith('llama')) {
            body.response_format = { type: "json_object" }
          }

          const groqResponse = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${GROQ_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })

          const result = await groqResponse.json()
          if (groqResponse.ok && result.choices?.[0]?.message?.content) {
            const cleaned = cleanJsonString(result.choices[0].message.content)
            parsedData = JSON.parse(cleaned)
            break;
          } else {
            lastError = result.error?.message || `Groq (${model}) status ${groqResponse.status}`
          }
        } catch (err: any) {
          lastError = err.message
        }
      }
    }

    // 2. Fallback to Zhipu AI (GLM) if Groq failed or was not configured
    if (!parsedData && ZHIPU_API_KEY) {
      const zhipuEndpoints = [ZHIPU_API_URL_GLOBAL, ZHIPU_API_URL_DOMESTIC]
      const zhipuModels = ['glm-5.3-flash', 'glm-4.7-flash', 'glm-4.5-air']
      
      for (const endpoint of zhipuEndpoints) {
        if (parsedData) break;
        for (const model of zhipuModels) {
          if (parsedData) break;
          try {
            const zhipuResponse = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${ZHIPU_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: 'system', content: 'You are an HR expert system. Return ONLY a valid JSON object matching the requested schema. No intro, no markdown.' },
                  { role: 'user', content: prompt }
                ],
                temperature: 0.1
              }),
            })

            const result = await zhipuResponse.json()
            if (zhipuResponse.ok && result.choices?.[0]?.message?.content) {
              const cleaned = cleanJsonString(result.choices[0].message.content)
              parsedData = JSON.parse(cleaned)
              break;
            } else {
              lastError = result.error?.message || `Zhipu (${model}) status ${zhipuResponse.status}`
            }
          } catch (err: any) {
            lastError = err.message
          }
        }
      }
    }

    // 3. Fallback extraction if all AI providers failed
    if (!parsedData) {
      console.warn(`All AI providers failed (${lastError}). Using resilient smart fallback extraction.`);
      parsedData = fallbackData;
    } else {
      // Ensure AI parsed data doesn't have missing / empty crucial fields
      if (!parsedData.company_name || !parsedData.company_name.trim() || parsedData.company_name.toLowerCase() === 'unknown') {
        parsedData.company_name = fallbackData.company_name;
      }
      if (!parsedData.job_profile || !parsedData.job_profile.trim()) {
        parsedData.job_profile = fallbackData.job_profile;
      }
      if (!parsedData.proposed_salary || !parsedData.proposed_salary.trim()) {
        parsedData.proposed_salary = fallbackData.proposed_salary;
      }
      if (!parsedData.main_missions || !parsedData.main_missions.trim() || parsedData.main_missions.length < 10) {
        parsedData.main_missions = fallbackData.main_missions;
      }
      if (!parsedData.company_info && fallbackData.company_info) {
        parsedData.company_info = fallbackData.company_info;
      }
    }

    // Format fields if model returned arrays
    if (Array.isArray(parsedData.main_missions)) {
      parsedData.main_missions = parsedData.main_missions.join('\n')
    }
    if (Array.isArray(parsedData.primary_skills)) {
      parsedData.primary_skills = parsedData.primary_skills.join(', ')
    }

    // Final safety checks: NEVER return empty strings for company_name or job_profile
    parsedData.company_name = (parsedData.company_name && parsedData.company_name.trim()) || fallbackData.company_name || 'Inconnue'
    parsedData.job_profile = (parsedData.job_profile && parsedData.job_profile.trim()) || fallbackData.job_profile || 'Poste à pourvoir'
    parsedData.proposed_salary = parsedData.proposed_salary || fallbackData.proposed_salary || 'Non spécifié'

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('analyze-job fatal error:', error)
    return new Response(JSON.stringify(smartFallbackExtraction('', '', '')), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
