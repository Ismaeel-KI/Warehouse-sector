"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Bar, BarChart, ComposedChart} from "recharts"
import { Fragment } from "react"
import { TrendingUp } from "lucide-react"
import React from "react";
import { Package } from "lucide-react"
import { isThisMonth, isThisWeek, isToday, parseISO } from "date-fns"
import { Scatter } from "recharts"

const pickingData = [
  { day: "Mon", avgTime: 12.5, outliers: [{ time: 25, orderId: "ORD-001" }] },
  { day: "Tue", avgTime: 11.8, outliers: [] },
  { day: "Wed", avgTime: 13.2, outliers: [{ time: 28, orderId: "ORD-045" }] },
  { day: "Thu", avgTime: 10.9, outliers: [] },
  { day: "Fri", avgTime: 14.1, outliers: [{ time: 31, orderId: "ORD-089" }] },
  { day: "Sat", avgTime: 15.3, outliers: [] },
  { day: "Sun", avgTime: 13.7, outliers: [] },
]

const accuracyData = [
  { shift: "Morning", teamA: 45, teamB: 38, teamC: 42, errors: 3 },
  { shift: "Afternoon", teamA: 52, teamB: 41, teamC: 39, errors: 5 },
  { shift: "Night", teamA: 29, teamB: 31, teamC: 28, errors: 4 },
]

const downtimeData = [
  { day: "Mon", downtime: 4.5, delayedOrders: 2, equipment: "Forklift" },
  { day: "Tue", downtime: 7.2, delayedOrders: 4, equipment: "Conveyor" },
  { day: "Wed", downtime: 6.8, delayedOrders: 5, equipment: "Forklift" },
  { day: "Thu", downtime: 5.5, delayedOrders: 1, equipment: "Scanner" },
  { day: "Fri", downtime: 6.2, delayedOrders: 6, equipment: "Conveyor" },
  { day: "Sat", downtime: 5.1, delayedOrders: 3.3, equipment: "Forklift" },
  { day: "Sun", downtime: 3.8, delayedOrders: 1 , equipment: "Scanner" },
]

const verticalAisles = [3, 6, 9, 12, 15, 18];      // Columns for vertical aisles
const horizontalAisles = [2];         // Rows for horizontal aisles

const warehouseLayout = [
  [85, 92, 78, 0, 88, 95, 0, 82, 77, 0, 69, 73, 76, 74, 71],
  [90, 87, 83, 0, 91, 89, 0, 85, 81, 0, 66, 68, 72, 70, 67],
  [88, 94, 86, 0, 84, 92, 0, 87, 75, 40, 65, 70, 73, 71, 69],
  [71, 73, 72, 0, 76, 74, 0, 78, 80, 0, 69, 60, 63, 61, 59],
  [62, 58, 66, 40, 64, 67, 0, 68, 70, 0, 72, 74, 75, 77, 78], // aisle after this
  [58, 64, 60, 0, 59, 63, 0, 62, 65, 0, 70, 68, 66, 67, 69], // aisle after this
  [72, 74, 70, 0, 75, 77, 0, 78, 76, 20, 69, 71, 73, 74, 72],
  [55, 52, 57, 0, 54, 59, 0, 56, 53, 0, 51, 49, 48, 47, 46],
  [44, 42, 41, 0, 45, 43, 0, 40, 39, 0, 38, 37, 36, 35, 3],
  [66, 64, 68, 20, 67, 69, 0, 65, 63, 0, 62, 60, 59, 61, 58],
  [48, 50, 46, 0, 52, 49, 0, 51, 47, 0, 53, 54, 55, 56, 57],
  [61, 59, 60, 0, 58, 62, 0, 63, 65, 40, 64, 66, 68, 67, 69],
  [75, 73, 74, 40, 76, 78, 0, 77, 79, 20, 80, 82, 83, 81, 84],
];

const rawOrderData = [
  // Today's data
  {
    id: 1,
    shift: "Morning",
    teamA: 15,
    teamB: 12,
    teamC: 18,
    teamAErrors: 2,
    teamBErrors: 1,
    teamCErrors: 3,
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    shift: "Afternoon",
    teamA: 22,
    teamB: 19,
    teamC: 16,
    teamAErrors: 3,
    teamBErrors: 2,
    teamCErrors: 2,
    timestamp: new Date().toISOString(),
  },
  {
    id: 3,
    shift: "Night",
    teamA: 18,
    teamB: 14,
    teamC: 21,
    teamAErrors: 4,
    teamBErrors: 2,
    teamCErrors: 5,
    timestamp: new Date().toISOString(),
  },

  // Yesterday's data
  {
    id: 4,
    shift: "Morning",
    teamA: 14,
    teamB: 11,
    teamC: 17,
    teamAErrors: 1,
    teamBErrors: 2,
    teamCErrors: 2,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    shift: "Afternoon",
    teamA: 20,
    teamB: 18,
    teamC: 15,
    teamAErrors: 2,
    teamBErrors: 3,
    teamCErrors: 1,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    shift: "Night",
    teamA: 16,
    teamB: 13,
    teamC: 19,
    teamAErrors: 3,
    teamBErrors: 1,
    teamCErrors: 4,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },

  // Last week's data
  {
    id: 7,
    shift: "Morning",
    teamA: 13,
    teamB: 10,
    teamC: 16,
    teamAErrors: 2,
    teamBErrors: 1,
    teamCErrors: 2,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    shift: "Afternoon",
    teamA: 19,
    teamB: 17,
    teamC: 14,
    teamAErrors: 1,
    teamBErrors: 2,
    teamCErrors: 1,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    shift: "Night",
    teamA: 15,
    teamB: 12,
    teamC: 18,
    teamAErrors: 2,
    teamBErrors: 1,
    teamCErrors: 3,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Last month's data
  {
    id: 10,
    shift: "Morning",
    teamA: 12,
    teamB: 9,
    teamC: 15,
    teamAErrors: 1,
    teamBErrors: 1,
    teamCErrors: 2,
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 11,
    shift: "Afternoon",
    teamA: 18,
    teamB: 16,
    teamC: 13,
    teamAErrors: 2,
    teamBErrors: 1,
    teamCErrors: 1,
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    shift: "Night",
    teamA: 14,
    teamB: 11,
    teamC: 17,
    teamAErrors: 1,
    teamBErrors: 2,
    teamCErrors: 2,
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const originalOutliers = [
  { id: "ORD-001", day: "Mon", time: 25 },
  { id: "ORD-045", day: "Wed", time: 28 },
  { id: "ORD-089", day: "Fri", time: 31 },
]

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const outliers = days.map((day) => {
  const match = originalOutliers.find((o) => o.day === day)
  return match ? match : { day, time: null, id: null }
})

const equipmentDowntime = [
  { type: "Forklifts", frequency: 15 },
  { type: "Conveyors", frequency: 8 },
  { type: "Scanners", frequency: 12 },
  { type: "Sorters", frequency: 6 },
]

function getUtilColor(util: number) {
  if (util === 0) return "bg-gray-300 dark:bg-gray-600";
  if (util > 80) return "bg-green-500"
  if (util > 60) return "bg-orange-400"
  if (util >= 40) return "bg-yellow-400"
  return "bg-red-500"
}

const equipmentTotals = downtimeData.reduce((acc, entry) => {
  if (!acc[entry.equipment]) {
    acc[entry.equipment] = { downtime: 0, delayedOrders: 0 };
  }
  acc[entry.equipment].downtime += entry.downtime;
  acc[entry.equipment].delayedOrders += entry.delayedOrders;
  return acc;
}, {} as Record<string, { downtime: number; delayedOrders: number }>);

// Calculate overall average downtime per delayed order
const totalDowntime = downtimeData.reduce((sum, entry) => sum + entry.downtime, 0);
const totalDelayedOrders = downtimeData.reduce((sum, entry) => sum + entry.delayedOrders, 0);
const avgDowntimePerOrder = totalDelayedOrders ? (totalDowntime / totalDelayedOrders).toFixed(2) : "0.00";

const allUtilValues = warehouseLayout.flat();
const totalSlotsAvailable = allUtilValues.length;
const activeSlots = allUtilValues.filter((util) => util > 0);
const totalSlots = activeSlots.length;
const highUtil = activeSlots.filter((util) => util > 80).length;
const lowUtil = activeSlots.filter((util) => util < 40).length;
const avgUtil = activeSlots.reduce((sum, util) => sum + util, 0) / totalSlots || 0;

const avgPickTime = pickingData.reduce((sum, d) => sum + d.avgTime, 0) / pickingData.length
const totalOutliers = pickingData.reduce((count, d) => count + d.outliers.length, 0)
const slowestDay = pickingData.reduce((max, d) => d.avgTime > max.avgTime ? d : max, pickingData[0])
const worstOutlier = pickingData.flatMap(d => d.outliers).reduce((max, o) => o.time > max.time ? o : max, { time: 0, orderId: "" })

type FilterPeriod = "day" | "week" | "month"

export function OperationalEfficiencyTab() {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("day")

  const [selectedZone, setSelectedZone] = useState("High-Turnover")
  const [timeRange, setTimeRange] = useState("7")

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return "bg-green-500"
    if (utilization >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getColor = (value: number) => {
    return value === 1 ? "bg-orange-400" : "bg-neutral-100"
  }

  const getFilterLabel = (period: FilterPeriod) => {
    switch (period) {
      case "day":
        return "Today"
      case "week":
        return "This Week"
      case "month":
        return "This Month"
      default:
        return "Day"
    }
  }

  const getAccuracyBadgeVariant = (accuracy: number) => {
    if (accuracy >= 95) return "default"
    if (accuracy >= 90) return "secondary"
    return "destructive"
  }

  const filteredData = useMemo(() => {
    const now = new Date()

    return rawOrderData.filter((item) => {
      const itemDate = parseISO(item.timestamp)

      switch (filterPeriod) {
        case "day":
          return isToday(itemDate)
        case "week":
          return isThisWeek(itemDate, { weekStartsOn: 1 }) // Monday start
        case "month":
          return isThisMonth(itemDate)
        default:
          return true
      }
    })
  }, [filterPeriod])

  const aggregatedData = useMemo(() => {
    const shiftMap = new Map()

    filteredData.forEach((item) => {
      const existing = shiftMap.get(item.shift) || {
        shift: item.shift,
        teamA: 0,
        teamB: 0,
        teamC: 0,
        teamAErrors: 0,
        teamBErrors: 0,
        teamCErrors: 0,
      }

      existing.teamA += item.teamA
      existing.teamB += item.teamB
      existing.teamC += item.teamC
      existing.teamAErrors += item.teamAErrors
      existing.teamBErrors += item.teamBErrors
      existing.teamCErrors += item.teamCErrors

      shiftMap.set(item.shift, existing)
    })

    const shifts = ["Morning", "Afternoon", "Night"]
    return shifts.map(
      (shift) =>
        shiftMap.get(shift) || {
          shift,
          teamA: 0,
          teamB: 0,
          teamC: 0,
          teamAErrors: 0,
          teamBErrors: 0,
          teamCErrors: 0,
        },
    )
  }, [filteredData])

  const storageStats = {
  totalSlotsAvailable,
  totalSlots,
  highUtil,
  lowUtil,
  avgUtil,
};

  const summaryStats = useMemo(() => {
    const totalOrders = aggregatedData.reduce((sum, shift) => sum + shift.teamA + shift.teamB + shift.teamC, 0)
    const totalErrors = aggregatedData.reduce(
      (sum, shift) => sum + shift.teamAErrors + shift.teamBErrors + shift.teamCErrors,
      0,
    )
    const accuracy = totalOrders > 0 ? ((totalOrders - totalErrors) / totalOrders) * 100 : 0

    return { totalOrders, totalErrors, accuracy }
  }, [aggregatedData])  


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Storage Utilization Heatmap */}
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="flex dark:text-white h-5 w-5 text-black" />
          Storage Utilization Heatmap
        </CardTitle>
        <CardDescription className="text-gray-600">
          Warehouse layout with real-time utilization
        </CardDescription>
      </CardHeader>

        <CardContent className="flex flex-col items-center">
          {/* Warehouse layout grid */}
          <div className="grid gap-1 mb-6" style={{ gridTemplateRows: `repeat(${warehouseLayout.length}, auto)` }}>
          {warehouseLayout.map((row, rowIndex) => (
            <Fragment key={rowIndex}>
              {/* Insert horizontal aisle after row 4 and row 6 (0-based indices 3 and 5) */}
              {(rowIndex === 4 || rowIndex === 6) && (
                <div className="h-2" />
              )}
              
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${row.length + Math.floor(row.length / 2)}, minmax(0, 1fr))`,
                }}
              >
                {row.map((util, colIndex) => {
                  const isAisle =
                    colIndex === 1 || (colIndex > 1 && (colIndex - 1) % 2 === 0 && colIndex !== row.length - 1);
                  return (
                    <Fragment key={colIndex}>
                      {isAisle && <div className="w-2" />}
                      <div
                        className={`relative w-5 h-5 rounded transition-all duration-150 ease-in-out
                          hover:scale-110
                          hover:bg-white hover:text-black
                          dark:hover:bg-white dark:hover:text-black
                          hover:ring-2 hover:ring-white
                          ${getUtilColor(util)}`}
                        title={util > 0 ? `Utilization: ${util}%` : "Empty"}
                      >
                        <span
                          className="absolute inset-0 flex items-center justify-center text-[10px] font-medium opacity-0 scale-75 transition-all duration-200
                            hover:opacity-100 hover:scale-100"
                        >
                          {util > 0 ? `${util}%` : ""}
                        </span>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </Fragment>
          ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap py-3 justify-center gap-4 text-xs text-white/80">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="dark:text-white text-black">{"100-80% (Green)"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-orange-400"></div>
              <span className="dark:text-white text-black">{"80-60% (Orange)"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="dark:text-white text-black">{"<60-40% (Yellow)"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="dark:text-white text-black">{"<40% (Red)"}</span>
            </div>
          </div>
        
          <div className="border-t pt-4">
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center bg-gray-100 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{storageStats.totalSlotsAvailable}</div>
                <div className="text-xs text-gray-600 mt-1">Total Slots Available</div>
              </div>

              <div className="text-center bg-blue-50 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-blue-600">{storageStats.totalSlots}</div>
                <div className="text-xs text-gray-600 mt-1">Active Slots</div>
              </div>

              <div className="text-center bg-red-50 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-red-600">{storageStats.lowUtil}</div>
                <div className="text-xs text-gray-600 mt-1">Underutilized (&lt; 40%)</div>
              </div>

              <div className="text-center bg-green-50 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-green-600">{storageStats.avgUtil.toFixed(1)}%</div>
                <div className="text-xs text-gray-600 mt-1">Avg Utilization</div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Picking Path Efficiency */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Picking Path Efficiency (Avg Time per Order)</CardTitle>
              <CardDescription>Average pick time with outlier detection</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7d</SelectItem>
                  <SelectItem value="30">30d</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              avgTime: {
                label: "Avg Time (min)",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ComposedChart data={pickingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                interval={0}
                ticks={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              />
              <YAxis label={{ value: "Time (min)", angle: -90, position: 'insideLeft' }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="avgTime" stroke="var(--color-avgTime)" strokeWidth={2} />
              <Scatter
                name="Outliers"
                data={outliers}
                dataKey="time"
                fill="hsl(var(--destructive))"
                shape="circle"
              />
            </ComposedChart>
          </ChartContainer>
          <div className="flex flex-wrap gap-2 mt-4">
            {outliers
              .filter(order => order.time !== null)
              .map(order => (
                <Badge variant="destructive" key={order.id}>
                  {order.id}: {order.time}min
                </Badge>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-gray-100 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{avgPickTime.toFixed(1)} min</div>
            <div className="text-xs text-gray-600 mt-1">Avg Pick Time</div>
          </div>
          <div className="text-center bg-yellow-50 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-yellow-600">{slowestDay.day}</div>
            <div className="text-xs text-gray-600 mt-1">Slowest Day</div>
          </div>
          <div className="text-center bg-red-50 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-red-600">{totalOutliers}</div>
            <div className="text-xs text-gray-600 mt-1">Total Outliers</div>
          </div>
          <div className="text-center bg-blue-50 dark:bg-zinc-800 p-3 rounded-lg hover:scale-105 transition-transform">
            <div className="text-xl font-bold text-blue-600">{worstOutlier.orderId || "-"}</div>
            <div className="text-xs text-gray-600 mt-1">Worst Outlier</div>
            <div className="text-xs text-gray-500">{worstOutlier.time} min</div>
          </div>
        </div>
        </CardContent>
      </Card>

      {/* Order Accuracy by Shift */}
      <Card>
        <CardHeader>
          <CardTitle>Order Accuracy by Shift</CardTitle>
          <CardDescription>Team performance and error tracking</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Stacked Bar Chart */}
          <ChartContainer
            config={{
              teamA: { label: "Team A", color: "hsl(var(--chart-1))" },
              teamB: { label: "Team B", color: "hsl(var(--chart-2))" },
              teamC: { label: "Team C", color: "hsl(var(--chart-3))" },
            }}

          >
            <BarChart data={accuracyData} barCategoryGap={12}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shift" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="teamA" stackId="a" fill="hsl(var(--chart-1))" />
              <Bar dataKey="teamB" stackId="a" fill="hsl(var(--chart-2))" />
              <Bar dataKey="teamC" stackId="a" fill="hsl(var(--chart-3))" />
            </BarChart>
          </ChartContainer>

          {/* Error Summary Badges */}
          <div className="flex flex-wrap gap-2 mt-4 text-sm">
            {accuracyData.map((shift) => (
              <Badge key={shift.shift} variant="outline">
                {shift.shift}: {shift.errors} errors
              </Badge>
            ))}
          </div>

          {/* Error Breakdown Panel */}
          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-gray-700">Error Breakdown by Team & Shift</h4>
              <Badge variant="outline" className="text-xs">
                {getFilterLabel(filterPeriod)}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {aggregatedData.map((shift, shiftIndex) => (
                <div
                  key={shift.shift}
                  className="dark:bg-zinc-800 p-4 rounded-lg 
                  dark:hover:bg-zinc-700 
                  transition-all duration-200 ease-in-out cursor-pointer 
                  dark:border-zinc-700 
                  hover:scale-105 group">
                  <div className="dark:text-white text-black text-sm font-medium mb-3 text-center">{shift.shift}</div>
                  <div className="space-y-2">
                    {[
                      { team: "Team A", color: "hsl(var(--chart-1))", errors: shift.teamAErrors },
                      { team: "Team B", color: "hsl(var(--chart-2))", errors: shift.teamBErrors },
                      { team: "Team C", color: "hsl(var(--chart-3))", errors: shift.teamCErrors },
                    ].map(({ team, color, errors }) => (
                      <div key={team} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${color}`}></div>
                          <span>{team}</span>
                        </div>
                        <Badge
                          variant={errors === 0 ? "default" : errors <= 2 ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {errors} errors
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500 text-center">
                      {shift.teamA + shift.teamB + shift.teamC} total orders
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center dark:bg-zinc-800 p-3 bg-blue-50 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-blue-600">{summaryStats.totalOrders}</div>
                <div className="text-xs text-gray-600 mt-1">Total Orders</div>
                <div className="text-xs text-muted-foreground mt-1">{getFilterLabel(filterPeriod)}</div>
              </div>

              <div className="text-center dark:bg-zinc-800 p-3 bg-red-50 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-red-600">{summaryStats.totalErrors}</div>
                <div className="text-xs text-gray-600 mt-1">Total Errors</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {summaryStats.totalOrders > 0
                    ? ((summaryStats.totalErrors / summaryStats.totalOrders) * 100).toFixed(1)
                    : "0.0"}
                  % error rate
                </div>
              </div>

              <div className="text-center dark:bg-zinc-800 p-3 bg-green-50 rounded-lg hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-green-600">{summaryStats.accuracy.toFixed(1)}%</div>
                <div className="text-xs text-gray-600 mt-1">Overall Accuracy</div>
                <div className="flex justify-center mt-1">
                  <Badge variant={getAccuracyBadgeVariant(summaryStats.accuracy)} className="text-xs">
                    {summaryStats.accuracy >= 95
                      ? "Excellent"
                      : summaryStats.accuracy >= 90
                        ? "Good"
                        : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Downtime Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Downtime Impact</CardTitle>
          <CardDescription>Downtime hours vs delayed orders correlation</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              downtime: {
                label: "Downtime (hrs)",
                color: "hsl(var(--chart-1))",
              },
              delayedOrders: {
                label: "Delayed Orders",
                color: "hsl(var(--chart-2))",
              },
            }}
          >
            <ComposedChart data={downtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="left" dataKey="downtime" fill="var(--color-downtime)" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="delayedOrders"
                stroke="var(--color-delayedOrders)"
                strokeWidth={2}
              />
            </ComposedChart>
          </ChartContainer>

          <div className="flex flex-wrap gap-2 py-1 text-sm">
            {Object.entries(equipmentTotals).map(([equipment, data]) => (
              <Badge key={equipment} variant="outline">
                {equipment}: {data.downtime.toFixed(1)} hrs, {data.delayedOrders} delayed orders
              </Badge>
            ))}
            
            {/* Full-width average line */}
            <div className="w-full mt-2 font-medium text-muted-foreground">
              Average Downtime per Delayed Order: {avgDowntimePerOrder} hrs
            </div>
          </div>


          <div className="space-y-2 py-0">
            <h4 className="text-sm font-medium pt-2 text-gray-700">Equipment Downtime Frequency</h4>
            <div className="grid grid-cols-2 gap-2 py-0">
              {equipmentDowntime.map((item, index) => (
                <div
                  key={item.type}
                  className="dark:bg-zinc-800 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer hover:scale-102"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.type}</span>
                    <Badge variant={item.frequency > 10 ? "destructive" : "secondary"}>{item.frequency}</Badge>
                  </div>
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.frequency > 10 ? "bg-red-500" : "bg-blue-500"}`}
                        style={{ width: `${Math.min((item.frequency / 20) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">incidents this week</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="border-t">
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div
                className="dark:bg-zinc-800 text-center p-3 bg-blue-50 rounded-lg hover:scale-105 transition-transform"
              >
                <div className="text-2xl font-bold text-blue-600">
                  {downtimeData.reduce((sum, day) => sum + day.downtime, 0).toFixed(1)}h
                </div>
                <div className="text-xs text-gray-600 mt-1">Total Downtime</div>
              </div>
              <div
                className="dark:bg-zinc-800 text-center p-3 bg-red-50 rounded-lg hover:scale-105 transition-transform"
              >
                <div className="text-2xl font-bold text-red-600">
                  {downtimeData.reduce((sum, day) => sum + day.delayedOrders, 0)}
                </div>
                <div className="text-xs text-gray-600 mt-1">Delayed Orders</div>
              </div>
              <div
                className="dark:bg-zinc-800 text-center p-3 bg-green-50 rounded-lg hover:scale-105 transition-transform"
              >
                <div className="text-2xl font-bold text-green-600">
                  {equipmentDowntime.reduce((sum, eq) => sum + eq.frequency, 0)}
                </div>
                <div className="text-xs text-gray-600 mt-1">Total Incidents</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
