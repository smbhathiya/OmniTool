"use client"

import { useState } from "react"
import { Barcode as BarcodeIcon, Download } from "lucide-react"
import Barcode from "react-barcode"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

type BarcodeFormat =
  | "CODE128"
  | "CODE39"
  | "EAN13"
  | "EAN8"
  | "UPC"

const FORMATS: { label: string; value: BarcodeFormat; hint: string }[] = [
  { label: "CODE128", value: "CODE128", hint: "Any text or numbers" },
  { label: "CODE39",  value: "CODE39",  hint: "A-Z, 0-9 and - . $ / + % space" },
  { label: "EAN-13",  value: "EAN13",   hint: "Exactly 12 digits" },
  { label: "EAN-8",   value: "EAN8",    hint: "Exactly 7 digits" },
  { label: "UPC",     value: "UPC",     hint: "Exactly 11 digits" },
]

function isValidForFormat(value: string, format: BarcodeFormat): boolean {
  if (!value) return false
  switch (format) {
    case "EAN13": return /^\d{12}$/.test(value)
    case "EAN8":  return /^\d{7}$/.test(value)
    case "UPC":   return /^\d{11}$/.test(value)
    case "CODE39": return /^[A-Z0-9\-. $/+%]+$/i.test(value)
    default: return value.length > 0
  }
}

function svgToPng(svgEl: SVGSVGElement): Promise<string> {
  return new Promise((resolve) => {
    const bbox = svgEl.getBoundingClientRect()
    const svgData = new XMLSerializer().serializeToString(svgEl)
    const blob = new Blob([svgData], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const padding = 60
      canvas.width = (bbox.width || 300) + padding * 2
      canvas.height = (bbox.height || 100) + padding * 2
      const ctx = canvas.getContext("2d")!
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, padding, padding, bbox.width || 300, bbox.height || 100)
      resolve(canvas.toDataURL("image/png"))
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}

export default function BarcodeGenerator() {
  const [value, setValue] = useState("")
  const [format, setFormat] = useState<BarcodeFormat>("CODE128")
  const currentFormat = FORMATS.find((f) => f.value === format)!
  const isValid = isValidForFormat(value, format)

  const handleDownload = async () => {
    const svgEl = document.querySelector<SVGSVGElement>("#barcode-svg svg")
    if (!svgEl) return
    const png = await svgToPng(svgEl)
    const a = document.createElement("a")
    a.href = png
    a.download = "barcode.png"
    a.click()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                  <BarcodeIcon className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-none">
                    Barcode Generator
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    Linear Barcode
                  </CardDescription>
                </div>
              </div>
              <CardDescription className="mt-1">
                Enter your data and choose a barcode format to generate
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Format selector */}
              <div className="space-y-1.5">
                <Label>Format</Label>
                <div className="grid grid-cols-5 rounded-lg bg-muted p-1 gap-1">
                  {FORMATS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => {
                        setFormat(f.value)
                        setValue("")
                      }}
                      className={`py-1.5 text-[11px] font-medium rounded-md transition-all ${
                        format === f.value
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentFormat.hint}
                </p>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <Label>Value</Label>
                <Input
                  type="text"
                  placeholder={currentFormat.hint}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-10"
                />
                {value && !isValid && (
                  <p className="text-xs text-destructive">
                    Invalid input for {currentFormat.label}. {currentFormat.hint}.
                  </p>
                )}
              </div>

              {/* Barcode preview */}
              <div
                id="barcode-svg"
                className="flex flex-col items-center justify-center rounded-xl border border-border bg-white px-4 py-6 min-h-[140px] overflow-hidden"
              >
                {isValid ? (
                  <Barcode
                    value={value}
                    format={format}
                    background="#ffffff"
                    lineColor="#000000"
                    width={1.8}
                    height={80}
                    fontSize={13}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <BarcodeIcon className="w-12 h-12 opacity-20" />
                    <p className="text-xs">Your barcode will appear here</p>
                  </div>
                )}
              </div>

              {/* Download */}
              <Button
                onClick={handleDownload}
                disabled={!isValid}
                className="w-full h-10 gap-2"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </Button>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Tip: </span>
                CODE128 is the most versatile format and works with any text.
                Use EAN or UPC formats for retail product barcodes.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
