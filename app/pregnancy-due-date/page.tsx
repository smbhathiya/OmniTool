"use client"

import { useState } from "react"
import { Baby, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface PregnancyResult {
  edd: Date
  eddFormatted: string
  weeksPregnant: number
  daysPregnant: number
  daysRemaining: number
  trimester: 1 | 2 | 3
  progressPercent: number
  milestones: { week: number; label: string; passed: boolean }[]
}

const MILESTONES = [
  { week: 6,  label: "Heartbeat detectable" },
  { week: 10, label: "Nuchal translucency scan" },
  { week: 13, label: "End of first trimester" },
  { week: 18, label: "Anatomy scan" },
  { week: 24, label: "Viability milestone" },
  { week: 27, label: "End of second trimester" },
  { week: 36, label: "Baby is full-term soon" },
  { week: 40, label: "Due date" },
]

function calcPregnancy(lmp: Date): PregnancyResult {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lmpClean = new Date(lmp)
  lmpClean.setHours(0, 0, 0, 0)

  const edd = new Date(lmpClean)
  edd.setDate(edd.getDate() + 280)

  const daysPregnant = Math.floor((today.getTime() - lmpClean.getTime()) / 86400000)
  const weeksPregnant = Math.floor(daysPregnant / 7)
  const daysRemaining = Math.max(0, Math.ceil((edd.getTime() - today.getTime()) / 86400000))
  const progressPercent = Math.min(100, Math.round((daysPregnant / 280) * 100))

  const trimester: 1 | 2 | 3 =
    weeksPregnant <= 12 ? 1 : weeksPregnant <= 26 ? 2 : 3

  const milestones = MILESTONES.map((m) => ({
    ...m,
    passed: weeksPregnant >= m.week,
  }))

  return {
    edd,
    eddFormatted: edd.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    weeksPregnant,
    daysPregnant,
    daysRemaining,
    trimester,
    progressPercent,
    milestones,
  }
}

const TRIMESTER_COLORS = {
  1: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  2: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  3: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
}

export default function PregnancyDueDate() {
  const [lmp, setLmp] = useState<Date | undefined>()
  const [open, setOpen] = useState(false)
  const [calMonth, setCalMonth] = useState<Date>(new Date())

  const today = new Date()
  const maxLmp = new Date(today)
  maxLmp.setDate(today.getDate() - 1)

  const result = lmp && lmp < today ? calcPregnancy(lmp) : null

  const formattedLmp = lmp
    ? lmp.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Select last menstrual period date"

  const handleSelect = (date: Date | undefined) => {
    setLmp(date)
    if (date) setOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center shrink-0">
                  <Baby className="w-4.5 h-4.5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-none">Pregnancy Due Date</CardTitle>
                  <CardDescription className="mt-0.5">Estimated Delivery Date</CardDescription>
                </div>
              </div>
              <CardDescription className="mt-1">
                Enter your last menstrual period date to estimate your due date
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-foreground">Last Menstrual Period (LMP)</p>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center gap-2 h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-left transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className={lmp ? "text-foreground" : "text-muted-foreground"}>
                        {formattedLmp}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="flex items-center justify-between border-b border-border px-3 py-2 gap-2">
                      <button
                        onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1))}
                        className="p-1 rounded hover:bg-muted transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <select
                        value={calMonth.getFullYear()}
                        onChange={(e) => setCalMonth(new Date(Number(e.target.value), calMonth.getMonth()))}
                        className="text-sm font-medium bg-transparent focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: 3 }, (_, i) => today.getFullYear() - i).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <select
                        value={calMonth.getMonth()}
                        onChange={(e) => setCalMonth(new Date(calMonth.getFullYear(), Number(e.target.value)))}
                        className="text-sm font-medium bg-transparent focus:outline-none cursor-pointer"
                      >
                        {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                          <option key={m} value={i}>{m}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1))}
                        disabled={calMonth >= today}
                        className="p-1 rounded hover:bg-muted transition-colors disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={lmp}
                      onSelect={handleSelect}
                      month={calMonth}
                      onMonthChange={setCalMonth}
                      disabled={(date) => date >= today}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {lmp && !result && (
                <p className="text-xs text-destructive">Please select a date before today.</p>
              )}
            </CardContent>
          </Card>

          {result && (
            <>
              {/* Due date card */}
              <Card>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-muted-foreground">Estimated Due Date</p>
                    <p className="text-xl font-bold text-foreground">{result.eddFormatted}</p>
                    <Badge
                      variant="outline"
                      className={`border-transparent text-xs ${TRIMESTER_COLORS[result.trimester]}`}
                    >
                      {result.trimester === 1 ? "First" : result.trimester === 2 ? "Second" : "Third"} Trimester
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Week {result.weeksPregnant}</span>
                      <span>{result.progressPercent}% complete</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-pink-400 dark:bg-pink-500 transition-all duration-500"
                        style={{ width: `${result.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Week 1</span>
                      <span>Week 40</span>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Week", value: result.weeksPregnant },
                      { label: "Days", value: result.daysPregnant },
                      { label: "Days left", value: result.daysRemaining },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl border border-border bg-muted/20 p-3 text-center">
                        <p className="text-xl font-bold text-foreground">{value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Key Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.milestones.map((m) => (
                      <div
                        key={m.week}
                        className={`flex items-center justify-between rounded-lg px-3 py-2.5 border transition-colors ${
                          m.passed
                            ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                            : "border-border bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${m.passed ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                          <span className={`text-sm ${m.passed ? "text-foreground" : "text-muted-foreground"}`}>
                            {m.label}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">Week {m.week}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Card size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Note: </span>
                Based on Naegele&apos;s rule (LMP + 280 days). Actual delivery date may vary.
                Always follow your doctor&apos;s guidance for accurate prenatal care.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
