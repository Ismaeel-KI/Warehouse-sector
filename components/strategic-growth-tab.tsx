"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Bar, BarChart, Area, AreaChart } from "recharts"

const clientTurnoverData = [
  { duration: "0-3 months", shortTerm: 45, longTerm: 12, renewed: 15, churned: 42 },
  { duration: "3-6 months", shortTerm: 38, longTerm: 28, renewed: 35, churned: 31 },
  { duration: "6-12 months", shortTerm: 22, longTerm: 45, renewed: 52, churned: 15 },
  { duration: "12+ months", shortTerm: 8, longTerm: 78, renewed: 74, churned: 12 },
]

const demandForecastData = [
  { month: "Jan", pastDemand: 1200, predictedDemand: 1250, season: "Winter" },
  { month: "Feb", pastDemand: 1100, predictedDemand: 1180, season: "Winter" },
  { month: "Mar", pastDemand: 1350, predictedDemand: 1420, season: "Spring" },
  { month: "Apr", pastDemand: 1450, predictedDemand: 1520, season: "Spring" },
  { month: "May", pastDemand: 1600, predictedDemand: 1680, season: "Spring" },
  { month: "Jun", pastDemand: 1800, predictedDemand: 1850, season: "Summer" },
  { month: "Jul", pastDemand: 1950, predictedDemand: 2020, season: "Summer" },
  { month: "Aug", pastDemand: 1850, predictedDemand: 1920, season: "Summer" },
  { month: "Sep", pastDemand: 1650, predictedDemand: 1720, season: "Fall" },
  { month: "Oct", pastDemand: 1750, predictedDemand: 1820, season: "Fall" },
  { month: "Nov", pastDemand: 2200, predictedDemand: 2350, season: "Holidays" },
  { month: "Dec", pastDemand: 2500, predictedDemand: 2680, season: "Holidays" },
]

const capacityForecastData = [
  { month: "Jan", currentUsage: 65, forecastedNew: 15, totalCapacity: 100 },
  { month: "Feb", currentUsage: 68, forecastedNew: 18, totalCapacity: 100 },
  { month: "Mar", currentUsage: 72, forecastedNew: 22, totalCapacity: 100 },
  { month: "Apr", currentUsage: 75, forecastedNew: 25, totalCapacity: 100 },
  { month: "May", currentUsage: 78, forecastedNew: 28, totalCapacity: 100 },
  { month: "Jun", currentUsage: 82, forecastedNew: 32, totalCapacity: 100 },
  { month: "Jul", currentUsage: 85, forecastedNew: 35, totalCapacity: 100 },
  { month: "Aug", currentUsage: 83, forecastedNew: 38, totalCapacity: 100 },
  { month: "Sep", currentUsage: 80, forecastedNew: 35, totalCapacity: 100 },
  { month: "Oct", currentUsage: 88, forecastedNew: 42, totalCapacity: 100 },
  { month: "Nov", currentUsage: 92, forecastedNew: 45, totalCapacity: 100 },
  { month: "Dec", currentUsage: 95, forecastedNew: 48, totalCapacity: 100 },
]

export function StrategicGrowthTab() {
  return (
    <div className="space-y-6">
      {/* Client Turnover Rate by Storage Duration */}
      <Card>
        <CardHeader>
          <CardTitle>Client Turnover Rate by Storage Duration</CardTitle>
          <CardDescription>Client retention analysis by storage commitment length</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              renewed: {
                label: "Renewed",
                color: "hsl(var(--chart-1))",
              },
              churned: {
                label: "Churned",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <BarChart data={clientTurnoverData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="duration" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="renewed" fill="var(--color-renewed)" />
              <Bar dataKey="churned" fill="var(--color-churned)" />
            </BarChart>
          </ChartContainer>
          <div className="mt-4">
            <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950">
              💡 Insight: Short-term clients churn more – optimize service offerings
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Inventory Demand by Season */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Inventory Demand</CardTitle>
            <CardDescription>Historical vs predicted seasonal demand patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                pastDemand: {
                  label: "Past Demand",
                  color: "hsl(var(--chart-3))",
                },
                predictedDemand: {
                  label: "Predicted Demand",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[250px]"
            >
              <LineChart data={demandForecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = demandForecastData.find((d) => d.month === label)
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">
                            {label} ({data?.season})
                          </p>
                          <p>Past: {payload[0]?.value} units</p>
                          <p>Predicted: {payload[1]?.value} units</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pastDemand"
                  stroke="var(--color-pastDemand)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line type="monotone" dataKey="predictedDemand" stroke="var(--color-predictedDemand)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Summer Peak</Badge>
              <Badge variant="secondary">Holiday Rush</Badge>
              <Badge variant="secondary">Spring Growth</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Space Utilization Forecast vs Client Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Space Utilization Forecast</CardTitle>
            <CardDescription>Current usage vs forecasted client growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                currentUsage: {
                  label: "Current Usage",
                  color: "hsl(var(--chart-1))",
                },
                forecastedNew: {
                  label: "Forecasted New",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[250px]"
            >
              <AreaChart data={capacityForecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const total = (payload[0]?.value || 0) + (payload[1]?.value || 0)
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{label}</p>
                          <p>Current: {payload[0]?.value}%</p>
                          <p>New Clients: {payload[1]?.value}%</p>
                          <p>Total: {total}%</p>
                          <p className={total > 100 ? "text-red-500 font-semibold" : ""}>
                            {total > 100 ? "⚠️ Over Capacity!" : "✅ Within Capacity"}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="currentUsage"
                  stackId="1"
                  stroke="var(--color-currentUsage)"
                  fill="var(--color-currentUsage)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="forecastedNew"
                  stackId="1"
                  stroke="var(--color-forecastedNew)"
                  fill="var(--color-forecastedNew)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              <Badge variant="destructive">⚠️ Capacity Warning: Nov-Dec projected over 100%</Badge>
              <Badge variant="outline">📈 Growth Trend: +15% new client demand</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
