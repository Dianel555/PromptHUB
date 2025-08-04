"use client"

import React from "react"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface EnhancedProgressProps {
  value: number
  max?: number
  label?: string
  status?: "idle" | "running" | "success" | "error"
  showPercentage?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function EnhancedProgress({
  value,
  max = 100,
  label,
  status = "idle",
  showPercentage = true,
  className,
  size = "md",
  animated = true,
}: EnhancedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }

  const getStatusColor = () => {
    switch (status) {
      case "running":
        return "bg-blue-500"
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "running":
        return <Clock className="size-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="size-4 text-green-500" />
      case "error":
        return <AlertCircle className="size-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {label && (
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {label}
              </span>
            )}
          </div>
          {showPercentage && (
            <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getStatusColor(),
            animated && status === "running" && "animate-pulse"
          )}
          style={{ width: `${percentage}%` }}
        />

        {/* 闪烁效果 */}
        {status === "running" && (
          <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
      </div>

      {/* 状态文本 */}
      {status !== "idle" && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {status === "running" && "测试进行中..."}
          {status === "success" && "测试完成"}
          {status === "error" && "测试失败"}
        </div>
      )}
    </div>
  )
}

interface TestProgressProps {
  currentStep: number
  totalSteps: number
  stepName?: string
  isRunning?: boolean
  className?: string
}

export function TestProgress({
  currentStep,
  totalSteps,
  stepName,
  isRunning = false,
  className,
}: TestProgressProps) {
  const progress = (currentStep / totalSteps) * 100
  const status = isRunning
    ? "running"
    : currentStep === totalSteps
    ? "success"
    : "idle"

  return (
    <div
      className={cn(
        "rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20",
        className
      )}
    >
      <EnhancedProgress
        value={progress}
        label={stepName || `步骤 ${currentStep}/${totalSteps}`}
        status={status}
        size="lg"
        animated={true}
      />

      {isRunning && (
        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <div className="size-2 animate-pulse rounded-full bg-blue-500" />
          正在执行测试...
        </div>
      )}
    </div>
  )
}