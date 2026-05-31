"use client"

import { useState } from "react"
import { ArrowLeftRight, Copy, Check, X } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

type Mode = "encode" | "decode"

function encode(text: string): string {
  try {
    return btoa(
      encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    )
  } catch {
    return "Error: could not encode input."
  }
}

function decode(text: string): string {
  try {
    return decodeURIComponent(
      atob(text)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    )
  } catch {
    return "Error: invalid Base64 string."
  }
}

export default function Base64Coder() {
  const [mode, setMode] = useState<Mode>("encode")
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)

  const output = input ? (mode === "encode" ? encode(input) : decode(input)) : ""

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleSwap = () => {
    setInput(output)
    setMode((m) => (m === "encode" ? "decode" : "encode"))
  }

  const handleClear = () => setInput("")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-none">Base64 Coder</CardTitle>
                  <CardDescription className="mt-0.5">Encoder / Decoder</CardDescription>
                </div>
              </div>
              <CardDescription className="mt-1">
                Encode text to Base64 or decode Base64 back to text
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Mode toggle */}
              <div className="flex rounded-lg bg-muted p-1 gap-1">
                {(["encode", "decode"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setInput("") }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                      mode === m
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {mode === "encode" ? "Plain Text" : "Base64 String"}
                  </p>
                  {input && (
                    <button
                      onClick={handleClear}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
                <Textarea
                  placeholder={
                    mode === "encode"
                      ? "Enter text to encode…"
                      : "Paste Base64 string to decode…"
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={5}
                  className="font-mono text-sm resize-none"
                />
              </div>

              {/* Swap + Output */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {mode === "encode" ? "Base64 Output" : "Decoded Text"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSwap}
                      disabled={!output || output.startsWith("Error")}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors disabled:opacity-40"
                    >
                      <ArrowLeftRight className="w-3 h-3" /> Swap
                    </button>
                    <button
                      onClick={handleCopy}
                      disabled={!output || output.startsWith("Error")}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors disabled:opacity-40"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <Textarea
                  readOnly
                  value={output}
                  rows={5}
                  placeholder="Output will appear here…"
                  className={`font-mono text-sm resize-none bg-muted/30 ${
                    output.startsWith("Error") ? "text-destructive" : ""
                  }`}
                />
              </div>

              <Button
                onClick={handleCopy}
                disabled={!output || output.startsWith("Error")}
                className="w-full h-10 gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Output"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
