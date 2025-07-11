"use client"

import { ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Bar, ComposedChart, Scatter, ScatterChart, Cell, ZAxis, Legend, Tooltip, LabelList} from "recharts"

const costPerUnitData = [
  { category: "Electronics", cost: 2.5, totalCost: 15000, volume: 6000, turnoverRate: 68 },
  { category: "Apparel", cost: 1.2, totalCost: 8000, volume: 6667, turnoverRate: 84 },
  { category: "Food", cost: 0.8, totalCost: 12000, volume: 15000, turnoverRate: 92 },
  { category: "Books", cost: 0.6, totalCost: 3000, volume: 5000, turnoverRate: 43 },
  { category: "Home & Garden", cost: 1.8, totalCost: 9000, volume: 5000, turnoverRate: 57 },
  { category: "Sports", cost: 1.5, totalCost: 6000, volume: 4000, turnoverRate: 75 },
  { category: "Pharmaceuticals", cost: 3.1, totalCost: 20000, volume: 6000, turnoverRate: 95 },
  { category: "Toys", cost: 1.1, totalCost: 5500, volume: 5000, turnoverRate: 64 },
  { category: "Automotive", cost: 2.0, totalCost: 10000, volume: 5000, turnoverRate: 50 },
  { category: "Pet Supplies", cost: 1.0, totalCost: 4000, volume: 4000, turnoverRate: 78 },
  { category: "Office Supplies", cost: 0.9, totalCost: 4500, volume: 5000, turnoverRate: 66 },
  { category: "Health & Beauty", cost: 1.6, totalCost: 9600, volume: 6000, turnoverRate: 88 },
  { category: "Footwear", cost: 1.3, totalCost: 7800, volume: 6000, turnoverRate: 60 },
  { category: "Furniture", cost: 2.8, totalCost: 25200, volume: 4000, turnoverRate: 35 },
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
  { month: "Dec", cost: 61.2, annotation: "Xmas Rush" },
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

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "#4F46E5",        // Indigo
  Apparel: "#10B981",           // Emerald
  Food: "#F59E0B",              // Amber
  Books: "#6366F1",             // Blue-violet
  "Home & Garden": "#84CC16",   // Lime
  Sports: "#EC4899",            // Pink
  Automotive: "#F43F5E",        // Rose
  "Health & Beauty": "#06B6D4", // Cyan
  "Toys & Games": "#A855F7",    // Purple
  "Office Supplies": "#3B82F6", // Blue
}

const costsOnly = laborCostData.map(d => d.cost)

const maxCost = Math.max(...costsOnly)
const minCost = Math.min(...costsOnly)
const maxMonth = laborCostData.find(d => d.cost === maxCost)?.month
const minMonth = laborCostData.find(d => d.cost === minCost)?.month

const sep = laborCostData.find(d => d.month === "Sep")?.cost ?? 0
const dec = laborCostData.find(d => d.month === "Dec")?.cost ?? 0
const spikePercent = sep !== 0 ? (((dec - sep) / sep) * 100).toFixed(1) : "0"

const maxEnergyCost = Math.max(...energyCostData.map(d => d.energyCost));
const minUtilization = Math.min(...energyCostData.map(d => d.utilization));

// Find the worst efficiency month = lowest utilization per $ energy
const worst = energyCostData.reduce(
  (acc, d) => {
    const efficiency = d.utilization / d.energyCost;
    return efficiency < acc.ratio ? { month: d.month, ratio: efficiency } : acc;
  },
  { month: "", ratio: Infinity }
);
const worstEfficiencyMonth = `${worst.month} (${worst.ratio.toFixed(1)}%/$/sqm)`;


export function FinancialMetricsTab() {
  return (
    <div className="space-y-6">
      {/* Cost per Stored Unit by Product Category */}
      <Card>
        <CardHeader>
          <CardTitle>Cost per Stored Unit by Product Category</CardTitle>
          <CardDescription>Bubble size = Total Cost | Y-axis = Cost/unit</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              cost: {
                label: "Cost per Unit ($)",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ScatterChart width={600} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={80}
              />
              <YAxis
                type="number"
                dataKey="cost"
                label={{ value: "Cost per Unit ($)", angle: -90, position: "insideLeft" }}
              />
              <ZAxis
                type="number"
                dataKey="totalCost"
                range={[60, 3000]}
                name="Total Cost  "
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">{data.category}</p>
                        <p>Cost per Unit: ${data.cost}</p>
                        <p>Total Cost: ${data.totalCost.toLocaleString()}</p>
                        <p>Volume: {data.volume.toLocaleString()} units</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Scatter name="Categories" data={costPerUnitData} dataKey="cost">
                {costPerUnitData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.category] || "#9CA3AF"}
                  />
                ))}
              </Scatter>
            </ScatterChart> 
          </ChartContainer>
          <div className="border-t">
            <div className="grid grid-cols-4 gap-4 py-4">

              {/* Total Categories */}
              <div className="text-center bg-gray-100 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{costPerUnitData.length}</div>
                <div className="text-xs text-gray-600 mt-1">Product Categories</div>
              </div>

              {/* Average Turnover Rate */}
              <div className="text-center bg-yellow-50 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-yellow-600">
                  {(
                    costPerUnitData.reduce((sum, item) => sum + item.turnoverRate, 0) /
                    costPerUnitData.length
                  ).toFixed(1)}x/mo
                </div>
                <div className="text-xs text-gray-600 mt-1">Avg Turnover Rate</div>
              </div>

              {/* Total Storage Cost */}
              <div className="text-center bg-red-50 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-red-600">
                  ${costPerUnitData.reduce((sum, item) => sum + item.totalCost, 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mt-1">Total Storage Cost</div>
              </div>

              {/* Average Cost per Unit */}
              <div className="text-center bg-green-50 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-green-600">
                  ${(
                    costPerUnitData.reduce((sum, item) => sum + item.cost, 0) / costPerUnitData.length
                  ).toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 mt-1">Avg Cost per Unit</div>
              </div>
            </div>
          </div>
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
            >
              <LineChart data={laborCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="var(--color-cost)"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload, key } = props;
                    const hasAnnotation = payload.annotation !== "";
                    return (
                      <g key={key}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={hasAnnotation ? 6 : 4}
                          fill={hasAnnotation ? "hsl(var(--destructive))" : "var(--color-cost)"}
                        />
                        {hasAnnotation && (
                          <text
                            x={cx}
                            y={cy - 10}
                            textAnchor="middle"
                            fontSize={10}
                            fill="hsl(var(--destructive))"
                          >
                            {payload.annotation}
                          </text>
                        )}
                      </g>
                    );
                  }}
                />
              </LineChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {laborCostData
                .filter((d) => d.annotation)
                .map((d) => (
                  <Badge variant="destructive" key={d.month}>
                    {d.month}: {d.annotation}
                  </Badge>
                ))}
            </div>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>🟥 Oct:</strong> Labor costs rose due to <strong>Holiday Peak</strong> prep — seasonal staff likely added.
              </p>
              <p>
                <strong>🟥 Nov:</strong> Spike continues with <strong>Black Friday</strong> demand, indicating higher order volume or overtime.
              </p>
              <p>
                <strong>🟥 Dec:</strong> Highest labor cost during <strong>Christmas Rush</strong>, possibly due to both volume and temporary hires.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm text-center">
              <div className="bg-yellow-50 dark:bg-zinc-800 p-3 rounded-lg">
                <div className="text-lg font-semibold text-yellow-600">${maxCost}</div>
                <div className="text-gray-600 dark:text-gray-400">Highest in {maxMonth}</div>
              </div>
              <div className="bg-green-50 dark:bg-zinc-800 p-3 rounded-lg">
                <div className="text-lg font-semibold text-green-600">${minCost}</div>
                <div className="text-gray-600 dark:text-gray-400">Lowest in {minMonth}</div>
              </div>
              <div className="bg-blue-50 dark:bg-zinc-800 p-3 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">+{spikePercent}%</div>
                <div className="text-gray-600 dark:text-gray-400">Spike from Sep to Dec</div>
              </div>
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
            >
              <ComposedChart data={energyCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  yAxisId="left"
                  label={{ value: "Energy Cost ($/sqm)", angle: -90, position: "insideLeft" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: "Utilization (%)", angle: 90, position: "insideRight" }}
                />
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
            <div className="mt-4 space-y-2 py-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>High energy cost + low utilization → consolidate zones</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>High utilization = higher profitability potential</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-center">
              <div className="bg-red-50 dark:bg-zinc-800 p-3 rounded-lg">
                <div className="text-lg font-semibold text-red-600">
                  ${maxEnergyCost}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Highest Energy Cost (per sqm)
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-zinc-800 p-3 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">
                  {minUtilization}%
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Lowest Space Utilization
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-zinc-800 p-3 rounded-lg">
                <div className="text-lg font-semibold text-yellow-600">
                  {worstEfficiencyMonth}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Poor Efficiency Month
                </div>
              </div>
            </div>
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
