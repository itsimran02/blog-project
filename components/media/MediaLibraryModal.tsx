'use client'

import { useState, useEffect, useRef } from 'react'
import {
  UploadCloud, Image as ImageIcon, Search, Check, Loader2, X, FileImage, ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface MediaItem {
  key: string
  filename: string
  url: string
}

interface MediaLibraryModalProps {
  open: boolean
  onClose: () => void
  onSelectImage: (url: string, altText: string) => void
  title?: string
  buttonLabel?: string
}

export function MediaLibraryModal({
  open,
  onClose,
  onSelectImage,
  title = 'Media Library',
  buttonLabel = 'Insert into Post',
}: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library')
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [altText, setAltText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMedia = async () => {
    setLoadingList(true)
    try {
      const res = await fetch('/api/media/list')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setMediaList(json.data)
        if (json.data.length > 0 && !selectedItem) {
          setSelectedItem(json.data[0])
        }
      }
    } catch {
      toast.error('Failed to load media library')
    }
    setLoadingList(false)
  }

  useEffect(() => {
    if (open) {
      fetchMedia()
    }
  }, [open])

  if (!open) return null

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()
      if (json.success && json.data) {
        toast.success(`Uploaded ${file.name} to Cloudflare R2!`)
        const newItem: MediaItem = {
          key: json.data.key,
          filename: json.data.filename,
          url: json.data.url,
        }
        setMediaList((prev) => [newItem, ...prev])
        setSelectedItem(newItem)
        setActiveTab('library')
      } else {
        toast.error(json.error || 'Upload failed')
      }
    } catch {
      toast.error('Upload failed. Please check network connection.')
    }
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const filteredList = mediaList.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInsert = () => {
    if (!selectedItem) return
    onSelectImage(selectedItem.url, altText)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0">
      <div className="relative w-full max-w-4xl h-[620px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-muted/10 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'library'
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Media Library ({mediaList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" /> Upload Files
            </button>
          </div>

          {activeTab === 'library' && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
              <Input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-xs bg-background"
              />
            </div>
          )}
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* TAB 1: UPLOAD FILES */}
          {activeTab === 'upload' && (
            <div
              className={`flex-1 p-8 flex flex-col items-center justify-center border-2 border-dashed transition-all m-6 rounded-2xl ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border/80 bg-muted/10'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />

              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm font-semibold text-foreground">Uploading to Cloudflare R2...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">Drop image files here to upload</h4>
                    <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP, GIF, SVG up to 10 MB</p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-5"
                  >
                    Select File from Computer
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEDIA LIBRARY GRID */}
          {activeTab === 'library' && (
            <div className="flex-1 flex min-h-0">
              <div className="flex-1 p-4 overflow-y-auto">
                {loadingList ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : filteredList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-3 p-6">
                    <FileImage className="w-10 h-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground font-medium">No media items found.</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveTab('upload')}
                      className="text-xs"
                    >
                      Upload your first image
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredList.map((item) => {
                      const isSelected = selectedItem?.key === item.key
                      return (
                        <div
                          key={item.key}
                          onClick={() => setSelectedItem(item)}
                          className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all bg-muted ${
                            isSelected
                              ? 'border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]'
                              : 'border-transparent hover:border-border/80'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.url}
                            alt={item.filename}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><path fill="%2394a3b8" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>'
                            }}
                          />
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[10px] text-white truncate font-medium">{item.filename}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* INSPECTOR SIDEBAR */}
              {selectedItem && (
                <div className="w-72 border-l border-border/60 bg-muted/20 p-4 space-y-4 overflow-y-auto flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Attachment Details</h4>

                    <div className="rounded-xl overflow-hidden aspect-video bg-muted border border-border/60 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedItem.url} alt={selectedItem.filename} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-foreground truncate">{selectedItem.filename}</p>
                      <a
                        href={selectedItem.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-primary hover:underline flex items-center gap-1 truncate"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" /> View full resolution
                      </a>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-border/60">
                      <Label className="text-xs font-semibold text-muted-foreground">Alt Text (Alternative Text)</Label>
                      <Input
                        type="text"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Describe the image for SEO..."
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60">
                    <Button
                      type="button"
                      onClick={handleInsert}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                    >
                      {buttonLabel}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
