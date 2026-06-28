"use client"

import { useState, useRef, ChangeEvent, DragEvent } from "react"
import {
  FileText,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Loader2,
  Layers,
  FileStack,
  AlertCircle,
  Check,
  Plus,
  GripVertical,
} from "lucide-react"
import { PDFDocument } from "pdf-lib"
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

interface PDFItem {
  id: string
  file: File
  pageCount: number | null
  loading: boolean
  error?: string
}

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export default function PDFMerger() {
  const [items, setItems] = useState<PDFItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isMerging, setIsMerging] = useState(false)
  const [mergeSuccess, setMergeSuccess] = useState(false)
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)
  const [mergedFilename, setMergedFilename] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Drag and drop reordering states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = async (files: File[]) => {
    const pdfFiles = files.filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    )

    if (pdfFiles.length === 0) return

    const newItems: PDFItem[] = pdfFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9) + Date.now(),
      file,
      pageCount: null,
      loading: true,
    }))

    setItems((prev) => [...prev, ...newItems])
    setMergeSuccess(false)
    setMergedUrl(null)
    setErrorMessage(null)

    // Read page counts asynchronously
    for (const item of newItems) {
      try {
        const arrayBuffer = await item.file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
        const count = pdfDoc.getPageCount()
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, pageCount: count, loading: false } : i))
        )
      } catch (err) {
        console.error("Error reading PDF:", err)
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, loading: false, error: "Failed to parse PDF (may be password protected)" }
              : i
          )
        )
      }
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files))
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
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

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= items.length) return
    const newItems = [...items]
    const [moved] = newItems.splice(index, 1)
    newItems.splice(targetIndex, 0, moved)
    setItems(newItems)
    setMergeSuccess(false)
    setMergedUrl(null)
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setMergeSuccess(false)
    setMergedUrl(null)
  }

  const clearAll = () => {
    setItems([])
    setMergeSuccess(false)
    setMergedUrl(null)
    setErrorMessage(null)
  }

  // Item list drag-and-drop reordering handlers
  const handleItemDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation()
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleItemDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedIndex === null || draggedIndex === index) return
    setDragOverIndex(index)
  }

  const handleItemDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedIndex === null || draggedIndex === index) return
    const newItems = [...items]
    const [draggedItem] = newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem)
    setItems(newItems)
    setDraggedIndex(null)
    setDragOverIndex(null)
    setMergeSuccess(false)
    setMergedUrl(null)
  }

  const handleItemDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleMerge = async () => {
    if (items.length < 2) {
      setErrorMessage("Please add at least 2 PDF files to merge.")
      return
    }

    setIsMerging(true)
    setErrorMessage(null)
    setMergeSuccess(false)
    setMergedUrl(null)

    try {
      const mergedPdf = await PDFDocument.create()

      for (const item of items) {
        if (item.error) continue
        const arrayBuffer = await item.file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes as unknown as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      setMergedUrl(url)
      setMergedFilename(`merged_${Date.now()}.pdf`)
      setMergeSuccess(true)
    } catch (err) {
      console.error("Failed to merge PDFs:", err)
      setErrorMessage("Failed to merge PDFs. Please check if any files are corrupted.")
    } finally {
      setIsMerging(false)
    }
  }

  const downloadFile = () => {
    if (!mergedUrl) return
    const link = document.createElement("a")
    link.href = mergedUrl
    link.download = mergedFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalPages = items.reduce((acc, item) => acc + (item.pageCount || 0), 0)
  const totalSizeBytes = items.reduce((acc, item) => acc + item.file.size, 0)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="w-full max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                  <FileStack className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-xl leading-none">PDF Merger</CardTitle>
                  <CardDescription className="mt-1">
                    Combine multiple PDF files into a single document seamlessly
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-border hover:border-primary/50 hover:bg-muted/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload <span className="font-normal text-muted-foreground">or drag and drop</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Select multiple PDF files to combine</p>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Alert & Manual Download Button */}
              {mergeSuccess && mergedUrl && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 transition-all animate-in fade-in-50 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        PDFs Merged Successfully!
                      </p>
                      <p className="text-xs text-green-600/90 dark:text-green-400/90 mt-0.5">
                        Your combined file is ready for download.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={downloadFile}
                    className="w-full sm:w-auto h-9 bg-green-600 hover:bg-green-700 text-white gap-2 text-xs font-semibold shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download Merged PDF
                  </Button>
                </div>
              )}

              {/* File List Header & Controls */}
              {items.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">Selected Files</h3>
                      <Badge variant="secondary" className="text-xs">
                        {items.length} {items.length === 1 ? "file" : "files"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 text-xs gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add More
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {/* PDF Items List with Drag-to-up/down support */}
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleItemDragStart(e, index)}
                        onDragOver={(e) => handleItemDragOver(e, index)}
                        onDrop={(e) => handleItemDrop(e, index)}
                        onDragEnd={handleItemDragEnd}
                        className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                          draggedIndex === index
                            ? "opacity-40 border-dashed border-primary"
                            : dragOverIndex === index
                            ? "border-primary bg-primary/10 scale-[1.01]"
                            : item.error
                            ? "border-red-500/30 bg-red-500/5"
                            : "border-border bg-card hover:border-border/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="text-muted-foreground/60 hover:text-muted-foreground transition-colors shrink-0">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-foreground truncate">{item.file.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                              <span>{formatBytes(item.file.size)}</span>
                              <span>•</span>
                              {item.loading ? (
                                <span className="flex items-center gap-1">
                                  <Loader2 className="w-3 h-3 animate-spin" /> Reading...
                                </span>
                              ) : item.error ? (
                                <span className="text-red-500 font-medium">{item.error}</span>
                              ) : (
                                <span>
                                  {item.pageCount} {item.pageCount === 1 ? "page" : "pages"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => moveItem(index, "up")}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === items.length - 1}
                            onClick={() => moveItem(index, "down")}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Footer */}
                  <div className="flex items-center justify-between pt-2 px-1 text-xs text-muted-foreground border-t border-border">
                    <span>
                      Total Pages: <strong className="text-foreground">{totalPages}</strong>
                    </span>
                    <span>
                      Total Size: <strong className="text-foreground">{formatBytes(totalSizeBytes)}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Merge Action Button */}
              <Button
                onClick={handleMerge}
                disabled={items.length < 2 || isMerging || items.some((i) => i.loading)}
                className="w-full h-11 text-sm font-medium gap-2 shadow-sm"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Merging PDFs...
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    Merge {items.length > 0 ? `${items.length} PDFs` : "PDFs"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Note */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">100% Private & Secure: </span>
                  Your PDF files are merged directly inside your web browser. No documents are ever uploaded to any external server.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
