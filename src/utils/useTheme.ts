import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme-preference'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

function applyThemeToDocument(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initialTheme = readStoredTheme() ?? getSystemTheme()
    setTheme(initialTheme)
    applyThemeToDocument(initialTheme)
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }

    applyThemeToDocument(theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme, isReady])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  }
}

export type { Theme }