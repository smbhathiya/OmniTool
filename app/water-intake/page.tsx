"use client"

import { useState } from "react"
import { Droplets } from "lucide-react"
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

type WeightUnit = "kg" | "lbs"

const ACTIVITY_LEVELS = [
  { label: "Sedentary",    desc: "Little or no exercise",          factor: 1.0  },
  { label: "Light",        desc: "1–3 days / week",                factor: 1.12 },
  { label: "Moderate",     desc: "3–5 days / week",                factor: 1.25 },
  { label: "Active",       desc: "6–7 days / week",                factor: 1.4  },
  { label: "Very Active",  desc: "Intense daily training",         factor: 1.6  },
]

const CLIMATE_OPTIONS = [
  { label: "Temperate",   factor: 1.0  },
  { label: "Hot / Humid", factor: 1.15 },
]

function calcWater(weightKg: number, activityFactor: number, climateFactor: number) {
  const liters = weightKg * 0.033 * activityFactor * climateFactor
  return {
    liters: Math.round(liters * 10) / 10,
    glasses: Math.round(liters / 0.25),
    ml: Math.round(liters * 1000),
  }
}

export default function WaterIntake() {
  const [weight, setWeight] = useState("")
  const [unit, setUnit] = useState<WeightUnit>("kg")
  const [activityIdx, setActivityIdx] = useState(1)
  const [climateIdx, setClimateIdx] = useState(0)

  const weightKg = unit === "kg"
    ? parseFloat(weight)
    : parseFloat(weight) * 0.453592

  const valid = weightKg > 0 && !isNaN(weightKg)
  const result = valid
    ? calcWater(weightKg, ACTIVITY_LEVELS[activityIdx].factor, CLIMATE_OPTIONS[climateIdx].factor)
    : null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center shrink-0">
                  <Droplets className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-none">Water Intake</CardTitle>
                  <CardDescription className="mt-0.5">Daily Hydration Calculator</CardDescription>
                </div>
              </div>
              <CardDescription className="mt-1">
                Find your ideal daily water intake based on weight and lifestyle
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Weight */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Weight</Label>
                  <div className="flex rounded-md bg-muted p-0.5 gap-0.5">
                    {(["kg", "lbs"] as WeightUnit[]).map((u) => (
                      <button
                        key={u}
                        onClick={() => { setUnit(u); setWeight("") }}
                        className={`px-2.5 py-0.5 text-xs font-medium rounded transition-all ${
                          unit === u
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={unit === "kg" ? "e.g. 70" : "e.g. 154"}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-10 pr-10"
                    min="1"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Activity level */}
              <div className="space-y-1.5">
                <Label>Activity Level</Label>
                <div className="space-y-2">
                  {ACTIVITY_LEVELS.map((a, i) => (
                    <button
                      key={a.label}
                      onClick={() => setActivityIdx(i)}
                      className={`w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all ${
                        activityIdx === i
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/40"
                      }`}
                    >
                      <span className={`text-sm font-medium ${activityIdx === i ? "text-foreground" : "text-muted-foreground"}`}>
                        {a.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{a.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Climate */}
              <div className="space-y-1.5">
                <Label>Climate</Label>
                <div className="flex rounded-lg bg-muted p-1 gap-1">
                  {CLIMATE_OPTIONS.map((c, i) => (
                    <button
                      key={c.label}
                      onClick={() => setClimateIdx(i)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                        climateIdx === i
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          {result && (
            <Card>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground text-center">Your recommended daily water intake</p>

                {/* Primary stat */}
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl font-bold text-sky-600 dark:text-sky-400">
                    {result.liters}
                  </span>
                  <span className="text-xl font-medium text-muted-foreground mb-1">L</span>
                </div>

                {/* Secondary stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-muted/20 p-3 text-center">
                    <p className="text-xl font-bold text-foreground">{result.glasses}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Glasses (250 ml)</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/20 p-3 text-center">
                    <p className="text-xl font-bold text-foreground">{result.ml.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Millilitres</p>
                  </div>
                </div>

                {/* Progress bar showing glasses */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 glasses</span>
                    <span>{result.glasses} glasses / day</span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {Array.from({ length: Math.min(result.glasses, 20) }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 flex-1 min-w-[12px] rounded-full bg-sky-200 dark:bg-sky-800"
                      />
                    ))}
                    {result.glasses > 20 && (
                      <span className="text-xs text-muted-foreground self-center">+{result.glasses - 20} more</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Note: </span>
                This is a general estimate. Needs vary with individual health conditions,
                medications, and diet. Coffee, tea, and food also contribute to daily intake.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
