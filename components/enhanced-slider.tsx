"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface EnhancedSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label: string
  description?: string
  showValue?: boolean
  className?: string
  disabled?: boolean
}

export function EnhancedSlider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  label,
  description,
  showValue = true,
  className,
  disabled = false,
}: EnhancedSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {showValue && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
              {(value * 100).toFixed(0)}%
            </span>
            <div
              className={cn(
                "size-3 rounded-full border-2 transition-colors",
                percentage > 75
                  ? "border-green-500 bg-green-500"
                  : percentage > 50
                  ? "border-yellow-500 bg-yellow-500"
                  : percentage > 25
                  ? "border-orange-500 bg-orange-500"
                  : "border-red-500 bg-red-500"
              )}
            />
          </div>
        )}
      </div>

      <div className="relative">
        {/* 自定义滑块轨道 */}
        <div className="relative">
          <Slider
            value={[value]}
            onValueChange={(values) => onChange(values[0])}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={cn(
              "slider-enhanced w-full",
              disabled && "cursor-not-allowed opacity-50"
            )}
          />

          {/* 进度填充效果 */}
          <div
            className="pointer-events-none absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* 数值标记点 */}
        <div className="mt-2 flex justify-between text-xs text-gray-400 dark:text-gray-500">
          <span className="flex flex-col items-center">
            <div className="mb-1 size-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            {min}
          </span>
          <span className="flex flex-col items-center">
            <div className="mb-1 size-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            {((min + max) / 2).toFixed(1)}
          </span>
          <span className="flex flex-col items-center">
            <div className="mb-1 size-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            {max}
          </span>
        </div>
      </div>
    </div>
  )
}

interface SliderGroupProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function SliderGroup({ title, children, className }: SliderGroupProps) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50",
        className
      )}
    >
      <h4 className="border-b border-gray-200 pb-2 font-medium text-gray-900 dark:border-gray-700 dark:text-gray-100">
        {title}
      </h4>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
