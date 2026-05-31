"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Scale, QrCode, Barcode } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

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
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your Everyday Toolkit
          </h1>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground sm:text-base">
            Simple, fast, and free tools right in your browser.
          </p>
        </div>

        {/* Search — between subtitle and cards */}
        <div className="relative mx-auto mb-8 max-w-md sm:mb-10">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 pl-9 text-sm"
          />
        </div>

        {/* Tool grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {filtered.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.id} href={tool.href} className="group">
                  <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]">
                    <CardContent className="flex items-start gap-4 sm:flex-col sm:items-start sm:gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${tool.iconWrapperClass}`}
                      >
                        <Icon className={`h-5 w-5 ${tool.iconClass}`} />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                          {tool.name}
                        </p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
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
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">
              No tools match &ldquo;{query}&rdquo;
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
