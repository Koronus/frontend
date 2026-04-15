"use client"

import { useState } from "react"
import { KpiCard } from "./kpi-card"
import { categories } from "./category-sidebar"
import {
  Thermometer,
  Droplets,
  CheckCircle,
  Wheat,
  Activity,
  Users,
  Wind,
  Droplet,
  Scale,
  Utensils,
} from "lucide-react"

interface KpiGridProps {
  onSelectMetric: (metric: string) => void
  activeMetric: string
  activeCategory: string
}

interface Metric {
  id: string
  icon: any
  title: string
  value: string
  norm: string
  trend: "up" | "down" | "stable"
  trendGood: "up" | "down" 
  status: "normal" | "warning" | "critical"
  categoryId: string
  ageGroup?: string  // Добавлено поле для возрастной группы
}

// Тип для возраста птиц
type BirdAge = "0-3" | "21-30"

// Данные метрик для разных возрастов
const metricsByAge: Record<BirdAge, Metric[]> = {
  "0-3": [
    // ========== Микроклимат (0-3 дня) ==========
    {
      id: "temperature_0_3",
      icon: Thermometer,
      title: "Температура",
      value: "40.2°C",
      norm: "40.0-40.8",
      trend: "up" as const,
      trendGood: "up" as const,
      status: "normal" as const,
      categoryId: "microclimate",
      ageGroup: "0-3",
    },
    {
      id: "humidity_0_3",
      icon: Droplets,
      title: "Влажность",
      value: "70%",
      norm: "65-75%",
      trend: "stable" as const,
      trendGood: "up" as const,
      status: "normal" as const,
      categoryId: "microclimate",
      ageGroup: "0-3",
    },
    {
      id: "ammonia_0_3",
      icon: Wind,
      title: "Аммиак",
      value: "8 ppm",
      norm: "< 5 ppm",
      trend: "up" as const,
      trendGood: "down" as const,
      status: "warning" as const,
      categoryId: "microclimate",
      ageGroup: "0-3",
    },
    // ========== Потребление ресурсов (0-3 дня) ==========
    {
      id: "feed_intake_0_3",
      icon: Utensils,
      title: "Потребление корма",
      value: "15 г",
      norm: "14-18 г",
      trend: "up" as const,
      trendGood: "up" as const,
      status: "normal" as const,
      categoryId: "consumption",
      ageGroup: "0-3",
    },
    {
      id: "water_intake_0_3",
      icon: Droplet,
      title: "Потребление воды",
      value: "30 мл",
      norm: "28-35 мл",
      trend: "up" as const,
      trendGood: "up" as const,
      status: "normal" as const,
      categoryId: "consumption",
      ageGroup: "0-3",
    },
    // ========== Производственные параметры (0-3 дня) ==========
    {
      id: "average_weight_0_3",
      icon: Scale,
      title: "Средний вес",
      value: "45 г",
      norm: "42-48 г",
      trend: "up" as const,
      trendGood: "up" as const,
      status: "normal" as const,
      categoryId: "production",
      ageGroup: "0-3",
    },
    {
      id: "fcr_0_3",
      icon: Wheat,
      title: "Конверсия корма FCR",
      value: "1.2",
      norm: "1.1-1.3",
      trend: "up" as const,
      trendGood: "down" as const,
      status: "normal" as const,
      categoryId: "production",
      ageGroup: "0-3",
    },
    // ========== Состояние стада (0-3 дня) ==========
    {
      id: "mortality_0_3",
      icon: Activity,
      title: "Смертность",
      value: "1.2%",
      norm: "< 1.0%",
      trend: "up" as const,
      trendGood: "down" as const,
      status: "warning" as const,
      categoryId: "herd",
      ageGroup: "0-3",
    },
  ],
  "21-30": [
    // ========== Микроклимат (21-30 дней) ==========
    {
      id: "temperature_21_30",
      icon: Thermometer,
      title: "Температура",
      value: "39.8°C",
      norm: "39.4-40.5",
      trend: "up" as const,
      trendGood: "up" as const,
      status: "normal" as const,
      categoryId: "microclimate",
      ageGroup: "21-30",
    },
    {
      id: "humidity_21_30",
      icon: Droplets,
      title: "Влажность",
      value: "65%",
      norm: "55-70%",
      trend: "down" as const,
      trendGood: "up" as const,
      status: "normal" as const,
      categoryId: "microclimate",
      ageGroup: "21-30",
    },
    {
      id: "ammonia_21_30",
      icon: Wind,
      title: "Аммиак",
      value: "15 ppm",
      norm: "< 10 ppm",
      trend: "up" as const,
      trendGood: "down" as const,
      status: "warning" as const,
      categoryId: "microclimate",
      ageGroup: "21-30",
    },
    // ========== Потребление ресурсов (21-30 дней) ==========
    {
      id: "feed_intake_21_30",
      icon: Utensils,
      title: "Потребление корма",
      value: "125 г",
      norm: "120-130 г",
      trend: "up" as const,
      trendGood: "down" as const,
      status: "normal" as const,
      categoryId: "consumption",
      ageGroup: "21-30",
    },
    {
      id: "water_intake_21_30",
      icon: Droplet,
      title: "Потребление воды",
      value: "250 мл",
      norm: "240-260 мл",
      trend: "up" as const,
      trendGood: "down" as const,
      status: "normal" as const,
      categoryId: "consumption",
      ageGroup: "21-30",
    },
    // ========== Производственные параметры (21-30 дней) ==========
    {
      id: "average_weight_21_30",
      icon: Scale,
      title: "Средний вес",
      value: "1.8 кг",
      norm: "1.7-1.9 кг",
      trend: "up" as const,
      trendGood: "up" as const,
      status: "normal" as const,
      categoryId: "production",
      ageGroup: "21-30",
    },
    {
      id: "fcr_21_30",
      icon: Wheat,
      title: "Конверсия корма FCR",
      value: "1.65",
      norm: "1.6-1.8",
      trend: "up" as const,
      trendGood: "down" as const,
      status: "normal" as const,
      categoryId: "production",
      ageGroup: "21-30",
    },
    // ========== Состояние стада (21-30 дней) ==========
    {
      id: "mortality_21_30",
      icon: Activity,
      title: "Смертность",
      value: "2.1%",
      norm: "< 1.5%",
      trend: "up" as const,
      trendGood: "down" as const,
      status: "critical" as const,
      categoryId: "herd",
      ageGroup: "21-30",
    },
  ],
}

// Плоский массив для обратной совместимости (используем 21-30 как основной)
export const metrics = metricsByAge["21-30"]

export function KpiGrid({ onSelectMetric, activeMetric, activeCategory }: KpiGridProps) {
  const [selectedAge, setSelectedAge] = useState<BirdAge>("21-30")
  
  // Получаем метрики для выбранного возраста
  const currentMetrics = metricsByAge[selectedAge]
  
  const currentCategory = categories.find(cat => cat.id === activeCategory)
  const categoryTitle = currentCategory?.name || "Показатели"
  const filteredMetrics = currentMetrics.filter(metric => metric.categoryId === activeCategory)

  // Обработчик изменения возраста
  const handleAgeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAge(event.target.value as BirdAge)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {categoryTitle}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Текущие метрики по выбранной группе параметров
            </p>
          </div>
          
          {/* Выпадающий список для выбора возраста */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-400">Возраст птиц:</label>
            <select
              value={selectedAge}
              onChange={handleAgeChange}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer hover:bg-zinc-800 transition-colors"
            >
              <option value="0-3">0-3 дня</option>
              <option value="21-30">21-30 дней</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {filteredMetrics.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-zinc-500 mb-2">Нет метрик для выбранной категории</p>
              <p className="text-sm text-zinc-600">
                Выберите другую категорию или возрастную группу
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMetrics.map((metric) => (
              <KpiCard
                key={metric.id}
                icon={metric.icon}
                title={metric.title}
                value={metric.value}
                norm={metric.norm}
                trend={metric.trend}
                trendGood={metric.trendGood}
                status={metric.status}
                onClick={() => onSelectMetric(metric.id)}
                isActive={activeMetric === metric.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}