import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <div className="px-4 sm:px-6 pb-6">
      <footer className="max-w-5xl mx-auto rounded-2xl border border-border bg-card  px-6 py-8">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
          {/* Left — brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo.svg" alt="ToolKit By BEE" width={28} height={28} className="shrink-0" />
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
        <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground text-center sm:text-left">
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
      </footer>
    </div>
  )
}
