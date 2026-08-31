'use client'

import { useState } from 'react'
import {
  CheckCircle2, AlertCircle, Sparkles, Eye, Smartphone, Monitor, Search, ChevronDown, ChevronUp, BookOpen,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { analyzeSeo } from '@/lib/seo/analyzer'

interface SeoAnalyzerPanelProps {
  title: string
  seoTitle: string
  excerpt: string
  seoDescription: string
  content: string
  slug: string
  onSeoTitleChange: (val: string) => void
  onSeoDescriptionChange: (val: string) => void
}

export function SeoAnalyzerPanel({
  title,
  seoTitle,
  excerpt,
  seoDescription,
  content,
  slug,
  onSeoTitleChange,
  onSeoDescriptionChange,
}: SeoAnalyzerPanelProps) {
  const [focusKeyword, setFocusKeyword] = useState('')
  const [activeTab, setActiveTab] = useState<'checklist' | 'preview'>('checklist')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [showAllPassed, setShowAllPassed] = useState(false)

  const analysis = analyzeSeo({
    title,
    seoTitle,
    excerpt,
    seoDescription,
    content,
    slug,
    focusKeyword,
  })

  const score = analysis.score

  // Score status colors
  const getScoreColor = (s: number) => {
    if (s >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30', label: 'Excellent' }
    if (s >= 50) return { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30', label: 'Good' }
    return { bg: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30', label: 'Needs Work' }
  }

  const scoreStatus = getScoreColor(score)

  const displayTitle = seoTitle || title || 'Post Title Preview'
  const displaySlug = slug || 'your-article-slug'
  const displayDesc = seoDescription || excerpt || 'Add a meta description to control how your article appears in search engines.'

  return (
    <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden space-y-0">
      {/* ── Panel Header & Score Bar ───────────────────────────────── */}
      <div className="p-4 border-b border-border/60 bg-muted/20 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">SEO Optimization</span>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-muted p-1 rounded-xl border border-border/50 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeTab === 'checklist' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Checklist
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'preview' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-3 h-3" /> SERP Preview
            </button>
          </div>
        </div>

        {/* ── Score Meter Gauge ────────────────────────────────────────── */}
        <div className="bg-card p-4 rounded-xl border border-border/60 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${scoreStatus.text}`}>{score}</span>
              <span className="text-xs text-muted-foreground font-semibold">/ 100</span>
            </div>
            <span className="text-xs font-bold text-foreground">{scoreStatus.label} SEO Score</span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="w-28 h-2.5 bg-muted rounded-full overflow-hidden border border-border/60">
              <div
                className={`h-full ${scoreStatus.bg} transition-all duration-500`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">
              {analysis.wordCount} words • {analysis.keywordDensity}% density
            </span>
          </div>
        </div>

        {/* ── Focus Keyword Input ──────────────────────────────────────── */}
        <div className="space-y-1.5 pt-1">
          <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Search className="w-3 h-3 text-primary" /> Target Focus Keyword
          </Label>
          <Input
            type="text"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="e.g. STEM Scholarship, Artificial Intelligence..."
            className="h-9 text-xs bg-card border-border/80 placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* ── Tab 1: Actionable SEO Checklist ────────────────────────────── */}
      {activeTab === 'checklist' && (
        <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
          {/* Points to Improve */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Points to Improve ({analysis.improvements.length})
            </h4>

            {analysis.improvements.length === 0 ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                🎉 All SEO checks passed! Your article is fully optimized for search engines.
              </p>
            ) : (
              <div className="space-y-2">
                {analysis.improvements.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1 text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {rule.label}
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed pl-5">{rule.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Passed Checks */}
          {analysis.passedChecks.length > 0 && (
            <div className="pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() => setShowAllPassed(!showAllPassed)}
                className="w-full flex items-center justify-between text-xs font-bold text-foreground uppercase tracking-wider py-1 hover:text-primary transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Passed Checks ({analysis.passedChecks.length})
                </span>
                {showAllPassed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAllPassed && (
                <div className="space-y-2 mt-2">
                  {analysis.passedChecks.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-2.5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-0.5 text-xs"
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {rule.label}
                      </div>
                      <p className="text-muted-foreground text-[11px] pl-5">{rule.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Google SERP Snippet Preview ──────────────────────────── */}
      {activeTab === 'preview' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">Google Search Snippet</span>
            <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground'}`}
                aria-label="Desktop preview"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground'}`}
                aria-label="Mobile preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Google Card Component */}
          <div className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-xs space-y-1.5 ${previewDevice === 'mobile' ? 'max-w-xs mx-auto' : 'w-full'}`}>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold">V</div>
              <span className="truncate">versatilescientist.org › blog › {displaySlug}</span>
            </div>
            <h3 className="text-blue-600 dark:text-blue-400 font-semibold text-lg hover:underline cursor-pointer leading-snug line-clamp-1">
              {displayTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed line-clamp-2">
              {displayDesc}
            </p>
          </div>

          {/* Meta inputs */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <Label className="text-xs text-muted-foreground font-semibold">SEO Title Override</Label>
                <span className="text-[10px] text-muted-foreground">{displayTitle.length} / 60 chars</span>
              </div>
              <Input
                type="text"
                value={seoTitle}
                onChange={(e) => onSeoTitleChange(e.target.value)}
                placeholder="Defaults to post title if left blank..."
                className="h-8 text-xs bg-background"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <Label className="text-xs text-muted-foreground font-semibold">SEO Meta Description</Label>
                <span className="text-[10px] text-muted-foreground">{displayDesc.length} / 160 chars</span>
              </div>
              <Textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => onSeoDescriptionChange(e.target.value)}
                placeholder="Defaults to excerpt if left blank..."
                className="text-xs leading-relaxed resize-none bg-background"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
