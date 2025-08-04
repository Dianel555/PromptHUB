"use client"

import { createContext, useContext, useEffect, useState } from "react"

// Expanded theme type to include all options
type Theme = "light" | "dark" | "system" | "paper" | "eyecare"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme // The user's selected preference
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark" | "paper" | "eyecare" // The actual theme applied to the DOM
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light", // Default to light before hydration
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<
    "light" | "dark" | "paper" | "eyecare"
  >("light")
  const [mounted, setMounted] = useState(false)

  // Effect to run on the client after mounting
  useEffect(() => {
    setMounted(true)
    // Retrieve the saved theme from localStorage
    const savedTheme = localStorage.getItem(storageKey) as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [storageKey])

  // Effect to apply the theme to the DOM
  useEffect(() => {
    // Don't run on server or before mount
    if (!mounted) return

    const root = window.document.documentElement
    let currentTheme: "light" | "dark" | "paper" | "eyecare"

    // Resolve the theme to be applied
    if (theme === "system") {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    } else {
      // Direct themes: 'light', 'dark', 'paper', 'eyecare'
      currentTheme = theme as "light" | "dark" | "paper" | "eyecare"
    }

    // Update the DOM
    root.classList.remove("light", "dark", "paper", "eyecare")
    root.classList.add(currentTheme)

    // Update the resolved theme state
    setResolvedTheme(currentTheme)
  }, [theme, mounted])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Persist the user's choice to localStorage on the client
      if (mounted) {
        localStorage.setItem(storageKey, newTheme)
      }
      setTheme(newTheme)
    },
    resolvedTheme,
  }

  // Always render with the current value to avoid hydration mismatch
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <div suppressHydrationWarning>{children}</div>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
