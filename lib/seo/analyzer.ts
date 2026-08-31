export interface SeoRuleResult {
  id: string
  label: string
  passed: boolean
  message: string
  weight: number
  category: 'title' | 'description' | 'content' | 'slug' | 'links'
}

export interface SeoAnalysisInput {
  title: string
  seoTitle: string
  excerpt: string
  seoDescription: string
  content: string
  slug: string
  focusKeyword: string
}

export interface SeoAnalysisOutput {
  score: number // 0 to 100
  passedChecks: SeoRuleResult[]
  improvements: SeoRuleResult[]
  wordCount: number
  keywordDensity: number
  readabilityScore: number
}

function stripHtml(html: string): string {
  return (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getWordCount(text: string): number {
  const clean = stripHtml(text)
  if (!clean) return 0
  return clean.split(/\s+/).filter(Boolean).length
}

export function analyzeSeo(input: SeoAnalysisInput): SeoAnalysisOutput {
  const { title, seoTitle, excerpt, seoDescription, content, slug, focusKeyword } = input

  const activeTitle = (seoTitle || title || '').trim()
  const activeDesc = (seoDescription || excerpt || '').trim()
  const cleanContent = stripHtml(content)
  const totalWords = getWordCount(content)
  const kw = (focusKeyword || '').trim().toLowerCase()

  const rules: SeoRuleResult[] = []

  // If no focus keyword is set, return default guidance
  if (!kw) {
    return {
      score: activeTitle && activeDesc && totalWords > 100 ? 50 : 20,
      passedChecks: [],
      improvements: [
        {
          id: 'missing-keyword',
          label: 'Set a Focus Keyword',
          passed: false,
          message: 'Enter a target keyword to unlock full on-page SEO optimization recommendations.',
          weight: 0,
          category: 'title',
        },
      ],
      wordCount: totalWords,
      keywordDensity: 0,
      readabilityScore: 70,
    }
  }

  // 1. Focus Keyword in Title
  const titleHasKw = activeTitle.toLowerCase().includes(kw)
  rules.push({
    id: 'title-keyword',
    label: 'Focus Keyword in Title',
    passed: titleHasKw,
    message: titleHasKw
      ? 'Your focus keyword appears in the title.'
      : `Add your focus keyword "${kw}" to the title or SEO title.`,
    weight: 15,
    category: 'title',
  })

  // 2. Title Length (Optimal 40 - 60 chars)
  const titleLength = activeTitle.length
  const titleLengthOk = titleLength >= 40 && titleLength <= 60
  rules.push({
    id: 'title-length',
    label: 'Title Length (40-60 chars)',
    passed: titleLengthOk,
    message: titleLengthOk
      ? `Title length is optimal (${titleLength} chars).`
      : titleLength < 40
      ? `Title is too short (${titleLength} chars). Aim for 40–60 characters for best Google display.`
      : `Title is too long (${titleLength} chars). Keep under 60 chars to prevent truncation.`,
    weight: 10,
    category: 'title',
  })

  // 3. Keyword Position in Title
  const kwTitleIndex = activeTitle.toLowerCase().indexOf(kw)
  const kwAtTitleStart = kwTitleIndex >= 0 && kwTitleIndex <= Math.floor(activeTitle.length / 2)
  rules.push({
    id: 'title-keyword-position',
    label: 'Focus Keyword Near Beginning of Title',
    passed: kwAtTitleStart,
    message: kwAtTitleStart
      ? 'Focus keyword appears near the beginning of your title.'
      : 'Move your focus keyword closer to the beginning of the title.',
    weight: 5,
    category: 'title',
  })

  // 4. Focus Keyword in Meta Description
  const descHasKw = activeDesc.toLowerCase().includes(kw)
  rules.push({
    id: 'description-keyword',
    label: 'Focus Keyword in Meta Description',
    passed: descHasKw,
    message: descHasKw
      ? 'Your focus keyword appears in the meta description.'
      : `Include your focus keyword "${kw}" in the meta description or excerpt.`,
    weight: 10,
    category: 'description',
  })

  // 5. Meta Description Length (Optimal 120 - 160 chars)
  const descLength = activeDesc.length
  const descLengthOk = descLength >= 120 && descLength <= 160
  rules.push({
    id: 'description-length',
    label: 'Meta Description Length (120-160 chars)',
    passed: descLengthOk,
    message: descLengthOk
      ? `Meta description length is optimal (${descLength} chars).`
      : descLength < 120
      ? `Meta description is too short (${descLength} chars). Expand to 120–160 chars for maximum search impact.`
      : `Meta description is too long (${descLength} chars). Keep under 160 chars to avoid truncation on SERPs.`,
    weight: 10,
    category: 'description',
  })

  // 6. Focus Keyword in URL Slug
  const kwSlugFormatted = kw.replace(/\s+/g, '-')
  const slugHasKw = (slug || '').toLowerCase().includes(kwSlugFormatted) || (slug || '').toLowerCase().includes(kw.replace(/\s+/g, ''))
  rules.push({
    id: 'slug-keyword',
    label: 'Focus Keyword in URL Slug',
    passed: slugHasKw,
    message: slugHasKw
      ? 'Focus keyword is included in the URL slug.'
      : `Include "${kwSlugFormatted}" in your URL slug.`,
    weight: 10,
    category: 'slug',
  })

  // 7. Keyword in Introduction (first 100 words)
  const introWords = cleanContent.split(/\s+/).slice(0, 100).join(' ').toLowerCase()
  const kwInIntro = introWords.includes(kw)
  rules.push({
    id: 'content-intro-keyword',
    label: 'Focus Keyword in Introduction',
    passed: kwInIntro,
    message: kwInIntro
      ? 'Focus keyword appears in the first 100 words of content.'
      : 'Add your focus keyword to the opening paragraph/introduction of your article.',
    weight: 10,
    category: 'content',
  })

  // 8. Content Word Count (Minimum 300 words, ideal 600+)
  const wordCountOk = totalWords >= 400
  rules.push({
    id: 'content-length',
    label: 'Content Word Count (400+ words)',
    passed: wordCountOk,
    message: wordCountOk
      ? `Content length is strong (${totalWords} words).`
      : `Content length is low (${totalWords} words). Aim for at least 400 words for better search ranking.`,
    weight: 10,
    category: 'content',
  })

  // 9. Keyword Density (0.5% to 2.5%)
  const matches = (cleanContent.toLowerCase().match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
  const density = totalWords > 0 ? (matches / totalWords) * 100 : 0
  const densityOk = density >= 0.5 && density <= 2.5
  rules.push({
    id: 'keyword-density',
    label: 'Keyword Density (0.5% - 2.5%)',
    passed: densityOk,
    message: densityOk
      ? `Keyword density is optimal (${density.toFixed(1)}% - ${matches} occurrences).`
      : density < 0.5
      ? `Keyword density is low (${density.toFixed(1)}%). Mention "${kw}" a few more times in your post.`
      : `Keyword density is too high (${density.toFixed(1)}%). Reduce keyword usage to prevent keyword stuffing penalties.`,
    weight: 10,
    category: 'content',
  })

  // 10. Keyword in Subheadings (H2 / H3)
  const headings = (content.match(/<h[23][^>]*>(.*?)<\/h[23]>/gi) || []).map((h) => stripHtml(h).toLowerCase())
  const headingsWithKw = headings.filter((h) => h.includes(kw))
  const headingOk = headings.length > 0 && headingsWithKw.length > 0
  rules.push({
    id: 'subheading-keyword',
    label: 'Focus Keyword in Subheadings (H2/H3)',
    passed: headingOk,
    message: headingOk
      ? `Focus keyword appears in ${headingsWithKw.length} subheading(s).`
      : headings.length === 0
      ? 'Add H2 or H3 subheadings to structure your article and include your keyword.'
      : 'Include your focus keyword in at least one H2 or H3 subheading.',
    weight: 10,
    category: 'content',
  })

  // 11. Links Present in Content
  const hasLinks = /<a\s+[^>]*href=["'][^"']+["'][^>]*>/i.test(content)
  rules.push({
    id: 'content-links',
    label: 'Internal / External Links',
    passed: hasLinks,
    message: hasLinks
      ? 'Your article includes links to relevant resources.'
      : 'Add links to authoritative external sites or other articles on your blog.',
    weight: 10,
    category: 'links',
  })

  // Calculate Weighted Score
  const totalWeight = rules.reduce((acc, r) => acc + r.weight, 0)
  const passedWeight = rules.filter((r) => r.passed).reduce((acc, r) => acc + r.weight, 0)
  const finalScore = Math.round((passedWeight / totalWeight) * 100)

  const passedChecks = rules.filter((r) => r.passed)
  const improvements = rules.filter((r) => !r.passed)

  return {
    score: finalScore,
    passedChecks,
    improvements,
    wordCount: totalWords,
    keywordDensity: Number(density.toFixed(2)),
    readabilityScore: 75,
  }
}
