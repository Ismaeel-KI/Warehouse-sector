"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Bar, ComposedChart, Scatter, ScatterChart, Cell } from "recharts"

const costPerUnitData = [
  { category: "Electronics", cost: 2.5, totalCost: 15000, volume: 6000 },
  { category: "Apparel", cost: 1.2, totalCost: 8000, volume: 6667 },
  { category: "Food", cost: 0.8, totalCost: 12000, volume: 15000 },
  { category: "Books", cost: 0.6, totalCost: 3000, volume: 5000 },
  { category: "Home & Garden", cost: 1.8, totalCost: 9000, volume: 5000 },
  { category: "Sports", cost: 1.5, totalCost: 6000, volume: 4000 },
]

const laborCostData = [
  { month: "Jan", cost: 45.2, annotation: "" },
  { month: "Feb", cost: 42.8, annotation: "" },
  { month: "Mar", cost: 44.1, annotation: "" },
  { month: "Apr", cost: 46.5, annotation: "" },
  { month: "May", cost: 43.9, annotation: "" },
  { month: "Jun", cost: 45.7, annotation: "" },
  { month: "Jul", cost: 47.2, annotation: "" },
  { month: "Aug", cost: 44.6, annotation: "" },
  { month: "Sep", cost: 46.8, annotation: "" },
  { month: "Oct", cost: 52.3, annotation: "Holiday Peak" },
  { month: "Nov", cost: 58.7, annotation: "Black Friday" },
  { month: "Dec", cost: 61.2, annotation: "Christmas Rush" },
]

const energyCostData = [
  { month: "Jan", energyCost: 3.2, utilization: 78 },
  { month: "Feb", energyCost: 3.4, utilization: 82 },
  { month: "Mar", energyCost: 3.1, utilization: 85 },
  { month: "Apr", energyCost: 2.9, utilization: 88 },
  { month: "May", energyCost: 3.3, utilization: 79 },
  { month: "Jun", energyCost: 3.6, utilization: 75 },
  { month: "Jul", energyCost: 3.8, utilization: 73 },
  { month: "Aug", energyCost: 3.5, utilization: 81 },
  { month: "Sep", energyCost: 3.2, utilization: 86 },
  { month: "Oct", energyCost: 3.0, utilization: 91 },
  { month: "Nov", energyCost: 2.8, utilization: 94 },
  { month: "Dec", energyCost: 2.9, utilization: 92 },
]

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"]

export function FinancialMetricsTab() {
  return (
    <div className="space-y-6">
      {/* Cost per Stored Unit by Product Category */}
      <Card>
        <CardHeader>
          <CardTitle>Cost per Stored Unit by Product Category</CardTitle>
          <CardDescription>Bubble size represents total storage cost</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              cost: {
                label: "Cost per Unit ($)",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ScatterChart data={costPerUnitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                type="number"
                dataKey="cost"
                label={{ value: "Cost per Unit ($)", angle: -90, position: "insideLeft" }}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">{data.category}</p>
                        <p>Cost per Unit: ${data.cost}</p>
                        <p>Total Cost: ${data.totalCost.toLocaleString()}</p>
                        <p>Volume: {data.volume.toLocaleString()} units</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter dataKey="cost">
                {costPerUnitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Labor Cost per 100 Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Labor Cost per 100 Orders</CardTitle>
            <CardDescription>Monthly labor efficiency tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cost: {
                  label: "Cost ($)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[250px]"
            >
              <LineChart data={laborCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="cost" stroke="var(--color-cost)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="destructive">Oct: Holiday Peak</Badge>
              <Badge variant="destructive">Nov: Black Friday</Badge>
              <Badge variant="destructive">Dec: Christmas Rush</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Energy Cost per Square Meter */}
        <Card>
          <CardHeader>
            <CardTitle>Energy Cost per Square Meter</CardTitle>
            <CardDescription>Energy efficiency vs utilization correlation</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                energyCost: {
                  label: "Energy Cost ($/sqm)",
                  color: "hsl(var(--chart-3))",
                },
                utilization: {
                  label: "Utilization (%)",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[250px]"
            >
              <ComposedChart data={energyCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{label}</p>
                          <p>Energy Cost: ${payload[0]?.value}/sqm</p>
                          <p>Utilization: {payload[1]?.value}%</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar yAxisId="left" dataKey="energyCost" fill="var(--color-energyCost)" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="utilization"
                  stroke="var(--color-utilization)"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ChartContainer>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>High energy cost + low utilization → consolidate zones</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>High utilization = higher profitability potential</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
