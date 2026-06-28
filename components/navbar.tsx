"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      if (Math.abs(delta) > 5) {
        if (currentScrollY < 20) {
          setIsVisible(true)
        } else if (delta > 0) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/logo.svg"
              alt="ToolKit By BEE"
              width={32}
              height={32}
              className="shrink-0 dark:invert group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-foreground">
              ToolKit
            </span>
            <span className="bg-foreground text-background text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              BEE
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ModeToggle />
        </div>
      </nav>
    </header>
  )
}
