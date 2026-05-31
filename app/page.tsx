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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Hero */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Your everyday toolkit
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto">
            Simple, fast, and free tools right in your browser.
          </p>
        </div>

        {/* Search — between subtitle and cards */}
        <div className="relative max-w-md mx-auto mb-8 sm:mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 text-sm"
          />
        </div>

        {/* Tool grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.id} href={tool.href} className="group">
                  <Card className="h-full transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer">
                    <CardContent className="flex items-start gap-4 sm:flex-col sm:items-start sm:gap-4">
                      <div
                        className={`w-11 h-11 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${tool.iconWrapperClass}`}
                      >
                        <Icon className={`w-5 h-5 ${tool.iconClass}`} />
                      </div>
                      <div className="space-y-0.5 min-w-0">
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

      <Footer />
    </div>
  )
}
