"use client"

import { useEffect, useState } from "react"
import { CategorySidebar, categories } from "@/components/dashboard/category-sidebar"
import { DetailPanel } from "@/components/dashboard/detail-panel"
import { DashboardHeader } from "@/components/dashboard/header"
import { KpiGrid } from "@/components/dashboard/kpi-grid"

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "zootech")
  const [activeMetric, setActiveMetric] = useState("mortality")
  const [showDetailPanel, setShowDetailPanel] = useState(false)

  useEffect(() => {
    import("@/components/dashboard/kpi-grid").then(({ metrics }) => {
      const firstMetricInCategory = metrics.find(
        (metric) => metric.categoryId === activeCategory
      )

      if (firstMetricInCategory) {
        setActiveMetric(firstMetricInCategory.id)
        setShowDetailPanel(true)
      } else {
        setShowDetailPanel(false)
      }
    })
  }, [activeCategory])

  return (
    <div className="min-h-screen px-3 py-3 md:px-5 md:py-5">
      <div className="dashboard-shell mx-auto max-w-[1680px] rounded-[28px]">
        <DashboardHeader />

        <div className="space-y-4 p-3 md:p-4">
          <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_420px]">
            <div className="order-2 xl:order-1">
              <CategorySidebar
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            <div className="order-1 min-w-0 xl:order-2">
              <div className="dashboard-panel">
                <KpiGrid
                  onSelectMetric={(metric) => {
                    setActiveMetric(metric)
                    setShowDetailPanel(true)
                  }}
                  activeMetric={activeMetric}
                  activeCategory={activeCategory}
                />
              </div>
            </div>

            {showDetailPanel && (
              <div className="order-3">
                <DetailPanel
                  onClose={() => setShowDetailPanel(false)}
                  activeMetric={activeMetric}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
