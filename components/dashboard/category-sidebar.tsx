"use client"

import { cn } from "@/lib/utils"
import { metrics } from "./kpi-grid"

type CategoryStatus = "green" | "yellow" | "red"

interface Category {
  id: string
  name: string
  status: CategoryStatus
}

export const categories: Category[] = [
  { id: "microclimate", name: "Микроклимат", status: "green" },
  { id: "production", name: "Производственные параметры", status: "green" },
  { id: "consumption", name: "Потребление ресурсов", status: "green" },
  { id: "herd", name: "Состояние стада", status: "green" },
  // { id: "thermal", name: "Термический комфорт", status: "green" },
  // { id: "humidity", name: "Влажностный режим", status: "green" },
  // { id: "air", name: "Качество воздуха и вентиляция", status: "yellow" },
  // { id: "lighting", name: "Освещение", status: "green" },
  // { id: "feeding", name: "Кормление и конверсия", status: "green" },
  // { id: "water", name: "Поение и водоснабжение", status: "green" },
  // { id: "density", name: "Плотность посадки", status: "green" },
  // { id: "zootech", name: "Зоотехнические показатели", status: "red" },
  // { id: "sanitation", name: "Подстилка и санитария", status: "green" },
  // { id: "veterinary", name: "Ветеринарные параметры", status: "green" },
  

]

const statusColors: Record<CategoryStatus, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
}

// Функция для вычисления статуса категории на основе метрик
const getCategoryStatus = (categoryId: string): CategoryStatus => {
  // Находим все метрики для данной категории
  const categoryMetrics = metrics.filter(metric => metric.categoryId === categoryId)
  
  if (categoryMetrics.length === 0) return "green"
  
  // Проверяем наличие критических и предупреждающих метрик
  const hasCritical = categoryMetrics.some(metric => metric.status === "critical")
  const hasWarning = categoryMetrics.some(metric => metric.status === "warning")
  
  if (hasCritical) return "red"
  if (hasWarning) return "yellow"
  return "green"
}

interface CategorySidebarProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategorySidebar({
  activeCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  return (
    <aside className="flex flex-col h-full bg-background border-r border-zinc-800">
      <div className="px-6 py-6.5 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Технологические группы параметров
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {categories.map((category) => {
          // Вычисляем статус для каждой категории при рендере
          const status = getCategoryStatus(category.id)
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors",
                activeCategory === category.id
                  ? "bg-zinc-800/80 text-white border-l-2 border-l-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border-l-2 border-l-transparent"
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full shrink-0",
                  statusColors[status]
                )}
              />
              <span className="truncate">{category.name}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
