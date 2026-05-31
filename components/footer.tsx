import Link from "next/link"
import { Wrench } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          {/* Left — brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
                <Wrench className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-foreground leading-none">
                ToolKit{" "}
                <span className="font-normal text-muted-foreground">By </span>
                <span className="font-bold text-foreground">BEE</span>
              </span>
            </Link>
          </div>

          {/* Right — tagline */}
          <p className="text-xs text-muted-foreground leading-relaxed sm:text-right max-w-[220px]">
            Simple, fast, and free tools for your everyday tasks right in your
            browser.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} ToolKit By BEE. All rights
            reserved.
          </span>
          <span>
            Developed by{" "}
            <a
              href="https://bhathiya.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:underline underline-offset-4 transition-colors"
            >
              bhathiya.dev
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
