"use client"

import { useState } from "react"
import { QrCode, Download, Copy, Check } from "lucide-react"
import QRCode from "react-qr-code"
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

const QR_DISPLAY_SIZE = 240
const QR_EXPORT_SIZE = 1024

function svgToPng(svgEl: SVGSVGElement, size: number): Promise<string> {
  return new Promise((resolve) => {
    const svgData = new XMLSerializer().serializeToString(svgEl)
    const blob = new Blob([svgData], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const padding = 80
      const canvas = document.createElement("canvas")
      canvas.width = size + padding * 2
      canvas.height = size + padding * 2
      const ctx = canvas.getContext("2d")!
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, padding, padding, size, size)
      resolve(canvas.toDataURL("image/png"))
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}

export default function QRGenerator() {
  const [value, setValue] = useState("")
  const [copied, setCopied] = useState(false)

  const hasValue = value.trim().length > 0

  const handleDownload = async () => {
    const svgEl = document.querySelector<SVGSVGElement>("#qr-preview svg")
    if (!svgEl) return
    const png = await svgToPng(svgEl, QR_EXPORT_SIZE)
    const a = document.createElement("a")
    a.href = png
    a.download = "qrcode.png"
    a.click()
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                  <QrCode className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-none">
                    QR Generator
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    Quick Response Code
                  </CardDescription>
                </div>
              </div>
              <CardDescription className="mt-1">
                Enter any text or URL to generate a QR code instantly
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Input */}
              <div className="space-y-1.5">
                <Label>Text or URL</Label>
                <Input
                  type="text"
                  placeholder="e.g. https://bhathiya.dev"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-10"
                />
              </div>

              {/* QR Code preview */}
              <div id="qr-preview" className="flex flex-col items-center justify-center rounded-xl border border-border bg-white p-6 min-h-[200px]">
                {hasValue ? (
                  <QRCode
                    value={value}
                    size={QR_DISPLAY_SIZE}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <QrCode className="w-12 h-12 opacity-20" />
                    <p className="text-xs">Your QR code will appear here</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  disabled={!hasValue}
                  className="flex-1 h-10 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!hasValue}
                  className="h-10 gap-2"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Tip: </span>
                QR codes work best with shorter text. For URLs, make sure to
                include <span className="font-mono">https://</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
