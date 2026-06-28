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
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo.svg" alt="ToolKit By BEE" width={30} height={30} className="shrink-0 dark:invert group-hover:scale-105 transition-transform" />
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
    </header>
  )
}


