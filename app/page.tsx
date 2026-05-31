"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Scale, QrCode, Barcode, Wrench } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Tool {
  id: string
  name: string
  description: string
  icon: LucideIcon
  href: string
  iconClass: string
  iconWrapperClass: string
}

const tools: Tool[] = [
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description:
      "Calculate your Body Mass Index and check your health category.",
    icon: Scale,
    href: "/bmi-calculator",
    iconClass: "text-blue-600 dark:text-blue-400",
    iconWrapperClass: "bg-blue-100 dark:bg-blue-900/40",
  },
  {
    id: "qr-generator",
    name: "QR Generator",
    description: "Generate QR codes for URLs, text, contacts, and more.",
    icon: QrCode,
    href: "/qr-generator",
    iconClass: "text-purple-600 dark:text-purple-400",
    iconWrapperClass: "bg-purple-100 dark:bg-purple-900/40",
  },
  {
    id: "barcode-generator",
    name: "Barcode Generator",
    description: "Create barcodes in multiple standard formats instantly.",
    icon: Barcode,
    href: "/barcode-generator",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    iconWrapperClass: "bg-emerald-100 dark:bg-emerald-900/40",
  },
]

export default function Home() {
  const [query, setQuery] = useState("")

  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Wrench className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Toolkit</span>
          </Link>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Your everyday toolkit
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
            Simple, fast, and free tools right in your browser.
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.id} href={tool.href} className="group">
                  <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="flex flex-col gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.iconWrapperClass}`}
                      >
                        <Icon className={`w-5 h-5 ${tool.iconClass}`} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {tool.name}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">
              No tools match &ldquo;{query}&rdquo;
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Toolkit. All rights reserved.</span>
          <span>Built with Next.js & Tailwind CSS</span>
        </div>
      </footer>
    </div>
  )
}
