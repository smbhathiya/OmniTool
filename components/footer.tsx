import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="w-full border-t border-border/60 bg-background/50 backdrop-blur-sm px-4 sm:px-6 py-12 mt-auto">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <Image
                src="/logo.svg"
                alt="OmniTool By BEE"
                width={32}
                height={32}
                className="shrink-0 dark:invert group-hover:scale-105 transition-transform"
              />
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-foreground">
                  OmniTool
                </span>
                <span className="bg-foreground text-background text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  BEE
                </span>
              </div>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              A modern suite of fast, privacy-focused, and free browser tools. 
              Process PDFs, calculate health metrics, and generate code directly on your device.
            </p>
          </div>

          {/* Quick Links — PDF Tools */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[11px]">
              PDF Tools
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/pdf-organizer" className="hover:text-foreground transition-colors">
                  Split & Merge Studio
                </Link>
              </li>
              <li>
                <Link href="/pdf-merger" className="hover:text-foreground transition-colors">
                  PDF Merger
                </Link>
              </li>
              <li>
                <Link href="/pdf-splitter" className="hover:text-foreground transition-colors">
                  PDF Splitter
                </Link>
              </li>
              <li>
                <Link href="/pdf-compressor" className="hover:text-foreground transition-colors">
                  PDF Compressor
                </Link>
              </li>
              <li>
                <Link href="/pdf-link-editor" className="hover:text-foreground transition-colors">
                  PDF Link Editor
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links — Utilities */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[11px]">
              Generators & Tools
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/image-compressor" className="hover:text-foreground transition-colors">
                  Image Size Reducer
                </Link>
              </li>
              <li>
                <Link href="/image-converter" className="hover:text-foreground transition-colors">
                  Any Image Converter
                </Link>
              </li>
              <li>
                <Link href="/qr-generator" className="hover:text-foreground transition-colors">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/guid-generator" className="hover:text-foreground transition-colors">
                  GUID / UUID Generator
                </Link>
              </li>
              <li>
                <Link href="/hash-generator" className="hover:text-foreground transition-colors">
                  Hash Generator
                </Link>
              </li>
              <li>
                <Link href="/bmi-calculator" className="hover:text-foreground transition-colors">
                  BMI Calculator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} OmniTool By BEE. All rights reserved.
          </span>
          <span className="flex items-center gap-1">
            Developed with care by{" "}
            <a
              href="https://bhathiya.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground hover:underline underline-offset-4 transition-colors"
            >
              bhathiya.dev
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
