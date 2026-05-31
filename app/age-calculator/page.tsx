"use client"

import { useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
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
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  dayOfWeek: string
  nextBirthdayDays: number
  nextBirthdayDate: string
}

const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

function calcAge(dob: Date): AgeResult {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  let years = now.getFullYear() - dob.getFullYear()
  let months = now.getMonth() - dob.getMonth()
  let days = now.getDate() - dob.getDate()

  if (days < 0) {
    months--
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }
  if (months < 0) { years--; months += 12 }

  const totalDays = Math.floor((now.getTime() - dob.getTime()) / 86400000)
  const dayOfWeek = WEEKDAYS[dob.getDay()]

  let next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate())
  if (next <= now) next = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate())
  const nextBirthdayDays = Math.ceil((next.getTime() - now.getTime()) / 86400000)
  const nextBirthdayDate = next.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  return { years, months, days, totalDays, dayOfWeek, nextBirthdayDays, nextBirthdayDate }
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs font-medium text-muted-foreground mt-0.5">{label}</p>
    </div>
  )
}

export default function AgeCalculator() {
  const [dob, setDob] = useState<Date | undefined>()
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<AgeResult | null>(null)
  const [calMonth, setCalMonth] = useState<Date>(new Date(2000, 0))

  const today = new Date()

  const handleCalc = () => {
    if (!dob) return
    setResult(calcAge(dob))
  }

  const handleReset = () => {
    setDob(undefined)
    setResult(null)
  }

  const handleSelect = (date: Date | undefined) => {
    setDob(date)
    setResult(null)
    if (date) setOpen(false)
  }

  const formattedDate = dob
    ? dob.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Pick your date of birth"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-4.5 h-4.5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-none">Age Calculator</CardTitle>
                  <CardDescription className="mt-0.5">Date of Birth</CardDescription>
                </div>
              </div>
              <CardDescription className="mt-1">
                Select your date of birth to calculate your exact age
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Calendar date picker */}
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-foreground">Date of Birth</p>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center gap-2 h-10 rounded-lg border border-input bg-transparent px-3 text-sm text-left transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className={dob ? "text-foreground" : "text-muted-foreground"}>
                        {formattedDate}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {/* Year / month quick nav */}
                    <div className="flex items-center justify-between border-b border-border px-3 py-2 gap-2">
                      <button
                        onClick={() => setCalMonth(new Date(calMonth.getFullYear() - 1, calMonth.getMonth()))}
                        className="p-1 rounded hover:bg-muted transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <select
                        value={calMonth.getFullYear()}
                        onChange={(e) => setCalMonth(new Date(Number(e.target.value), calMonth.getMonth()))}
                        className="text-sm font-medium bg-transparent focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: today.getFullYear() - 1900 + 1 }, (_, i) => today.getFullYear() - i).map((y) => (
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
                        onClick={() => setCalMonth(new Date(calMonth.getFullYear() + 1, calMonth.getMonth()))}
                        disabled={calMonth.getFullYear() >= today.getFullYear()}
                        className="p-1 rounded hover:bg-muted transition-colors disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={handleSelect}
                      month={calMonth}
                      onMonthChange={setCalMonth}
                      disabled={(date) => date > today}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCalc} disabled={!dob} className="flex-1 h-10">
                  Calculate Age
                </Button>
                <Button variant="outline" onClick={handleReset} className="h-10">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <StatBox label="Years" value={result.years} />
                  <StatBox label="Months" value={result.months} />
                  <StatBox label="Days" value={result.days} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StatBox label="Total Days Lived" value={result.totalDays.toLocaleString()} />
                  <StatBox label="Born On" value={result.dayOfWeek} />
                </div>

                <div className="rounded-xl border border-border bg-orange-50 dark:bg-orange-900/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Next Birthday</p>
                      <p className="font-semibold text-sm text-foreground mt-0.5">
                        {result.nextBirthdayDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {result.nextBirthdayDays}
                      </p>
                      <p className="text-xs text-muted-foreground">days away</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
