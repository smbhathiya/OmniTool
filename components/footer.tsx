import Link from "next/link"
import { Wrench } from "lucide-react"


export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          {/* Brand */}
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
                <Wrench className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm leading-none font-bold text-foreground">
                ToolKit{" "}
                <span className="font-normal text-muted-foreground">By </span>
                <span className="font-bold text-foreground">Bee</span>
              </span>
            </Link>
            <p className="max-w-[220px] text-xs leading-relaxed text-muted-foreground">
              Simple, fast, and free tools for your everyday tasks right in your
              browser.
            </p>
          </div>

          {/* Developer credit */}
          <div className="flex flex-col items-start gap-1 sm:items-end"></div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row">
          <span>
            &copy; {new Date().getFullYear()} ToolKit By BEE. All rights
            reserved.
          </span>
          <span>
            Developed By{" "}
            <a
              href="https://bhathiya.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground font-bold"
            >
              bhathiya.dev
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
