"use client"

import Link from "next/link"
import { Wrench } from "lucide-react"

export function Navbar() {
  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6">
      <nav className="mx-auto flex h-14 max-w-5xl items-center rounded-2xl border border-border bg-background/90 px-4 sm:px-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Wrench className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="leading-none font-bold text-foreground">
            ToolKit{" "}
            <span className="font-normal text-muted-foreground">By </span>
            <span className="font-bold text-foreground">BEE</span>
          </span>
        </Link>
      </nav>
    </div>
  )
}
