"use client"

import Link from "next/link"
import { Wrench } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground leading-none">
            ToolKit{" "}
            <span className="font-normal text-muted-foreground">By </span>
            <span className="font-bold text-foreground">Bee</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
