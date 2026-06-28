"use client"

import { useState, useRef, useEffect, ChangeEvent, DragEvent } from "react"
import {
  FileText,
  Upload,
  Download,
  Loader2,
  AlertCircle,
  Check,
  Stamp,
  RotateCcw,
  Eye,
} from "lucide-react"
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

const COLOR_PRESETS = [
  { label: "Gray", r: 0.5, g: 0.5, b: 0.5, class: "bg-gray-500", cssColor: "rgba(128, 128, 128" },
  { label: "Red", r: 0.9, g: 0.1, b: 0.1, class: "bg-red-500", cssColor: "rgba(230, 25, 25" },
  { label: "Blue", r: 0.1, g: 0.4, b: 0.9, class: "bg-blue-500", cssColor: "rgba(25, 100, 230" },
  { label: "Black", r: 0.0, g: 0.0, b: 0.0, class: "bg-black", cssColor: "rgba(0, 0, 0" },
]

export default function PDFWatermark() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [isLoadingPdf, setIsLoadingPdf] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Watermark options
  const [text, setText] = useState("CONFIDENTIAL")
  const [fontSize, setFontSize] = useState(48)
  const [opacity, setOpacity] = useState(0.25)
  const [rotation, setRotation] = useState(45)
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0])

  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [resultFilename, setResultFilename] = useState<string>("")

  // Page background preview image
  const [bgPreviewUrl, setBgPreviewUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadPagePreview = async (pdfFile: File) => {
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

      const arrayBuffer = await pdfFile.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) })
      const pdfDoc = (await loadingTask.promise) as { getPage: (num: number) => Promise<unknown> }
      const page = (await pdfDoc.getPage(1)) as {
        getViewport: (opts: { scale: number }) => { width: number; height: number }
        render: (params: { canvasContext: CanvasRenderingContext2D; viewport: unknown }) => { promise: Promise<void> }
      }

      const viewport = page.getViewport({ scale: 0.5 })
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      if (context) {
        canvas.height = viewport.height
        canvas.width = viewport.width
        await page.render({ canvasContext: context, viewport }).promise
        setBgPreviewUrl(canvas.toDataURL("image/png"))
      }
    } catch (e) {
      console.warn("Could not render page preview canvas:", e)
    }
  }

  const handleFileChange = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Please select a valid PDF file.")
      return
    }

    setFile(selectedFile)
    setIsLoadingPdf(true)
    setErrorMessage(null)
    setResultUrl(null)
    setBgPreviewUrl(null)

    try {
      const arrayBuffer = await selectedFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      setPageCount(pdfDoc.getPageCount())
      loadPagePreview(selectedFile)
    } catch (err) {
      console.error("Failed to parse PDF:", err)
      setErrorMessage("Failed to parse PDF file. It may be password protected or corrupted.")
      setFile(null)
      setPageCount(null)
    } finally {
      setIsLoadingPdf(false)
    }
  }

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleApplyWatermark = async () => {
    if (!file || !text.trim()) return

    setIsProcessing(true)
    setErrorMessage(null)
    setResultUrl(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const pages = pdfDoc.getPages()

      const color = rgb(selectedColor.r, selectedColor.g, selectedColor.b)
      const rad = (rotation * Math.PI) / 180

      for (const page of pages) {
        const { width, height } = page.getSize()
        const textWidth = font.widthOfTextAtSize(text, fontSize)
        const textHeight = font.heightAtSize(fontSize)

        // Compute exact origin coordinates so rotated text remains perfectly centered on the page
        const centerX = width / 2
        const centerY = height / 2

        const x = centerX - (textWidth / 2) * Math.cos(rad) + (textHeight / 2) * Math.sin(rad)
        const y = centerY - (textWidth / 2) * Math.sin(rad) - (textHeight / 2) * Math.cos(rad)

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color,
          opacity,
          rotate: degrees(rotation),
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const baseName = file.name.replace(/\.pdf$/i, "")
      setResultFilename(`${baseName}_watermarked.pdf`)
      setResultUrl(url)
    } catch (err) {
      console.error("Watermark failed:", err)
      setErrorMessage("An error occurred while adding watermark to the PDF.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetFile = () => {
    setFile(null)
    setPageCount(null)
    setResultUrl(null)
    setBgPreviewUrl(null)
    setErrorMessage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-4">
            <Stamp className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">PDF Watermark</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Add custom confidential stamps, text watermarks, or branding across all pages of your PDF document.
          </p>
        </div>

        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-between">
              <span>Select Document</span>
              {file && (
                <Button variant="ghost" size="sm" onClick={resetFile} className="text-muted-foreground hover:text-foreground">
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Upload the PDF file you wish to watermark.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileInputChange}
                  accept="application/pdf"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Click to upload or drag & drop</h3>
                <p className="text-sm text-muted-foreground">Select a PDF file to watermark</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm leading-none mb-1">{file.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatBytes(file.size)}</span>
                      <span>•</span>
                      {isLoadingPdf ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Reading pages...
                        </span>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {pageCount} {pageCount === 1 ? "page" : "pages"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {file && pageCount && pageCount > 0 && (
              <div className="space-y-6 pt-2 border-t">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Controls */}
                  <div className="lg:col-span-7 space-y-4">
                    <Label className="text-base font-semibold">Watermark Settings</Label>

                    <div className="space-y-2">
                      <Label htmlFor="wm-text">Watermark Text</Label>
                      <Input
                        id="wm-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g. CONFIDENTIAL, SAMPLE, DO NOT COPY"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="font-size">Font Size ({fontSize}px)</Label>
                        <input
                          type="range"
                          id="font-size"
                          min="20"
                          max="120"
                          value={fontSize}
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="opacity">Opacity ({Math.round(opacity * 100)}%)</Label>
                        <input
                          type="range"
                          id="opacity"
                          min="0.05"
                          max="1"
                          step="0.05"
                          value={opacity}
                          onChange={(e) => setOpacity(Number(e.target.value))}
                          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rotation">Rotation ({rotation}°)</Label>
                        <input
                          type="range"
                          id="rotation"
                          min="-90"
                          max="90"
                          step="5"
                          value={rotation}
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Watermark Color</Label>
                      <div className="flex items-center gap-3">
                        {COLOR_PRESETS.map((col) => (
                          <button
                            key={col.label}
                            type="button"
                            onClick={() => setSelectedColor(col)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                              selectedColor.label === col.label
                                ? "border-primary bg-primary/10 ring-1 ring-primary"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            <span className={`w-3 h-3 rounded-full ${col.class}`} />
                            {col.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Watermark Preview Document */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Eye className="w-3.5 h-3.5" /> Live Watermark Preview
                    </div>
                    <div className="relative w-full h-72 rounded-xl border-2 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex items-center justify-center p-4">
                      {/* Document Page Canvas/Skeleton Background */}
                      {bgPreviewUrl ? (
                        <img src={bgPreviewUrl} alt="Page Preview" className="w-full h-full object-contain opacity-40 pointer-events-none" />
                      ) : (
                        <div className="w-full h-full border border-dashed rounded-lg p-4 flex flex-col justify-between opacity-30 pointer-events-none">
                          <div className="h-4 bg-muted-foreground/30 rounded w-3/4 mb-2" />
                          <div className="space-y-2 flex-1 pt-4">
                            <div className="h-2 bg-muted-foreground/20 rounded w-full" />
                            <div className="h-2 bg-muted-foreground/20 rounded w-5/6" />
                            <div className="h-2 bg-muted-foreground/20 rounded w-4/6" />
                          </div>
                        </div>
                      )}

                      {/* Overlay Live Watermark Text */}
                      {text.trim() && (
                        <div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
                          style={{
                            transform: `rotate(${rotation}deg)`,
                          }}
                        >
                          <span
                            className="font-bold whitespace-nowrap select-none transition-all duration-150"
                            style={{
                              fontSize: `${fontSize * 0.45}px`,
                              color: `${selectedColor.cssColor}, ${opacity})`,
                            }}
                          >
                            {text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleApplyWatermark}
                  disabled={isProcessing || !text.trim()}
                  className="w-full h-11 text-base font-medium"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Applying Watermark...
                    </>
                  ) : (
                    <>
                      <Stamp className="w-5 h-5 mr-2" /> Apply Watermark to PDF
                    </>
                  )}
                </Button>
              </div>
            )}

            {resultUrl && (
              <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Check className="w-5 h-5" /> Watermark added successfully!
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate mr-2">{resultFilename}</span>
                  <a href={resultUrl} download={resultFilename}>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shrink-0">
                      <Download className="w-4 h-4" /> Download PDF
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
