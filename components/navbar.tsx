"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Wrench } from "lucide-react"

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY

      // Only trigger if scroll delta is noticeable (prevents micro-jitter)
      if (Math.abs(delta) > 5) {
        if (currentScrollY < 20) {
          setIsVisible(true)
        } else if (delta > 0) {
          // Scrolling down (page moving up) -> hide navbar
          setIsVisible(false)
        } else {
          // Scrolling up (page moving down) -> show navbar
          setIsVisible(true)
        }
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-24"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border border-border bg-background/90 backdrop-blur-md px-4 sm:px-5 shadow-sm">
        <Link href="/" className="flex items-center gap-2 group">
          <Wrench className="w-6 h-6 text-primary shrink-0 group-hover:rotate-12 transition-transform" />
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


