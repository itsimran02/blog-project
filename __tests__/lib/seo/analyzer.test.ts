import { describe, it, expect } from 'vitest'
import { analyzeSeo } from '@/lib/seo/analyzer'

describe('SEO Scoring Engine (analyzeSeo)', () => {
  it('returns initial low score when no focus keyword is specified', () => {
    const result = analyzeSeo({
      title: 'Sample Title',
      seoTitle: '',
      excerpt: 'Sample excerpt',
      seoDescription: '',
      content: '<p>Some content here</p>',
      slug: 'sample-title',
      focusKeyword: '',
    })

    expect(result.score).toBeLessThanOrEqual(50)
    expect(result.improvements.length).toBeGreaterThan(0)
    expect(result.improvements[0].id).toBe('missing-keyword')
  })

  it('calculates high score when all SEO rules are satisfied', () => {
    const focusKeyword = 'STEM Scholarship'
    const title = 'Global STEM Scholarship Application Guide 2026' // 46 chars
    const seoDescription = 'Discover expert tips, proposal templates, and full guidelines to win the global STEM scholarship this academic year. Complete application guide.' // 152 chars
    const content = `
      <p>Winning a <strong>STEM Scholarship</strong> opens massive international research opportunities for aspiring scholars worldwide. In this detailed guide, we break down every single requirement to boost your chances.</p>
      <h2>Why Apply for a STEM Scholarship?</h2>
      <p>A STEM scholarship provides tuition coverage, monthly stipends, and access to state-of-the-art laboratories. Make sure to check the official guidelines early so you do not miss deadlines.</p>
      <h2>Key Requirements for STEM Scholarship Applicants</h2>
      <p>Securing a STEM scholarship requires a stellar statement of purpose, strong recommendation letters, and a clear research methodology statement. Make sure your application stands out by demonstrating your leadership and academic potential.</p>
      <p>For additional fellowship details, visit our <a href="https://example.com/grants">research grants portal</a>.</p>
      <p>We hope this STEM Scholarship guide empowers your academic journey and career success!</p>
      ${'<p>Additional paragraph detailing research grants, laboratory assistantships, and funding opportunities for undergraduate and postgraduate students.</p>'.repeat(6)}
    `
    const slug = 'global-stem-scholarship-application-guide-2026'

    const result = analyzeSeo({
      title,
      seoTitle: title,
      excerpt: seoDescription,
      seoDescription,
      content,
      slug,
      focusKeyword,
    })

    expect(result.score).toBeGreaterThanOrEqual(80)
    expect(result.passedChecks.length).toBeGreaterThan(5)
    expect(result.wordCount).toBeGreaterThan(200)
  })

  it('identifies missing focus keyword in title and meta description as improvements', () => {
    const result = analyzeSeo({
      title: 'Generic Academic Guide',
      seoTitle: '',
      excerpt: 'Short excerpt without keyword',
      seoDescription: '',
      content: '<p>Generic post content without focus keyword.</p>',
      slug: 'generic-academic-guide',
      focusKeyword: 'Artificial Intelligence',
    })

    const titleCheck = result.improvements.find((r) => r.id === 'title-keyword')
    const descCheck = result.improvements.find((r) => r.id === 'description-keyword')

    expect(titleCheck).toBeDefined()
    expect(descCheck).toBeDefined()
    expect(result.score).toBeLessThan(50)
  })
})
