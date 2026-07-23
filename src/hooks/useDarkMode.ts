import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

function getInitialDarkMode(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState(getInitialDarkMode)

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  const toggle = () => setIsDark((prev) => !prev)

  return [isDark, toggle]
}
