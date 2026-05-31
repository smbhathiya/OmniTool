"use client"

import { useState } from "react"
import { Ruler } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

type HeightUnit = "cm" | "ft"
type Gender = "male" | "female"

interface WeightResult {
  devine: number
  robinson: number
  miller: number
  bmiMin: number
  bmiMax: number
  average: number
}

function toInches(cm: number) {
  return cm / 2.54
}

function calcIdeal(heightCm: number, gender: Gender): WeightResult {
  const h = toInches(heightCm) - 60

  const devine   = gender === "male" ? 50   + 2.3   * h : 45.5 + 2.3   * h
  const robinson = gender === "male" ? 52   + 1.9   * h : 49   + 1.7   * h
  const miller   = gender === "male" ? 56.2 + 1.41  * h : 53.1 + 1.36  * h

  const hM = heightCm / 100
  const bmiMin = Math.round(18.5 * hM * hM * 10) / 10
  const bmiMax = Math.round(24.9 * hM * hM * 10) / 10

  const average = Math.round(((devine + robinson + miller) / 3) * 10) / 10

  return {
    devine:   Math.round(devine   * 10) / 10,
    robinson: Math.round(robinson * 10) / 10,
    miller:   Math.round(miller   * 10) / 10,
    bmiMin,
    bmiMax,
    average,
  }
}

const FORMULAS = [
  { key: "devine",   label: "Devine",   color: "text-blue-600 dark:text-blue-400"   },
  { key: "robinson", label: "Robinson", color: "text-purple-600 dark:text-purple-400" },
  { key: "miller",   label: "Miller",   color: "text-emerald-600 dark:text-emerald-400" },
] as const

export default function IdealWeight() {
  const [unit, setUnit] = useState<HeightUnit>("cm")
  const [heightCm, setHeightCm] = useState("")
  const [heightFt, setHeightFt] = useState("")
  const [heightIn, setHeightIn] = useState("")
  const [gender, setGender] = useState<Gender>("male")

  const resolvedCm =
    unit === "cm"
      ? parseFloat(heightCm)
      : parseFloat(heightFt || "0") * 30.48 + parseFloat(heightIn || "0") * 2.54

  const valid = resolvedCm >= 100 && resolvedCm <= 250
  const result = valid ? calcIdeal(resolvedCm, gender) : null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
                  <Ruler className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-none">Ideal Weight</CardTitle>
                  <CardDescription className="mt-0.5">Healthy Weight Calculator</CardDescription>
                </div>
              </div>
              <CardDescription className="mt-1">
                Calculate your ideal weight range using multiple medical formulas
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Gender */}
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <div className="flex rounded-lg bg-muted p-1 gap-1">
                  {(["male", "female"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                        gender === g
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Height</Label>
                  <div className="flex rounded-md bg-muted p-0.5 gap-0.5">
                    {(["cm", "ft"] as HeightUnit[]).map((u) => (
                      <button
                        key={u}
                        onClick={() => { setUnit(u); setHeightCm(""); setHeightFt(""); setHeightIn("") }}
                        className={`px-2.5 py-0.5 text-xs font-medium rounded transition-all ${
                          unit === u
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {u === "ft" ? "ft & in" : "cm"}
                      </button>
                    ))}
                  </div>
                </div>
                {unit === "cm" ? (
                  <Input
                    type="number"
                    placeholder="e.g. 175"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="h-10"
                    min="100"
                    max="250"
                  />
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        placeholder="5"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        className="h-10 pr-8"
                        min="3"
                        max="8"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">ft</span>
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        placeholder="9"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        className="h-10 pr-8"
                        min="0"
                        max="11"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">in</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          {result && (
            <Card>
              <CardContent className="space-y-4">
                {/* Average highlight */}
                <div className="rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Average ideal weight</p>
                  <p className="text-4xl font-bold text-teal-700 dark:text-teal-300">
                    {result.average} <span className="text-xl font-medium">kg</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ({Math.round(result.average * 2.20462)} lbs)
                  </p>
                </div>

                {/* Per-formula */}
                <div className="space-y-2">
                  {FORMULAS.map(({ key, label, color }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-foreground">{label} formula</span>
                      <span className={`text-sm font-bold ${color}`}>
                        {result[key]} kg
                        <span className="text-xs font-normal text-muted-foreground ml-1.5">
                          ({Math.round(result[key] * 2.20462)} lbs)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* BMI range */}
                <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Healthy BMI range</span>
                    <span className="text-sm font-bold text-foreground">
                      {result.bmiMin} – {result.bmiMax} kg
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Based on BMI 18.5 – 24.9</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Note: </span>
                Ideal weight formulas are estimates for average adults and do not account for
                muscle mass, bone density, or ethnicity. Consult a doctor for personal guidance.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
