"use client"

import { useState, useRef, ChangeEvent, DragEvent } from "react"
import {
  FileText,
  Upload,
  Trash2,
  Download,
  Loader2,
  FileStack,
  AlertCircle,
  Check,
  Plus,
  RotateCw,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Eye,
  CheckSquare,
  Square,
  Grid,
  Sparkles,
  Layers,
  X,
} from "lucide-react"
import { PDFDocument, degrees } from "pdf-lib"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface SourceDoc {
  id: string
  name: string
  file: File
  pageCount: number
  color: string
}

interface PageItem {
  id: string
  docId: string
  docName: string
  docColor: string
  originalPageIndex: number // 0-indexed
  rotation: number // 0, 90, 180, 270
  selected: boolean
  thumbnail?: string
}

const COLOR_PALETTE = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
]

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export default function PDFOrganizer() {
  const [sourceDocs, setSourceDocs] = useState<SourceDoc[]>([])
  const [pages, setPages] = useState<PageItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Export result state
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)
  const [mergedFilename, setMergedFilename] = useState<string>("")
  const [mergedSize, setMergedSize] = useState<number>(0)

  // Drag and drop reordering states
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null)
  const [dragOverPageIndex, setDragOverPageIndex] = useState<number | null>(null)

  // Preview Modal
  const [previewPage, setPreviewPage] = useState<PageItem | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = async (files: File[]) => {
    const pdfFiles = files.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    )

    if (pdfFiles.length === 0) return

    setIsLoadingFiles(true)
    setErrorMessage(null)
    setMergedUrl(null)

    const newDocs: SourceDoc[] = []
    const newPages: PageItem[] = []

    for (let index = 0; index < pdfFiles.length; index++) {
      const file = pdfFiles[index]
      const docId = Math.random().toString(36).substring(2, 9) + Date.now()
      const color = COLOR_PALETTE[(sourceDocs.length + index) % COLOR_PALETTE.length]

      try {
        const arrayBuffer = await file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
        const pageCount = pdfDoc.getPageCount()

        const sourceDoc: SourceDoc = {
          id: docId,
          name: file.name,
          file,
          pageCount,
          color,
        }
        newDocs.push(sourceDoc)

        for (let i = 0; i < pageCount; i++) {
          newPages.push({
            id: `${docId}-p${i}-${Math.random().toString(36).substring(2, 5)}`,
            docId,
            docName: file.name,
            docColor: color,
            originalPageIndex: i,
            rotation: 0,
            selected: true,
          })
        }
      } catch (err) {
        console.error("Error reading PDF:", err)
        setErrorMessage(`Failed to read "${file.name}". It might be encrypted or corrupted.`)
      }
    }

    setSourceDocs((prev) => [...prev, ...newDocs])
    setPages((prev) => [...prev, ...newPages])
    setIsLoadingFiles(false)

    // Render thumbnails asynchronously
    renderThumbnailsForFiles(newDocs, newPages)
  }

  const renderThumbnailsForFiles = async (newDocs: SourceDoc[], newPages: PageItem[]) => {
    try {
      if (!(window as unknown as { pdfjsLib?: unknown }).pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      const pdfjsLib = (window as unknown as { pdfjsLib: { GlobalWorkerOptions: { workerSrc: string }; getDocument: (data: { data: Uint8Array }) => { promise: Promise<unknown> } } }).pdfjsLib
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"

      for (const doc of newDocs) {
        const arrayBuffer = await doc.file.arrayBuffer()
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) })
        const pdfDoc = (await loadingTask.promise) as { getPage: (num: number) => Promise<unknown> }

        for (let i = 0; i < doc.pageCount; i++) {
          const page = (await pdfDoc.getPage(i + 1)) as {
            getViewport: (opts: { scale: number }) => { width: number; height: number }
            render: (params: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void> }
          }
          const viewport = page.getViewport({ scale: 0.35 })
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")

          if (context) {
            canvas.height = viewport.height
            canvas.width = viewport.width
            await page.render({ canvasContext: context, viewport }).promise
            const dataUrl = canvas.toDataURL("image/png")

            setPages((prev) =>
              prev.map((p) =>
                p.docId === doc.id && p.originalPageIndex === i ? { ...p, thumbnail: dataUrl } : p
              )
            )
          }
        }
      }
    } catch (err) {
      console.warn("Canvas thumbnail generation error:", err)
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files))
      e.target.value = ""
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files))
    }
  }

  // Page manipulations
  const togglePageSelect = (id: string) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)))
  }

  const rotatePage = (id: string, delta: number) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newRot = (p.rotation + delta + 360) % 360
          return { ...p, rotation: newRot }
        }
        return p
      })
    )
  }

  const deletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id))
  }

  const movePage = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= pages.length) return
    const updated = [...pages]
    const [movedItem] = updated.splice(index, 1)
    updated.splice(targetIndex, 0, movedItem)
    setPages(updated)
  }

  const selectAll = () => setPages((prev) => prev.map((p) => ({ ...p, selected: true })))
  const deselectAll = () => setPages((prev) => prev.map((p) => ({ ...p, selected: false })))
  const clearAll = () => {
    setSourceDocs([])
    setPages([])
    setMergedUrl(null)
  }

  // HTML5 Drag reorder for page cards
  const handleItemDragStart = (index: number) => setDraggedPageIndex(index)
  const handleItemDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    setDragOverPageIndex(index)
  }
  const handleItemDrop = (index: number) => {
    if (draggedPageIndex === null || draggedPageIndex === index) {
      setDraggedPageIndex(null)
      setDragOverPageIndex(null)
      return
    }
    const updated = [...pages]
    const [movedItem] = updated.splice(draggedPageIndex, 1)
    updated.splice(index, 0, movedItem)
    setPages(updated)
    setDraggedPageIndex(null)
    setDragOverPageIndex(null)
  }

  // Merge execution
  const handleMergeAndExport = async () => {
    const selectedPages = pages.filter((p) => p.selected)
    if (selectedPages.length === 0) {
      setErrorMessage("Please select at least one page to merge.")
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const mergedPdf = await PDFDocument.create()
      const loadedDocsMap: { [docId: string]: PDFDocument } = {}

      for (const p of selectedPages) {
        if (!loadedDocsMap[p.docId]) {
          const src = sourceDocs.find((d) => d.id === p.docId)
          if (src) {
            const buffer = await src.file.arrayBuffer()
            loadedDocsMap[p.docId] = await PDFDocument.load(buffer, { ignoreEncryption: true })
          }
        }
        const srcDoc = loadedDocsMap[p.docId]
        if (srcDoc) {
          const [copiedPage] = await mergedPdf.copyPages(srcDoc, [p.originalPageIndex])
          if (p.rotation !== 0) {
            const current = copiedPage.getRotation().angle
            copiedPage.setRotation(degrees((current + p.rotation) % 360))
          }
          mergedPdf.addPage(copiedPage)
        }
      }

      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const filename = `Organized_Toolkit_${Date.now()}.pdf`
      setMergedUrl(url)
      setMergedFilename(filename)
      setMergedSize(blob.size)
    } catch (err) {
      console.error("Merge error:", err)
      setErrorMessage("Failed to merge PDF pages. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedCount = pages.filter((p) => p.selected).length

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="gap-1 text-xs px-2.5 py-0.5 font-medium">
                <Sparkles className="w-3 h-3 text-primary" /> Multi-PDF Studio
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              PDF Split & Merge Studio
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload multiple PDFs at once, extract pages, reorder visually, select needed pages, and merge into a new document.
            </p>
          </div>

          {pages.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoadingFiles}
                className="gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add PDFs
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={clearAll}
                className="gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Clear Studio
              </Button>
            </div>
          )}
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
            <button onClick={() => setErrorMessage(null)} className="opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* File Dropzone if no pages */}
        {pages.length === 0 ? (
          <Card className="border-2 border-dashed border-border transition-colors hover:border-primary/50">
            <CardContent className="p-0">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center py-16 px-6 text-center cursor-pointer transition-colors ${
                  isDragging ? "bg-primary/5" : ""
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  {isLoadingFiles ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <Layers className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Upload PDF files to start organizing
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mb-6">
                  Drag & drop multiple PDF files here, or click to browse from your computer. You can split, reorder, rotate, and merge all in one workspace.
                </p>
                <Button disabled={isLoadingFiles} className="gap-2 shadow-sm">
                  <Upload className="w-4 h-4" /> Choose PDF Files
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Hidden file input for adding more files */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Document Badges Summary */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-card border border-border">
              <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Source Files ({sourceDocs.length}):
              </span>
              {sourceDocs.map((doc) => (
                <Badge key={doc.id} variant="outline" className={`gap-1.5 text-xs py-1 ${doc.color}`}>
                  <span className="font-medium truncate max-w-[160px]">{doc.name}</span>
                  <span className="opacity-70">({doc.pageCount} pgs)</span>
                </Badge>
              ))}
            </div>

            {/* Workbench Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" variant="secondary" onClick={selectAll} className="gap-1.5 text-xs">
                  <CheckSquare className="w-3.5 h-3.5" /> Select All ({pages.length})
                </Button>
                <Button size="sm" variant="ghost" onClick={deselectAll} className="gap-1.5 text-xs">
                  <Square className="w-3.5 h-3.5" /> Deselect All
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground">
                  Selected: <strong className="text-foreground">{selectedCount}</strong> / {pages.length} pages
                </div>

                <Button
                  onClick={handleMergeAndExport}
                  disabled={isProcessing || selectedCount === 0}
                  className="gap-2 shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Merging...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Merge & Download PDF
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Merged Download Banner */}
            {mergedUrl && (
              <Card className="border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20">
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base">
                        Your compiled PDF is ready!
                      </h4>
                      <p className="text-xs opacity-80">
                        {mergedFilename} • {formatBytes(mergedSize)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a href={mergedUrl} download={mergedFilename}>
                      <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Download className="w-4 h-4" /> Download PDF
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Page Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  draggable
                  onDragStart={() => handleItemDragStart(index)}
                  onDragOver={(e) => handleItemDragOver(e, index)}
                  onDrop={() => handleItemDrop(index)}
                  className={`group relative flex flex-col rounded-xl border transition-all duration-200 bg-card ${
                    page.selected
                      ? "border-primary ring-1 ring-primary/30 shadow-sm"
                      : "border-border opacity-60 hover:opacity-90"
                  } ${dragOverPageIndex === index ? "border-dashed border-primary scale-[1.02]" : ""}`}
                >
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border bg-muted/40 text-xs">
                    <div className="flex items-center gap-1 overflow-hidden">
                      <button
                        onClick={() => togglePageSelect(page.id)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {page.selected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <span className="font-semibold text-foreground">#{index + 1}</span>
                    </div>

                    <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => movePage(index, -1)}
                        disabled={index === 0}
                        title="Move left"
                        className="p-1 hover:bg-background rounded disabled:opacity-30"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => movePage(index, 1)}
                        disabled={index === pages.length - 1}
                        title="Move right"
                        className="p-1 hover:bg-background rounded disabled:opacity-30"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deletePage(page.id)}
                        title="Remove page"
                        className="p-1 hover:bg-destructive/10 text-destructive rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Container */}
                  <div
                    onClick={() => togglePageSelect(page.id)}
                    className="relative aspect-[3/4] p-3 flex items-center justify-center cursor-pointer overflow-hidden bg-background/50"
                  >
                    {page.thumbnail ? (
                      <img
                        src={page.thumbnail}
                        alt={`Page ${page.originalPageIndex + 1}`}
                        style={{ transform: `rotate(${page.rotation}deg)` }}
                        className="max-h-full max-w-full object-contain shadow-sm transition-transform duration-200"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
                        <FileText className="w-8 h-8 opacity-40" />
                        <span>Page {page.originalPageIndex + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className="p-2 border-t border-border flex items-center justify-between gap-1 text-xs bg-muted/20">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 truncate max-w-[100px] ${page.docColor}`}>
                      {page.docName}
                    </Badge>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => rotatePage(page.id, 90)}
                        title="Rotate right"
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      {page.thumbnail && (
                        <button
                          onClick={() => setPreviewPage(page)}
                          title="Preview"
                          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {previewPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative max-w-2xl w-full bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-base">Page Preview</h3>
                <p className="text-xs text-muted-foreground">
                  {previewPage.docName} — Page {previewPage.originalPageIndex + 1}
                </p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setPreviewPage(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-muted/20">
              {previewPage.thumbnail && (
                <img
                  src={previewPage.thumbnail}
                  alt="Preview"
                  style={{ transform: `rotate(${previewPage.rotation}deg)` }}
                  className="max-h-[60vh] object-contain shadow-md rounded transition-transform duration-200"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
