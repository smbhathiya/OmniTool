"use client"

import { useState } from "react"
import { Scale } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

type HeightUnit = "cm" | "ft"
type WeightUnit = "kg" | "lbs"

interface BMIResult {
  bmi: number
  category: string
  badgeClass: string
  description: string
  position: number
  healthyWeightMin: number
  healthyWeightMax: number
  weightDifference: number | null
  weightAction: "gain" | "lose" | "maintain"
  unit: WeightUnit
}

function getCategory(bmi: number): Omit<BMIResult, "bmi" | "position" | "healthyWeightMin" | "healthyWeightMax" | "weightDifference" | "weightAction" | "unit"> {
  if (bmi < 18.5)
    return {
      category: "Underweight",
      badgeClass:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
      description:
        "You may need to gain some weight to reach a healthy range. Consider consulting a nutritionist.",
    }
  if (bmi < 25)
    return {
      category: "Normal weight",
      badgeClass:
        "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
      description: "You have a healthy body weight! Maintain your current balanced lifestyle.",
    }
  if (bmi < 30)
    return {
      category: "Overweight",
      badgeClass:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
      description:
        "You may benefit from shedding a few pounds through a healthy diet and regular exercise.",
    }
  return {
    category: "Obese",
    badgeClass:
      "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
    description: "It is recommended to consult a healthcare professional for personalized guidance.",
  }
}

function calcBMI(
  heightUnit: HeightUnit,
  weightUnit: WeightUnit,
  heightCm: string,
  heightFt: string,
  heightIn: string,
  weight: string
): BMIResult | null {
  const heightM =
    heightUnit === "cm"
      ? parseFloat(heightCm) / 100
      : (parseFloat(heightFt || "0") * 12 + parseFloat(heightIn || "0")) *
        0.0254

  const weightKg =
    weightUnit === "kg"
      ? parseFloat(weight)
      : parseFloat(weight) * 0.453592

  if (!heightM || !weightKg || heightM <= 0 || weightKg <= 0) return null

  const bmi = weightKg / (heightM * heightM)
  const position = Math.min(Math.max(((bmi - 15) / 25) * 100, 2), 98)

  // Calculate healthy weight bounds (BMI 18.5 - 24.9) in kg
  const minKg = 18.5 * heightM * heightM
  const maxKg = 24.9 * heightM * heightM

  let healthyWeightMin = minKg
  let healthyWeightMax = maxKg
  let currentWeightInUnit = weightKg

  if (weightUnit === "lbs") {
    healthyWeightMin = minKg / 0.453592
    healthyWeightMax = maxKg / 0.453592
    currentWeightInUnit = parseFloat(weight)
  }

  let weightAction: "gain" | "lose" | "maintain" = "maintain"
  let weightDifference: number | null = null

  if (bmi < 18.5) {
    weightAction = "gain"
    weightDifference = healthyWeightMin - currentWeightInUnit
  } else if (bmi >= 25) {
    weightAction = "lose"
    weightDifference = currentWeightInUnit - healthyWeightMax
  }

  return {
    bmi,
    position,
    healthyWeightMin,
    healthyWeightMax,
    weightDifference,
    weightAction,
    unit: weightUnit,
    ...getCategory(bmi),
  }
}

function UnitToggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { label: string; value: T }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex rounded-md bg-muted p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-0.5 text-xs font-medium rounded transition-all ${
            value === opt.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function BMICalculator() {
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm")
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg")
  const [heightCm, setHeightCm] = useState("")
  const [heightFt, setHeightFt] = useState("")
  const [heightIn, setHeightIn] = useState("")
  const [weight, setWeight] = useState("")
  const [result, setResult] = useState<BMIResult | null>(null)

  const handleCalculate = () => {
    setResult(
      calcBMI(heightUnit, weightUnit, heightCm, heightFt, heightIn, weight)
    )
  }

  const handleReset = () => {
    setHeightCm("")
    setHeightFt("")
    setHeightIn("")
    setWeight("")
    setResult(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-start justify-center px-4 pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="w-full max-w-md space-y-4">
          {/* Calculator card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                  <Scale className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg leading-none">
                    BMI Calculator
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    Body Mass Index
                  </CardDescription>
                </div>
              </div>
              <CardDescription className="mt-1">
                Choose your preferred units for height and weight independently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Height */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Height</Label>
                  <UnitToggle
                    value={heightUnit}
                    options={[
                      { label: "cm", value: "cm" },
                      { label: "ft & in", value: "ft" },
                    ]}
                    onChange={(v) => {
                      setHeightUnit(v)
                      setResult(null)
                    }}
                  />
                </div>
                {heightUnit === "cm" ? (
                  <Input
                    type="number"
                    placeholder="e.g. 175"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="h-10"
                    min="1"
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
                        min="1"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                        ft
                      </span>
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
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                        in
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Weight</Label>
                  <UnitToggle
                    value={weightUnit}
                    options={[
                      { label: "kg", value: "kg" },
                      { label: "lbs", value: "lbs" },
                    ]}
                    onChange={(v) => {
                      setWeightUnit(v)
                      setResult(null)
                    }}
                  />
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={weightUnit === "kg" ? "e.g. 70" : "e.g. 154"}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-10 pr-10"
                    min="1"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    {weightUnit}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button onClick={handleCalculate} className="flex-1 h-10">
                  Calculate BMI
                </Button>
                <Button variant="outline" onClick={handleReset} className="h-10">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result card */}
          {result && (
            <Card>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Your BMI
                    </p>
                    <p className="text-4xl font-bold text-foreground">
                      {result.bmi.toFixed(1)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`mt-1 border-transparent px-3 py-1 text-xs font-medium ${result.badgeClass}`}
                  >
                    {result.category}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {result.description}
                </p>

                {/* Weight Gain/Loss & Healthy Range Details */}
                <div className="p-3.5 rounded-xl border bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Healthy Weight Range:</span>
                    <span className="font-semibold text-foreground">
                      {result.healthyWeightMin.toFixed(1)} - {result.healthyWeightMax.toFixed(1)} {result.unit}
                    </span>
                  </div>
                  {result.weightAction === "maintain" ? (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ You are currently within your target healthy weight range!
                    </div>
                  ) : (
                    <div className="text-xs flex items-center justify-between pt-1 border-t border-border/60">
                      <span className="text-muted-foreground">Recommended Goal:</span>
                      <span className={`font-bold ${result.weightAction === "lose" ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`}>
                        {result.weightAction === "lose" ? "Lose" : "Gain"} ~{result.weightDifference?.toFixed(1)} {result.unit}
                      </span>
                    </div>
                  )}
                </div>

                {/* Scale bar */}
                <div>
                  <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400">
                    <div
                      className="absolute w-4 h-4 rounded-full bg-background border-2 border-foreground/70 shadow-sm transition-all duration-500"
                      style={{
                        left: `${result.position}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                    <span>15</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: "Underweight", color: "bg-blue-400" },
                    { label: "Normal", color: "bg-green-400" },
                    { label: "Overweight", color: "bg-yellow-400" },
                    { label: "Obese", color: "bg-red-400" },
                  ].map(({ label, color }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`h-1.5 w-full rounded-full ${color}`} />
                      <span className="text-[10px] text-muted-foreground text-center">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Card size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Note: </span>
                BMI is a screening tool, not a diagnostic measure. For
                personalized health advice, consult a healthcare professional.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
