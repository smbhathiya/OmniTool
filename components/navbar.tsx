"use client"

import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border border-border bg-background/90 px-4 sm:px-5">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="ToolKit By BEE" width={32} height={32} className="shrink-0" />
          <span className="leading-none font-bold text-foreground">
            ToolKit{" "}
            <span className="font-normal text-muted-foreground">By </span>
            <span className="font-bold text-foreground">BEE</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </nav>
    </div>
  )
}

