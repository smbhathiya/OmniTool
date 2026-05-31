"use client"

import { useState } from "react"
import { Fingerprint, Copy, Check, RefreshCw, ClipboardList } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const COUNTS = [1, 5, 10, 20]

function newUUID() {
  return crypto.randomUUID()
}

export default function GUIDGenerator() {
  const [guids, setGuids] = useState<string[]>([newUUID()])
  const [count, setCount] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)

  const generate = () => setGuids(Array.from({ length: count }, newUUID))

  const copyOne = async (id: string) => {
    await navigator.clipboard.writeText(id)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(guids.join("\n"))
    setCopied("all")
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-none">GUID Generator</CardTitle>
                  <CardDescription className="mt-0.5">Globally Unique Identifier</CardDescription>
                </div>
              </div>
              <CardDescription className="mt-1">
                Generate cryptographically random UUIDs (version 4)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Count selector */}
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-foreground">How many?</p>
                <div className="flex rounded-lg bg-muted p-1 gap-1">
                  {COUNTS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                        count === n
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={generate} className="flex-1 h-10 gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Generate
                </Button>
                <Button variant="outline" onClick={copyAll} className="h-10 gap-2">
                  {copied === "all" ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <ClipboardList className="w-4 h-4" />
                  )}
                  {copied === "all" ? "Copied" : "Copy All"}
                </Button>
              </div>

              {/* GUID list */}
              <div className="space-y-2">
                {guids.map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5"
                  >
                    <span className="font-mono text-xs text-foreground break-all">{id}</span>
                    <button
                      onClick={() => copyOne(id)}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied === id ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Note: </span>
                GUIDs are generated using the browser&apos;s built-in{" "}
                <span className="font-mono">crypto.randomUUID()</span> - no data
                is sent to any server.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
