"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OperationalEfficiencyTab } from "@/components/operational-efficiency-tab"
import { FinancialMetricsTab } from "@/components/financial-metrics-tab"
import { StrategicGrowthTab } from "@/components/strategic-growth-tab"

export default function WarehouseDashboard() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Warehouse Intelligence Dashboard</h1>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="operational" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="operational">Operational Efficiency</TabsTrigger>
            <TabsTrigger value="financial">Financial Metrics</TabsTrigger>
            <TabsTrigger value="strategic">Strategic Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="operational" className="space-y-6">
            <OperationalEfficiencyTab />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <FinancialMetricsTab />
          </TabsContent>

          <TabsContent value="strategic" className="space-y-6">
            <StrategicGrowthTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
