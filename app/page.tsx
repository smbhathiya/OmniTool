"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Scale,
  QrCode,
  Barcode,
  Fingerprint,
  ArrowLeftRight,
  ShieldCheck,
  CalendarDays,
  Droplets,
  Ruler,
  Baby,
  FileStack,
  Scissors,
  Stamp,
  Minimize2,
} from "lucide-react"
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

interface Category {
  id: string
  label: string
  tools: Tool[]
}

const categories: Category[] = [
  {
    id: "health",
    label: "Health & Fitness",
    tools: [
      {
        id: "bmi-calculator",
        name: "BMI Calculator",
        description: "Calculate your Body Mass Index and check your health category.",
        icon: Scale,
        href: "/bmi-calculator",
        iconClass: "text-blue-600 dark:text-blue-400",
        iconWrapperClass: "bg-blue-100 dark:bg-blue-900/40",
      },
      {
        id: "age-calculator",
        name: "Age Calculator",
        description: "Find your exact age in years, months, and days from your date of birth.",
        icon: CalendarDays,
        href: "/age-calculator",
        iconClass: "text-orange-600 dark:text-orange-400",
        iconWrapperClass: "bg-orange-100 dark:bg-orange-900/40",
      },
      {
        id: "water-intake",
        name: "Water Intake",
        description: "Calculate your ideal daily water intake based on weight and activity level.",
        icon: Droplets,
        href: "/water-intake",
        iconClass: "text-sky-600 dark:text-sky-400",
        iconWrapperClass: "bg-sky-100 dark:bg-sky-900/40",
      },
      {
        id: "ideal-weight",
        name: "Ideal Weight",
        description: "Find your healthy weight range using Devine, Robinson, and Miller formulas.",
        icon: Ruler,
        href: "/ideal-weight",
        iconClass: "text-teal-600 dark:text-teal-400",
        iconWrapperClass: "bg-teal-100 dark:bg-teal-900/40",
      },
      {
        id: "pregnancy-due-date",
        name: "Pregnancy Due Date",
        description: "Estimate your due date, current week, trimester, and key milestones.",
        icon: Baby,
        href: "/pregnancy-due-date",
        iconClass: "text-pink-600 dark:text-pink-400",
        iconWrapperClass: "bg-pink-100 dark:bg-pink-900/40",
      },
    ],
  },
  {
    id: "generators",
    label: "Generators",
    tools: [
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
      {
        id: "guid-generator",
        name: "GUID Generator",
        description: "Generate cryptographically random UUIDs (version 4) in bulk.",
        icon: Fingerprint,
        href: "/guid-generator",
        iconClass: "text-violet-600 dark:text-violet-400",
        iconWrapperClass: "bg-violet-100 dark:bg-violet-900/40",
      },
    ],
  },
  {
    id: "developer",
    label: "Developer Tools",
    tools: [
      {
        id: "base64-coder",
        name: "Base64 Coder",
        description: "Encode text to Base64 or decode Base64 strings back to plain text.",
        icon: ArrowLeftRight,
        href: "/base64-coder",
        iconClass: "text-cyan-600 dark:text-cyan-400",
        iconWrapperClass: "bg-cyan-100 dark:bg-cyan-900/40",
      },
      {
        id: "hash-generator",
        name: "Hash Generator",
        description: "Generate SHA-1, SHA-256, and SHA-512 hashes from any text.",
        icon: ShieldCheck,
        href: "/hash-generator",
        iconClass: "text-rose-600 dark:text-rose-400",
        iconWrapperClass: "bg-rose-100 dark:bg-rose-900/40",
      },
    ],
  },
  {
    id: "document",
    label: "Document Tools",
    tools: [
      {
        id: "pdf-merger",
        name: "PDF Merger",
        description: "Combine multiple PDF files into a single document seamlessly.",
        icon: FileStack,
        href: "/pdf-merger",
        iconClass: "text-red-600 dark:text-red-400",
        iconWrapperClass: "bg-red-100 dark:bg-red-900/40",
      },
      {
        id: "pdf-splitter",
        name: "PDF Splitter",
        description: "Separate pages from a PDF document or extract custom ranges.",
        icon: Scissors,
        href: "/pdf-splitter",
        iconClass: "text-amber-600 dark:text-amber-400",
        iconWrapperClass: "bg-amber-100 dark:bg-amber-900/40",
      },
      {
        id: "pdf-watermark",
        name: "PDF Watermark",
        description: "Add confidential text stamps or custom watermarks across PDF pages.",
        icon: Stamp,
        href: "/pdf-watermark",
        iconClass: "text-blue-600 dark:text-blue-400",
        iconWrapperClass: "bg-blue-100 dark:bg-blue-900/40",
      },
      {
        id: "pdf-compressor",
        name: "PDF Compressor",
        description: "Optimize object streams and structure to reduce PDF file size.",
        icon: Minimize2,
        href: "/pdf-compressor",
        iconClass: "text-teal-600 dark:text-teal-400",
        iconWrapperClass: "bg-teal-100 dark:bg-teal-900/40",
      },
    ],
  },
]

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon
  return (
    <Link href={tool.href} className="group">
      <Card className="h-full transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer">
        <CardContent className="flex flex-col gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tool.iconWrapperClass}`}>
            <Icon className={`w-5 h-5 ${tool.iconClass}`} />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
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
}

export default function Home() {
  const [query, setQuery] = useState("")

  const filtered = categories
    .map((cat) => ({
      ...cat,
      tools: cat.tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((cat) => cat.tools.length > 0)

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

        {/* Search */}
        <div className="relative mx-auto mb-10 max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 pl-9 text-sm"
          />
        </div>

        {/* Category sections */}
        {filtered.length > 0 ? (
          <div className="space-y-10">
            {filtered.map((cat) => (
              <section key={cat.id}>
                {/* Category heading */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {cat.label}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  {cat.tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            ))}
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
