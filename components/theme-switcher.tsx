"use client"

import React from "react"
import { BookOpen, Monitor, Moon, Shield, Sun, Wand2 } from "lucide-react"

// Corrected import path
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useTheme } from "./theme-provider"

interface ThemeSwitcherProps {
  language: "zh" | "en"
}

export function ThemeSwitcher({ language }: ThemeSwitcherProps) {
  // useTheme now comes from our custom provider
  const { theme, setTheme, resolvedTheme } = useTheme()

  const themes = [
    {
      value: "light",
      label: language === "zh" ? "白天模式" : "Light",
      icon: Sun,
    },
    {
      value: "dark",
      label: language === "zh" ? "暗黑模式" : "Dark",
      icon: Moon,
    },
    {
      value: "paper",
      label: language === "zh" ? "纸质模式" : "Paper",
      icon: BookOpen,
    },
    {
      value: "eye-protection",
      label: language === "zh" ? "护眼模式" : "Eye Care",
      icon: Shield,
    },
    {
      value: "auto",
      label: language === "zh" ? "自动模式" : "Auto",
      icon: Wand2,
    },
    {
      value: "system",
      label: language === "zh" ? "跟随系统" : "System",
      icon: Monitor,
    },
  ]

  // Find the currently active theme to display its icon
  const currentThemeConfig =
    themes.find((t) => t.value === theme) ||
    themes.find((t) => t.value === "system")
  const CurrentIcon = currentThemeConfig?.icon || Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <CurrentIcon className="size-[1.2rem] transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value as any)} // setTheme is now robust
            className={theme === themeOption.value ? "bg-accent" : ""}
          >
            <themeOption.icon className="mr-2 size-4" />
            <span>{themeOption.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}